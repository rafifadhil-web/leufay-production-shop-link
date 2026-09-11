import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  const { data: admin } = await supabase.from('admins').select('id').eq('user_id', user.id).maybeSingle();
  if (!admin) redirect('/');
  return { supabase, user };
}
