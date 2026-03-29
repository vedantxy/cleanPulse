const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for backend bypass of RLS if needed

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials missing in server .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
