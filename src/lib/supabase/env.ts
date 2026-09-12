type SupabaseEnv = {
  url: string;
  key: string;
};

function requireConfigured(
  url: string | undefined,
  key: string | undefined,
  scope: 'browser' | 'server'
): SupabaseEnv {
  if (!url || !key) {
    const missing = [
      !url &&
        (scope === 'server'
          ? 'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL'
          : 'NEXT_PUBLIC_SUPABASE_URL'),
      !key &&
        (scope === 'server'
          ? 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_ANON_KEY'
          : 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    ]
      .filter(Boolean)
      .join(', ');

    throw new Error(
      `Supabase is not configured. Missing: ${missing}. Configure it for this Vercel environment and redeploy.`
    );
  }

  return { url, key };
}

/** Client-safe configuration: values explicitly available to the browser. */
export function getBrowserSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  return requireConfigured(url, key, 'browser');
}

/** Server configuration. */
export function getServerSupabaseEnv(): SupabaseEnv {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim();

  return requireConfigured(url, key, 'server');
}

/** @deprecated Use the browser or server-specific resolver. */
export function getSupabaseEnv() {
  return getBrowserSupabaseEnv();
}