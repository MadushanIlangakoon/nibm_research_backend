const supabase = require('../config/supabaseClient');

async function createTestAnswer({ student_id, lecture_id, question_id, student_answer, is_correct, status, response_time }) {
    const { data, error } = await supabase
        .from('test_answers')
        .insert(
            [{
                student_id,
                lecture_id,
                question_id,
                student_answer,
                is_correct,
                status,
                response_time
            }],
            { returning: 'representation' }
        );
    if (error) throw error;
    if (!data || data.length === 0) {
        return { success: true, message: "Insert succeeded but no rows returned." };
    }
    return data[0];
}

module.exports = { createTestAnswer };
