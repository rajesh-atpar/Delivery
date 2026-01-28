import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables
// You need to set these in your .env file or vite.config.js
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client with fallback dummy values if not configured
// This prevents the app from crashing when Supabase is not set up yet
const safeUrl = supabaseUrl || 'https://placeholder.supabase.co';
const safeKey = supabaseAnonKey || 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL and Anon Key are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  console.warn('The app will work but authentication features will not function until Supabase is configured.');
}

// Create Supabase client
export const supabase = createClient(safeUrl, safeKey);

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Helper function to get user profile from profiles table
export const getUserProfile = async (userId) => {
  // Check if Supabase is configured
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured. Please set up your .env file.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  // If profile doesn't exist, return null instead of throwing
  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  
  return data;
};

// Helper function to create or update user profile
export const upsertUserProfile = async (userId, profileData) => {
  // Check if Supabase is configured
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured. Please set up your .env file.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export default supabase;
