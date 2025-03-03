const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes'); // your existing auth endpoints
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const lectureRoutes = require('./routes/lectureRoutes');
const chatRoutes = require('./routes/chatRoutes');
const generalQuestionsRoutes = require('./routes/generalQuestionsRoutes');
const testQuestionsRoutes = require('./routes/testQuestionsRoutes');
const generalAnswersRoutes = require('./routes/generalAnswersRoutes');
const testAnswersRoutes = require('./routes/testAnswersRoutes');

const app = express();
app.use(cors({
  origin: "https://nibm-research-frontend.onrender.com"
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/general_questions', generalQuestionsRoutes);
app.use('/api/test_questions', testQuestionsRoutes);
app.use('/api/general_answers', generalAnswersRoutes);
app.use('/api/test_answers', testAnswersRoutes);

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "https://nibm-research-frontend.onrender.com", // Allow your frontend origin
        methods: ["GET", "POST"],
    }
});

io.on("connection", socket => {
    console.log("New client connected:", socket.id);

    // Set up a frame batch for this socket.
    let frameBatch = [];
    // Frame counter to skip frames.
    let frameCounter = 0;
    // How many frames to skip (e.g. process only every 2nd frame)
    const skipCount = 4;

    // Listen for incoming inference_frame events.
    socket.on("inference_frame", data => {
        frameCounter++;
        // Only process every nth frame.
        if (frameCounter % skipCount !== 0) {
            return;
        }
        if (data && data.image) {
            frameBatch.push(data.image);
            console.log(`Socket ${socket.id}: Added frame. Batch size: ${frameBatch.length}`);
        } else {
            console.error(`Socket ${socket.id}: No image data provided in inference_frame event`);
        }
    });

    // Process batch every 500 ms.
    const batchInterval = setInterval(async () => {
        if (frameBatch.length > 0) {
            console.log(`Socket ${socket.id}: Sending batch of ${frameBatch.length} frames for inference.`);
            try {
                const response = await axios.post("https://nibm-research-ml.onrender.com/inference/infer_frame", {
                    images: frameBatch
                });
                console.log(`Socket ${socket.id}: Received batch response from Flask:`, response.data);
                // Emit the result back to the client.
                socket.emit("inference_result", response.data);
                console.log(`Socket ${socket.id}: Emitted inference_result to client.`);
            } catch (error) {
                console.error(`Socket ${socket.id}: Error processing batch:`, error.message);
                socket.emit("inference_result", { error: "Error processing inference" });
            }
            frameBatch = []; // Clear the batch after sending.
        } else {
            console.log(`Socket ${socket.id}: No frames in batch.`);
        }
    }, 500); // 500 ms interval

    socket.on("join-room", roomID => {
        socket.join(roomID);
        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);
        const otherClients = clients.filter(id => id !== socket.id);
        socket.emit("all-users", otherClients);
        socket.to(roomID).emit("user-joined", socket.id);
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

    socket.on("test_event", data => {
        console.log(`Socket ${socket.id}: Received test_event:`, data);
        socket.emit("test_response", { message: "Test successful from Node" });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        clearInterval(batchInterval);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
