// backend/services/generalAnswersService.js
const supabase = require('../config/supabaseClient');

async function createAnswer({ student_id, question_id, student_answer, is_correct, status, response_time }) {
    const { data, error } = await supabase
        .from('general_answers')
        .insert(
            [{
                student_id,
                question_id,
                student_answer,
                is_correct,
                status,
                response_time
            }],
            { returning: 'representation' }
        );
    console.log("Supabase insert returned => data:", data, "error:", error);
    if (error) throw error;
    if (!data || data.length === 0) {
        console.warn("No rows returned; insert may have succeeded but no row was returned.");
        return { success: true, message: "Insert may have succeeded, but no row was returned." };
    }
    return data[0];
}

module.exports = { createAnswer };
