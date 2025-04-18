// 📦 supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 🔐 Deine Zugangsdaten
const supabaseUrl = 'https://ntudsmigfwwxsrowyuzf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dWRzbWlnZnd3eHNyb3d5dXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5ODQwODQsImV4cCI6MjA2MDU2MDA4NH0.TQrv_LRHIZwvjzZ35z7yT6wLJvpK7y9B8Px6mYAT-M0'; // gekürzt
export const supabase = createClient(supabaseUrl, supabaseKey);
