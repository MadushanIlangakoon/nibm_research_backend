// server/config/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log("Supabase Key (first 30 chars):", supabaseKey.slice(0, 30));

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
