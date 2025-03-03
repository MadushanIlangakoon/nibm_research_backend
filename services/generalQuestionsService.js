const supabase = require('../config/supabaseClient');

async function createQuestion({ question_text, hint, correct_answer, explanation, stream }) {
    const { data, error } = await supabase
        .from('general_questions')
        .insert(
            [{ question_text, hint, correct_answer, explanation, stream }],
            { returning: 'representation' } // force Supabase to return inserted row(s)
        );
    if (error) throw error;
    if (!data || data.length === 0) {
        // Instead of throwing, return a success object
        return { success: true, message: 'Question added successfully (no row returned).' };
    }
    return data[0];
}

async function getAllQuestions() {
    const { data, error } = await supabase
        .from('general_questions')
        .select('*')
        .eq('is_deleted', false);
    if (error) throw error;
    if (error) throw error;
    return data; // Returning an empty array is fine if no records exist.
}

async function getQuestionsByStream(stream) {
    const { data, error } = await supabase
        .from('general_questions')
        .select('*')
        .eq('stream', stream)
        .eq('is_deleted', false);
    if (error) throw error;
    if (error) throw error;
    return data;
}

async function updateQuestion({ id, question_text, hint, correct_answer, explanation, stream }) {
    const { data, error } = await supabase
        .from('general_questions')
        .update({ question_text, hint, correct_answer, explanation, stream }, { returning: 'representation' })
        .eq('id', id);
    if (error) throw error;
    if (!data || data.length === 0) {
        // Instead of throwing an error, return a success message object.
        return { success: true, message: 'Update succeeded, but no row was returned.' };
    }
    return data[0];
}

async function deleteQuestion(id) {
    const { data, error } = await supabase
        .from('general_questions')
        .update({ is_deleted: true })
        .eq('id', id);
    if (error) throw error;
    if (!data || data.length === 0) {
        // Return a default success object if no row is returned.
        return { success: true, message: 'Question deleted successfully, but no row was returned.' };
    }
    return data;
}


module.exports = { createQuestion, getAllQuestions, getQuestionsByStream, updateQuestion, deleteQuestion };
