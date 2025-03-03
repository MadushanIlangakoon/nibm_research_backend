const supabase = require('../config/supabaseClient');

async function requestEnrollment({ course_id, student_id }) {
    const { data, error } = await supabase
        .from('enrollments')
        .insert(
            { course_id, student_id, status: 'pending' },
            { returning: 'representation' }  // Force Supabase to return the inserted row(s)
        );
    if (error) throw error;
    // If no rows were inserted, return null instead of throwing an error.
    if (!data || data.length === 0) {
        return null;
    }
    return data[0];
}

async function getEnrollmentRequests({ teacher_id }) {
    if (!teacher_id) {
        throw new Error("teacher_id is required");
    }
    const teacherId = parseInt(teacher_id, 10);
    if (isNaN(teacherId)) {
        throw new Error("Invalid teacher_id provided");
    }

    // Get all course IDs for this teacher.
    const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id')
        .eq('teacher_id', teacherId);
    if (coursesError) throw coursesError;

    const courseIds = coursesData.map(course => course.id);
    if (courseIds.length === 0) return [];

    // Use a join with the alias "course" (assuming you have defined the relationship).
    const { data, error } = await supabase
        .from('enrollments')
        .select('*, course:course_id(*)')
        .in('course_id', courseIds);
    if (error) throw error;
    return data || [];
}

async function updateEnrollmentStatus({ enrollment_id, status }) {
    const { data, error } = await supabase
        .from('enrollments')
        .update({ status }, { returning: 'representation' })
        .eq('id', enrollment_id);
    if (error) throw error;
    if (!data || data.length === 0) {
        // Update succeeded but no row was returned (e.g., minimal return mode)
        return { success: true, message: "Update succeeded, but no row was returned" };
    }
    return data[0];
}

async function getEnrollmentsByStudent(student_id) {
    const { data, error } = await supabase
        .from('enrollments')
        .select('*, courses(*)') // join course details
        .eq('student_id', student_id);
    if (error) throw error;
    return data || [];
}

module.exports = { requestEnrollment, getEnrollmentRequests, updateEnrollmentStatus, getEnrollmentsByStudent };
