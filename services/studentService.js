// server/services/studentService.js
const supabase = require('../config/supabaseClient');

async function getAllStudents() {
    const { data, error } = await supabase.from('students').select('*');
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

async function getStudentByAuthId(auth_id) {
    const { data, error } = await supabase.from('students').select('*').eq('auth_id', auth_id).single();
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

async function updateStudentProfile(auth_id, profileData) {
    const { data, error } = await supabase.from('students').update(profileData).eq('auth_id', auth_id).single();
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// New function: Delete student profile data (except id and name) and remove from auth.
async function deleteStudentProfile(auth_id) {
    // Update students table: set email, gender, stream, photo, personalization, etc. to null
    const { data: updatedData, error: updateError } = await supabase
        .from('students')
        .update({
            email: null,
            gender: null,
            stream: null,
            photo: null,
            personalization: null,
            did_general_questions: null,
        })
        .eq('auth_id', auth_id)
        .single();
    if (updateError) {
        throw new Error(updateError.message);
    }
    // Delete the user from supabase auth.
    const { error: authError } = await supabase.auth.admin.deleteUser(auth_id);
    if (authError) {
        throw new Error(authError.message);
    }
    return updatedData;
}

module.exports = { getAllStudents, getStudentByAuthId, updateStudentProfile, deleteStudentProfile };
