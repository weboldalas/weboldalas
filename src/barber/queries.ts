import { availabilityForWindow, windowRange } from './availability'
import { services } from './config'
import { getStore } from './store'

/** Earliest free start for the default service — shown live on the homepage */
export async function nextFreeSlot(now = new Date()) {
  try {
    const service = services[0]
    const { from, to } = windowRange(now)
    const bookings = await getStore().listActive(from, to)
    for (const day of availabilityForWindow(service, bookings, now)) {
      if (day.slots.length) return new Date(day.slots[0].startsAt)
    }
  } catch (error) {
    // the homepage must render even if the database is unreachable
    console.error('nextFreeSlot failed:', error)
  }
  return null
}
