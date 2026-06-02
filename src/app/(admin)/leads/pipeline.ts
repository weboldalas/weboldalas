export const PIPELINE_STAGES = [
  { id: 'felkeresendo', label: 'Felkeresendő',   color: 'oklch(0.60 0.08 250)',  bg: 'oklch(0.60 0.08 250 / 0.12)' },
  { id: 'felkeresve',   label: 'Felkeresve',     color: 'oklch(0.65 0.18 280)',  bg: 'oklch(0.65 0.18 280 / 0.12)' },
  { id: 'ajanlat_kint', label: 'Ajánlat küldve', color: 'oklch(0.70 0.18 60)',   bg: 'oklch(0.70 0.18 60 / 0.12)'  },
  { id: 'fuggoben',     label: 'Függőben',        color: 'oklch(0.70 0.20 40)',   bg: 'oklch(0.70 0.20 40 / 0.12)'  },
  { id: 'elfogadott',   label: 'Elfogadott',      color: 'oklch(0.68 0.18 145)',  bg: 'oklch(0.68 0.18 145 / 0.12)' },
  { id: 'elutasitott',  label: 'Elutasított',     color: 'oklch(0.62 0.22 25)',   bg: 'oklch(0.62 0.22 25 / 0.10)'  },
]

export type LeadStatus = 'felkeresendo' | 'felkeresve' | 'ajanlat_kint' | 'fuggoben' | 'elfogadott' | 'elutasitott'
