// Single source of truth for the barber site: business details, services,
// opening hours and booking rules. Everything marked "PLACEHOLDER" must be
// replaced with Ákos's real data before going live.

export type Service = {
  id: string
  name: string
  short: string
  description: string
  durationMin: number
  priceHuf: number
}

export type DayHours = {
  open: string // "HH:MM"
  close: string // "HH:MM"
  breaks?: { from: string; to: string }[]
} | null

export const barber = {
  name: 'Vágvölgyi Ákos',
  firstName: 'Ákos',
  brand: 'Vágvölgyi',
  role: 'Barber',
  tagline: 'Precíz vágás. Nyugodt óra. Csak te és a tükör.',
  intro:
    'Egyszemélyes barber szék, ahol minden vágás egyedi. Nincs futószalag, nincs sietség — időt hagyok arra, hogy átbeszéljük, mit szeretnél, és pontosan azt kapd.',
  // PLACEHOLDER — real contact details
  address: 'Szalon címe, 1000 Város',
  addressNote: 'Bejárat az udvar felől, csengő: Barber',
  mapsUrl: 'https://maps.google.com/?q=Budapest',
  phone: '+36 30 000 0000',
  email: 'hello@example.com',
  instagram: 'https://instagram.com/',
  instagramHandle: '@vagvolgyi.barber',
  timeZone: 'Europe/Budapest',
} as const

// PLACEHOLDER — sample prices and durations, set the real ones here
export const services: Service[] = [
  {
    id: 'hajvagas',
    name: 'Hajvágás',
    short: 'Classic cut',
    description: 'Konzultáció, mosás, ollós és gépi vágás, styling.',
    durationMin: 45,
    priceHuf: 8000,
  },
  {
    id: 'skin-fade',
    name: 'Skin fade',
    short: 'Fade',
    description: 'Bőrig átmenetes fade, kontúr, mosás és styling.',
    durationMin: 60,
    priceHuf: 9500,
  },
  {
    id: 'haj-szakall',
    name: 'Haj + szakáll',
    short: 'Full service',
    description: 'Teljes hajvágás és szakállformázás forró törölközővel.',
    durationMin: 75,
    priceHuf: 13000,
  },
  {
    id: 'szakall',
    name: 'Szakállformázás',
    short: 'Beard',
    description: 'Forma, kontúr borotvával, forró törölköző, szakállolaj.',
    durationMin: 30,
    priceHuf: 5500,
  },
  {
    id: 'borotvalas',
    name: 'Hot towel borotválás',
    short: 'Shave',
    description: 'Klasszikus borotválás forró és hideg törölközővel.',
    durationMin: 45,
    priceHuf: 7500,
  },
  {
    id: 'gepi',
    name: 'Gépi vágás',
    short: 'Buzz cut',
    description: 'Egy hosszon géppel, kontúrral. Gyors és tiszta.',
    durationMin: 30,
    priceHuf: 5000,
  },
]

// 0 = Sunday … 6 = Saturday (same as Date#getDay)
export const openingHours: Record<number, DayHours> = {
  0: null,
  1: null,
  2: { open: '10:00', close: '19:00', breaks: [{ from: '14:00', to: '14:30' }] },
  3: { open: '10:00', close: '19:00', breaks: [{ from: '14:00', to: '14:30' }] },
  4: { open: '10:00', close: '20:00', breaks: [{ from: '14:00', to: '14:30' }] },
  5: { open: '10:00', close: '19:00', breaks: [{ from: '14:00', to: '14:30' }] },
  6: { open: '09:00', close: '14:00' },
}

// Specific closed dates (holidays, vacation), "YYYY-MM-DD" in Budapest time
export const closedDates: string[] = ['2026-12-24', '2026-12-25', '2026-12-26', '2026-12-31', '2027-01-01']

export const bookingRules = {
  slotStepMin: 15, // granularity of offered start times
  bufferMin: 10, // cleanup time after each appointment
  minLeadMin: 120, // no bookings closer than this to "now"
  horizonDays: 30, // how far ahead customers can book
  cancelUntilHours: 6, // self-service cancellation cutoff
} as const

export const dayNames = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat']

export function getService(id: string) {
  return services.find((s) => s.id === id)
}

export function formatHuf(value: number) {
  return new Intl.NumberFormat('hu-HU').format(value) + ' Ft'
}

export const faq = [
  {
    q: 'Mi van, ha késem?',
    a: 'Szólj egy SMS-ben. 10 perc késésig megcsináljuk, utána lehet, hogy rövidebb szolgáltatásra kell váltanunk, hogy a következő vendég se várjon.',
  },
  {
    q: 'Hogyan mondhatom le az időpontot?',
    a: `A visszaigazoló e-mailben kapott linkkel az időpont előtt legkésőbb ${bookingRules.cancelUntilHours} órával online lemondhatod. Azon belül hívj fel.`,
  },
  {
    q: 'Hozzak referenciaképet?',
    a: 'Igen, nyugodtan. Egy-két fotó sokat segít abban, hogy pontosan azt kapd, amit elképzeltél.',
  },
  {
    q: 'Hogyan fizethetek?',
    // PLACEHOLDER — confirm accepted payment methods
    a: 'A helyszínen, a szolgáltatás után. Előleget nem kérek.',
  },
]
