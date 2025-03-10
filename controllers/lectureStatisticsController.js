const lectureStatisticsService = require('../services/lectureStatisticsService');

const createLectureStatistics = async (req, res) => {
    try {
        // Expect the payload to contain all necessary fields:
        // lecture_id, student_id, join_time, end_time, total_duration,
        // active_time, avg_prediction, highest_prediction, lowest_prediction, gaze_duration
        const statsPayload = req.body;
        const result = await lectureStatisticsService.createLectureStatistics(statsPayload);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createLectureStatistics,
};
