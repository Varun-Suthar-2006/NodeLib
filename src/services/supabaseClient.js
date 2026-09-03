import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables or saved local configuration
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const localUrl = localStorage.getItem('nodelib_supabase_url');
const localKey = localStorage.getItem('nodelib_supabase_key');

export const SUPABASE_URL = (envUrl && !envUrl.includes('YOUR_SUPABASE')) ? envUrl : (localUrl || '');
export const SUPABASE_ANON_KEY = (envKey && !envKey.includes('YOUR_SUPABASE')) ? envKey : (localKey || '');

export const isSupabaseConfigured = () => {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_ANON_KEY && 
    SUPABASE_URL.startsWith('https://') && 
    SUPABASE_ANON_KEY.length > 20
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

export function setCustomSupabaseCredentials(url, key) {
  if (url && key) {
    localStorage.setItem('nodelib_supabase_url', url.trim());
    localStorage.setItem('nodelib_supabase_key', key.trim());
    window.location.reload();
  }
}

export function clearCustomSupabaseCredentials() {
  localStorage.removeItem('nodelib_supabase_url');
  localStorage.removeItem('nodelib_supabase_key');
  window.location.reload();
}
