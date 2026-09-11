import { requireAdmin } from '@/lib/auth';
import { AdminShell } from './AdminShell';

/** Server-side authorization boundary for every non-login /admin route. */
export async function AdminProtected({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
