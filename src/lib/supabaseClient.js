import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jvrjjackqncnthokdxut.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cmpqYWNrcW5jbnRob2tkeHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTIzNDYsImV4cCI6MjA2NTQ4ODM0Nn0.kU3OCdCnesRq3jSHrJcRYPaHmAO009pU6njwM4iH3s4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);