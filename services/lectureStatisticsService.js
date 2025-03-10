const supabase = require('../config/supabaseClient');

async function createLectureStatistics({
                                           lecture_id,
                                           student_id,
                                           join_time,
                                           end_time,
                                           total_duration,
                                           active_time,
                                           avg_prediction,
                                           highest_prediction,
                                           lowest_prediction,
                                           gaze_duration
                                       }) {
    const payload = {
        lecture_id,
        student_id,
        join_time,
        end_time,
        total_duration,
        active_time,
        avg_prediction,
        highest_prediction,
        lowest_prediction,
        gaze_duration
    };

    const { data, error } = await supabase
        .from('lecture_statistics')
        .insert([payload], { returning: 'representation' });
    if (error) {
        throw new Error(error.message);
    }
    return data[0];
}

module.exports = {
    createLectureStatistics,
};
