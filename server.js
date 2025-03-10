const sticky = require('sticky-session');
const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');
const httpAgent = new http.Agent({ keepAlive: true });
require('dotenv').config();

// Import your route modules.
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const lectureRoutes = require('./routes/lectureRoutes');
const lectureStatisticsRoutes = require('./routes/lectureStatisticsRoutes');
const chatRoutes = require('./routes/chatRoutes');
const generalQuestionsRoutes = require('./routes/generalQuestionsRoutes');
const testQuestionsRoutes = require('./routes/testQuestionsRoutes');
const generalAnswersRoutes = require('./routes/generalAnswersRoutes');
const testAnswersRoutes = require('./routes/testAnswersRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');




// Create an Axios instance with keep-alive enabled.
const axiosInstance = axios.create({
    httpAgent: httpAgent,
});

const PORT = process.env.PORT || 5000;

// In-memory mapping for student IDs to socket IDs.
// For a production environment in a cluster, consider using a shared store.
const studentSockets = {};

function createServer() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use('/api/auth', authRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/enrollments', enrollmentRoutes);
    app.use('/api/lectures', lectureRoutes);
    app.use('/api/lecture_statistics', lectureStatisticsRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/general_questions', generalQuestionsRoutes);
    app.use('/api/test_questions', testQuestionsRoutes);
    app.use('/api/general_answers', generalAnswersRoutes);
    app.use('/api/test_answers', testAnswersRoutes);
    app.use('/api/teachers', teacherRoutes);
    app.use('/api/students', studentRoutes);

    const server = http.createServer(app);
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        }
    });

    const redisAdapter = require('socket.io-redis');
    io.adapter(redisAdapter({
        host: 'redis-16626.c251.east-us-mz.azure.redns.redis-cloud.com',
        port: 16626,
        auth_pass: 'gL0jVUBq1e30zJYwNNzAZOYsmV2YKqEy'
    }));

    io.on("connection", socket => {
        console.log(`Worker ${process.pid} - New client connected: ${socket.id}`);

        let frameBatch = [];
        let frameCounter = 0;
        const skipCount = 2;

        socket.on("inference_frame", data => {
            frameCounter++;
            if (frameCounter % skipCount !== 0) return;
            if (data && data.image) {
                // Preserve studentID and studentName in the data
                frameBatch.push(data);
            }
        });

        const batchInterval = setInterval(() => {
            if (frameBatch.length > 0) {
                const batchToSend = frameBatch;
                frameBatch = [];
                // console.log("student", batchToSend)
                axiosInstance.post("http://localhost:5001/inference/infer_frame", { images: batchToSend })
                    .then(response => {
                        // Assume response.data is structured as:
                        // { combined: <combinedPrediction>, perStudent: { [studentID]: <prediction>, ... } }
                        socket.emit("inference_result", response.data);
                    })
                    .catch(error => {
                        socket.emit("inference_result", { error: "Error processing inference" });
                    });
            }
        }, 300);

        socket.on("join-room", data => {
            let roomID;
            let isStudent = false;
            let isTeacher = false;
            let studentDetails = null;

            if (typeof data === "object" && data.room) {
                roomID = data.room;
                if (data.student) {
                    isStudent = true;
                    studentDetails = data.student;
                } else if (data.teacher) {
                    isTeacher = true;
                }
            } else {
                roomID = data;
            }
            socket.join(roomID);
            console.log(`Socket ${socket.id} joined room: ${roomID}`);

            if (isStudent) {
                // If this student already has a socket, notify room to remove the old one.
                if (studentSockets[studentDetails.id]) {
                    const oldSocketId = studentSockets[studentDetails.id];
                    io.to(roomID).emit("user-disconnected", oldSocketId);
                    console.log(`Notified room ${roomID} to disconnect old socket ${oldSocketId} for student ${studentDetails.name}`);
                }
                // Update the mapping with the new socket ID.
                studentSockets[studentDetails.id] = socket.id;
                const payload = { ...studentDetails, socketID: socket.id };
                socket.to(roomID).emit("student-joined", payload);
                console.log(`Student ${studentDetails.name} joined with socket: ${socket.id}`);
            } else if (isTeacher) {
                const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);
                const otherClients = clients.filter(id => id !== socket.id);
                socket.emit("all-users", otherClients);
                socket.to(roomID).emit("user-joined", socket.id);
            } else {
                const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);
                const otherClients = clients.filter(id => id !== socket.id);
                socket.emit("all-users", otherClients);
                socket.to(roomID).emit("user-joined", socket.id);
            }
        });

        socket.on("leave-room", () => {
            console.log(`leave-room event triggered for socket: ${socket.id}`);
            // Remove the socket from our in-memory mapping.
            for (const studentId in studentSockets) {
                if (studentSockets[studentId] === socket.id) {
                    delete studentSockets[studentId];
                    console.log(`Removed student mapping for ${studentId}`);
                    break;
                }
            }
            // Explicitly leave every room except the socket's own room.
            const rooms = Array.from(socket.rooms);
            rooms.forEach(roomID => {
                if (roomID !== socket.id) {
                    socket.leave(roomID, () => {
                        console.log(`Socket ${socket.id} left room ${roomID}`);
                        // Emit disconnect notification for each room
                        socket.to(roomID).emit("user-disconnected", socket.id);
                    });
                }
            });
        });

        socket.on("meeting-ended", data => {
            // Broadcast the meeting-ended event to all rooms this socket is part of (except its own id)
            socket.rooms.forEach(roomID => {
                if (roomID !== socket.id) {
                    io.to(roomID).emit("meeting-ended", data);
                    console.log(`Broadcasting meeting-ended to room ${roomID} with data:`, data);
                }
            });
        });

        socket.on("sending-signal", payload => {
            io.to(payload.userToSignal).emit("user-signal", {
                signal: payload.signal,
                callerID: payload.callerID,
            });
        });

        socket.on("returning-signal", payload => {
            io.to(payload.callerID).emit("receiving-returned-signal", {
                signal: payload.signal,
                id: socket.id,
            });
        });

        socket.on("disconnect", () => {
            // Remove the socket from studentSockets if it belongs to a student.
            for (const studentId in studentSockets) {
                if (studentSockets[studentId] === socket.id) {
                    delete studentSockets[studentId];
                    // Notify other clients in all rooms (except the default room)
                    socket.rooms.forEach(roomID => {
                        if (roomID !== socket.id) {
                            socket.to(roomID).emit("user-disconnected", socket.id);
                        }
                    });
                    console.log(`Student with ID ${studentId} disconnected (socket: ${socket.id}).`);
                    break;
                }
            }
            clearInterval(batchInterval);
        });
    });

    return server;
}

const server = createServer();
if (!sticky.listen(server, PORT)) {
    console.log(`Master process ${process.pid} is running`);
    server.once("listening", () => {
        console.log(`Server started on port ${PORT}`);
    });
} else {
    console.log(`Worker ${process.pid} running on port ${PORT}`);
}
