import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'ganti_url';
const supabaseKey = 'ganti_key';


export const supabase = createClient(supabaseUrl, supabaseKey)
