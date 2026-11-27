import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

/**
 * The admin is for the owner and staff only. Partner contacts (portal users, phase 2)
 * are signed-in users too, so the role is checked here as well as by RLS.
 * Before the CRM migration runs there is no profiles table; existing admins keep access then.
 */
export async function requireStaff() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (error) {
    if (/profiles|does not exist|schema cache/i.test(error.message)) return { user, role: 'owner' as const }
    throw error
  }
  if (!profile || (profile.role !== 'owner' && profile.role !== 'staff')) {
    redirect('/portal')
  }
  return { user, role: profile.role as 'owner' | 'staff' }
}

/** For route handlers: returns the staff user, or null when the caller is not owner/staff. */
export async function getStaffUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (error) return /profiles|does not exist|schema cache/i.test(error.message) ? user : null
  return profile && (profile.role === 'owner' || profile.role === 'staff') ? user : null
}
