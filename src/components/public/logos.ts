/*
 * Partner logos for the homepage marquee. Put the file in /public/logos and add a line here.
 *
 * tone — how the file looks, so it reads on black:
 *   light — light/white artwork on a transparent background → shown greyed, full colour on hover
 *   dark  — dark artwork (transparent or on a white box) → inverted to white; on hover it shows
 *           in its original colours on a white card
 *   color — artwork on its own coloured background → greyscale, full colour on hover
 * scale — optional zoom for files with a lot of empty space around the mark (e.g. 1.5)
 *
 * The same list is the client grid on the references page:
 *   reference — slug of the case study in referenciak/references.ts → the tile links there
 *   url       — the client's live site → the tile links there when there is no case study
 */
export type PartnerLogo = {
  src: string
  alt: string
  tone: 'light' | 'dark' | 'color'
  scale?: number
  reference?: string
  url?: string
}

export const LOGOS: PartnerLogo[] = [
  { src: '/logos/DIGBUILD_WHITE_FEKVO.png', alt: 'DigBuild', tone: 'light' },
  { src: '/logos/DME_logo4-1.png', alt: 'Drift Market Europe', tone: 'light' },
  { src: '/logos/DentalConcepts_white_full_rgb.png', alt: 'Dental Concepts', tone: 'light' },
  { src: '/logos/Group.png', alt: 'Hellopay', tone: 'dark' },
  { src: '/logos/LOGO_FEKVO.png', alt: 'Füredi Hajózás', tone: 'light' },
  { src: '/logos/Sztanfa_logo_color.png', alt: 'Sztanfa', tone: 'light', reference: 'sztanfa' },
  { src: '/logos/barista-logo-white.png', alt: 'Barista', tone: 'light' },
  { src: '/logos/cedruskert_felirat_feher.png', alt: 'Cedruskert', tone: 'light' },
  { src: '/logos/cropped-log.png', alt: 'Gyula Build', tone: 'light' },
  { src: '/logos/cropped-logo.png', alt: 'Rutinbau', tone: 'dark' },
  { src: '/logos/eyeloveyou_00009.png', alt: 'Eye Love You', tone: 'light', scale: 2.4 },
  { src: '/logos/g_logo_fekvo_white.png', alt: 'Galéria Chemical', tone: 'light' },
  { src: '/logos/galeriainvest-logo.png', alt: 'Galéria Invest', tone: 'color' },
  { src: '/logos/helkem_logo2.png', alt: 'Helkem', tone: 'light', reference: 'helkem' },
  { src: '/logos/home-logo-1.svg', alt: 'roa.r', tone: 'dark', reference: 'hello-roar' },
  { src: '/logos/logo-BBLUr7dk.jpg', alt: 'Árpád Strandfürdő', tone: 'dark', scale: 1.5 },
  { src: '/logos/logo-transparent-DBnOkuss.png', alt: 'Visit Kígyós', tone: 'dark', scale: 1.5, reference: 'visitkigyos' },
  { src: '/logos/logo.png', alt: 'Csabai Piac', tone: 'dark', reference: 'csabai-piac' },
  { src: '/logos/logo_black.png', alt: 'Biro David Films', tone: 'dark' },
  { src: '/logos/logo_nav.png', alt: 'Szemüvegek Háza', tone: 'dark' },
  { src: '/logos/neos-logo-feher.png', alt: 'NEOS', tone: 'light' },
  { src: '/logos/ps-logo-2048x400.webp', alt: 'Phonestrap', tone: 'dark' },
]
