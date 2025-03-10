// server/services/lectureService.js
const supabase = require('../config/supabaseClient');

async function createLecture({ course_id, teacher_id, title, description, scheduled_at }) {
    // Generate a meeting room name using a timestamp
    const roomName = `meeting-${Date.now()}`;
    // Construct a meeting URL pointing to our custom meeting page (adjust the domain/port as needed)
    const video_call_url = `http://localhost:3000/meeting/${roomName}`;

    const payload = {
        course_id,
        teacher_id,
        title,
        description,
        scheduled_at,
        video_call_url,
        participants: [],
    };

    console.log("Creating lecture with payload:", payload);

    const { data, error } = await supabase
        .from('lectures')
        .insert(payload, { returning: 'representation' });
    if (error) {
        console.error("Supabase error in createLecture:", error);
        throw new Error(error.message);
    }
    if (!data || data.length === 0) {
        console.warn("createLecture: No rows returned, but operation may have succeeded.");
        return { success: true, message: "Lecture created (minimal return)" };
    }
    return data[0];
}



async function updateLectureStart({ lecture_id, started_at }) {
    const { data, error } = await supabase
        .from('lectures')
        .update({ started_at }, { returning: 'representation' })
        .eq('id', lecture_id);
    if (error) {
        console.error("Supabase error in updateLectureStart:", error);
        throw new Error(error.message);
    }
    if (!data || data.length === 0) {
        console.warn("updateLectureStart: No rows returned, but operation may have succeeded.");
        return { success: true, message: "Lecture updated (minimal return)" };
    }
    return data[0];
}

async function endLecture({ lecture_id, ended_at }) {
    const { data, error } = await supabase
        .from('lectures')
        .update({ ended_at }, { returning: 'representation' })
        .eq('id', lecture_id);
    if (error) {
        console.error("Supabase error in endLecture:", error);
        throw new Error(error.message);
    }
    if (!data || data.length === 0) {
        console.warn("endLecture: No rows returned, but operation may have succeeded.");
        return { success: true, message: "Lecture ended (minimal return)" };
    }
    return data[0];
}

// The other functions remain similar.
async function getOngoingLectures(course_id) {
    const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .eq('course_id', course_id)
        .not('started_at', 'is', null);
    if (error) {
        console.error("Supabase error in getOngoingLectures:", error);
        throw new Error(error.message);
    }
    return data;
}

async function getUpcomingLectures(course_id) {
    const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .eq('course_id', course_id)
        .gt('scheduled_at', new Date().toISOString());
    if (error) {
        console.error("Supabase error in getUpcomingLectures:", error);
        throw new Error(error.message);
    }
    return data;
}

async function getLectureById(id) {
    const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        console.error("Supabase error in getLectureById:", error);
        throw new Error(error.message);
    }
    return data;
}

async function getPastLectures(course_id) {
    const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .eq('course_id', course_id)
        .not('ended_at', 'is', null);
    if (error) {
        console.error("Supabase error in getPastLectures:", error);
        throw new Error(error.message);
    }
    return data;
}

async function addParticipant({ lecture_id, student_id }) {
    // First, fetch the current lecture details:
    const lecture = await getLectureById(lecture_id);
    let participants = lecture.participants || [];

    // Avoid duplicate entries
    if (!participants.includes(student_id)) {
        participants.push(student_id);
    }

    // Update the lecture record
    const { data, error } = await supabase
        .from('lectures')
        .update({ participants })
        .eq('id', lecture_id);

    if (error) {
        console.error("Supabase error in addParticipant:", error);
        throw new Error(error.message);
    }

    return data[0];
}

async function getLectureParticipants(lecture_id) {
    const lecture = await getLectureById(lecture_id);
    return lecture.participants || [];
}

async function updateAverageGaze({ lecture_id, average_gaze_duration }) {
    const { data, error } = await supabase
        .from('lectures')
        .update({ average_gaze_duration }, { returning: 'representation' })
        .eq('id', lecture_id);
    if (error) {
        throw new Error(error.message);
    }
    return data[0];
}

module.exports = {
    createLecture,
    getOngoingLectures,
    getUpcomingLectures,
    updateLectureStart,
    getLectureById,
    endLecture,
    getPastLectures,
    addParticipant,
    getLectureParticipants,
    updateAverageGaze,  // <-- new function
};
