const supabase = require('../config/supabaseClient');

async function createTestQuestion({ test_question_text, test_question_answer, hint, explanation, lectures_id }) {
    const { data, error } = await supabase
        .from('test_questions')
        .insert(
            [{ test_question_text, test_question_answer, hint, explanation, lectures_id }],
            { returning: 'representation' }
        );
    if (error) throw error;
    // Instead of throwing an error if no data is returned, return a success message.
    if (!data || data.length === 0) {
        return { success: true, message: "Insert may have succeeded, but no rows were returned." };
    }
    return data[0];
}

async function getTestQuestionsByLecture(lectures_id) {
    const { data, error } = await supabase
        .from('test_questions')
        .select('*')
        .eq('lectures_id', lectures_id);
    if (error) throw error;
    return data;
}

async function updateTestQuestion({ id, test_question_text, test_question_answer, hint, explanation, lectures_id }) {
    const { data, error } = await supabase
        .from('test_questions')
        .update(
            { test_question_text, test_question_answer, hint, explanation, lectures_id },
            { returning: 'representation' }
        )
        .eq('id', id);
    if (error) throw error;
    if (!data || data.length === 0) {
        return { success: true, message: "Update may have succeeded, but no rows were returned." };
    }
    return data[0];
}

async function deleteTestQuestion(id) {
    const { data, error } = await supabase
        .from('test_questions')
        .delete()
        .eq('id', id);
    if (error) throw error;
    // Delete may not return data; return a success message.
    return { success: true, message: "Question deleted successfully." };
}

module.exports = { createTestQuestion, getTestQuestionsByLecture, updateTestQuestion, deleteTestQuestion };
