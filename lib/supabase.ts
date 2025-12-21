
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sgnaqrkqjgdpiujjmkxl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnbmFxcmtxamdkcGl1ampta3hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjEyNjAsImV4cCI6MjA4MTg5NzI2MH0.5FWndAI73QM6CAYaDSHQA4xBskSlSQgbBb5ovxI_Lqs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
