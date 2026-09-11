import { redirect } from 'next/navigation';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
/** Deduplicated per server render so layouts/pages never repeat the auth + admin lookup. */
export const requireAdmin = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  const { data: admin } = await supabase.from('admins').select('id').eq('user_id', user.id).maybeSingle();
  if (!admin) redirect('/');
  return { supabase, user };
});
