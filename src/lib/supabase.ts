import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://xsfihhrcteagyaxqurvw.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYzOTAxN2RjLWQyMWUtNGY4Zi1hNWY1LTY4Y2FmMzJkNjNhNCJ9.eyJwcm9qZWN0SWQiOiJ4c2ZpaGhyY3RlYWd5YXhxdXJ2dyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcyMTQyNzU5LCJleHAiOjIwODc1MDI3NTksImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.eY3q2qqz31mnSXtWLeDyEsE1R3WcSk0xNCl9ELUUHYA';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };