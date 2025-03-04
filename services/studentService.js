const supabase = require('../config/supabaseClient');

async function updateProfile({ auth_id, name, gender, stream, photo }) {
    const updateData = { name, gender, stream, photo };
    // Remove undefined values from updateData
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    const { data, error } = await supabase
        .from('students')
        .update(updateData, { returning: 'representation' })
        .eq('auth_id', auth_id);
    if (error) {
        throw new Error(error.message);
    }
    if (!data || data.length === 0) {
        throw new Error("No student found to update");
    }
    return data[0];
}

module.exports = { updateProfile };
