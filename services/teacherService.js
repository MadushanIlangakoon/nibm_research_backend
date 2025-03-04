const supabase = require('../config/supabaseClient');

async function getAllTeachers() {
    const { data, error } = await supabase
        .from('teachers')
        .select('*'); // Assumes columns: id, auth_id, name, email, bio, subjects, gender, photo (if available)
    if (error) {
        console.error("Supabase error in getAllTeachers:", error);
        throw new Error(error.message);
    }
    return data;
}

module.exports = { getAllTeachers };
