type SupabaseEnv = { url: string; key: string };

const read = (name: string) => process.env[name]?.trim();

function requireConfigured(url: string | undefined, key: string | undefined, scope: 'browser' | 'server'): SupabaseEnv {
  if (!url || !key) {
    const missing = [!url && (scope === 'server' ? 'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL' : 'NEXT_PUBLIC_SUPABASE_URL'), !key && (scope === 'server' ? 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_ANON_KEY' : 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY')].filter(Boolean).join(', ');
    throw new Error(`Supabase is not configured. Missing: ${missing}. Configure it for this Vercel environment and redeploy.`);
  }
  return { url, key };
}

/** Client-safe configuration: only values explicitly available to the browser. */
export function getBrowserSupabaseEnv(): SupabaseEnv {
  const url = read('NEXT_PUBLIC_SUPABASE_URL');
  const key = read('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') || read('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return requireConfigured(url, key, 'browser');
}

/** Server configuration: permits private-name fallbacks without exposing them to the browser bundle. */
export function getServerSupabaseEnv(): SupabaseEnv {
  const url = read('NEXT_PUBLIC_SUPABASE_URL') || read('SUPABASE_URL');
  const key = read('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') || read('NEXT_PUBLIC_SUPABASE_ANON_KEY') || read('SUPABASE_ANON_KEY');
  return requireConfigured(url, key, 'server');
}

/** @deprecated Use the browser or server-specific resolver. */
export function getSupabaseEnv() {
  return getBrowserSupabaseEnv();
}
