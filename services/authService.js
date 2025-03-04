const supabase = require('../config/supabaseClient');

async function signup({ role, name, email, password, gender, stream }) {
    if (!['student', 'teacher'].includes(role)) {
        throw new Error('Invalid role for signup');
    }

    // Use Supabase authentication to sign up the user
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    const user = data.user;

    if (!user) {
        return { message: "Signup successful. Please check your email to confirm your account." };
    }

    // Determine table and data to insert based on role
    const table = role === 'student' ? 'students' : 'teachers';
    let dataToInsert = { auth_id: user.id, name, email };

    if (role === 'student') {
        dataToInsert.gender = gender;
        dataToInsert.stream = stream; // include the stream field
    } else {
        // For teachers, include gender and set other new fields to empty string or null
        dataToInsert.gender = gender;
        dataToInsert.subjects = '';
        dataToInsert.bio = '';
        dataToInsert.photo = '';
    }

    const { error: insertError } = await supabase.from(table).insert(dataToInsert);
    if (insertError) {
        throw insertError;
    }

    return { message: "Signup successful", user };
}

async function login({ email, password }) {
    // signInWithPassword returns { data: { user, session }, error }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        throw error;
    }

    const { user, session } = data;

    if (!user || !session) {
        throw new Error('Authentication failed');
    }

    // Check user role from your tables
    let { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('auth_id', user.id)
        .single();
    if (student) {
        return {
            user,
            role: 'student',
            profile: student,
            access_token: session.access_token,
            refresh_token: session.refresh_token,
        };
    }

    let { data: teacher } = await supabase
        .from('teachers')
        .select('*')
        .eq('auth_id', user.id)
        .single();
    if (teacher) {
        return {
            user,
            role: 'teacher',
            profile: teacher,
            access_token: session.access_token,
            refresh_token: session.refresh_token,
        };
    }

    let { data: admin } = await supabase
        .from('admins')
        .select('*')
        .eq('auth_id', user.id)
        .single();
    if (admin) {
        return {
            user,
            role: 'admin',
            profile: admin,
            access_token: session.access_token,
            refresh_token: session.refresh_token,
        };
    }

    throw new Error('User role not found');
}

async function forgotPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/reset-password", // Ensure this is in Supabase Auth settings
    });

    if (error) {
        console.error("Supabase Error:", error.message);
        throw new Error(error.message);
    }

    return { message: "Password reset link sent to email." };
}

module.exports = { signup, login, forgotPassword };
