// server/services/courseService.js
const supabase = require('../config/supabaseClient');

async function createCourse({ teacher_id, teacher_name, subject, title, description }) {
    const { data, error } = await supabase
        .from('courses')
        .insert(
            { teacher_id, teacher_name, subject, title, description },
            { returning: 'representation' }
        );

    console.log("Supabase insert => data:", data, "error:", error);

    if (error) {
        console.error("Supabase error in createCourse:", error);
        throw new Error(error.message);
    }

    if (!data || data.length === 0) {
        console.warn("No rows returned; insert may have succeeded but no data was returned.");
        return { success: true, message: "Insert may have succeeded, but no rows returned." };
    }

    console.log("Inserted row:", data[0]);
    return { success: true, insertedRow: data[0] };
}

async function getCoursesByTeacher(teacher_id) {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', teacher_id);
    if (error) throw error;
    return data;
}

async function getCourseById(id) {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
}

async function searchCourses(query) {
    const safeQuery = query.replace(/[^a-zA-Z0-9 ]/g, '');
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .or(
            `subject.ilike.%${safeQuery}%,title.ilike.%${safeQuery}%,teacher_name.ilike.%${safeQuery}%`
        );
    if (error) throw error;
    return data;
}

async function getCoursesBySubject(subject) {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .ilike('subject', `%${subject}%`);
    if (error) throw error;
    return data;
}
module.exports = { createCourse, getCoursesByTeacher, searchCourses, getCoursesBySubject, getCourseById };
