const supabase = require('../config/supabaseClient');

async function sendMessage({ lecture_id, sender_id, message }) {
    const { data, error } = await supabase
        .from('chat_messages')
        .insert({ lecture_id, sender_id, message });
    if (error) throw error;
    return data[0];
}

async function getChatMessages(lecture_id) {
    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('lecture_id', lecture_id)
        .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
}

module.exports = { sendMessage, getChatMessages };
