import type { BookingStore } from '../types'
import { memoryStore } from './memory'
import { supabaseStore } from './supabase'

// BARBER_STORE=supabase switches to the real database once the migration is
// applied; anything else runs the self-contained demo store.
export function getStore(): BookingStore {
  return process.env.BARBER_STORE === 'supabase' ? supabaseStore : memoryStore
}
