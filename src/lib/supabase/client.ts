import { createBrowserClient } from '@supabase/ssr';
import { getBrowserSupabaseEnv } from './env';
export const createClient = () => { const { url, key } = getBrowserSupabaseEnv(); return createBrowserClient(url, key); };
