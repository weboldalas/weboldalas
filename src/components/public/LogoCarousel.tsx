'use client'

import Image from 'next/image'

/*
 * How each file looks, so it reads on black:
 *   light — light/white artwork on transparent → shown as is (muted)
 *   dark  — dark artwork on transparent or on a white box → inverted to white
 *   color — artwork on its own coloured background → greyscale
 * Hover restores the original colours.
 */
type Logo = { src: string; alt: string; tone: 'light' | 'dark' | 'color'; /** files with lots of empty space around the mark */ scale?: number }

const logos: Logo[] = [
  { src: '/logos/DIGBUILD_WHITE_FEKVO.png',         alt: 'DigBuild',          tone: 'light' },
  { src: '/logos/DME_logo4-1.png',                  alt: 'Drift Market Europe', tone: 'light' },
  { src: '/logos/DentalConcepts_white_full_rgb.png', alt: 'Dental Concepts',   tone: 'light' },
  { src: '/logos/Group.png',                        alt: 'Hellopay',          tone: 'dark' },
  { src: '/logos/LOGO_FEKVO.png',                   alt: 'Füredi Hajózás',    tone: 'light' },
  { src: '/logos/Sztanfa_logo_color.png',           alt: 'Sztanfa',           tone: 'light' },
  { src: '/logos/barista-logo-white.png',           alt: 'Barista',           tone: 'light' },
  { src: '/logos/cedruskert_felirat_feher.png',     alt: 'Cedruskert',        tone: 'light' },
  { src: '/logos/cropped-log.png',                  alt: 'Gyula Build',       tone: 'light' },
  { src: '/logos/cropped-logo.png',                 alt: 'Rutinbau',          tone: 'dark' },
  { src: '/logos/eyeloveyou_00009.png',             alt: 'Eye Love You',      tone: 'light', scale: 2.4 },
  { src: '/logos/g_logo_fekvo_white.png',           alt: 'Galéria Chemical',  tone: 'light' },
  { src: '/logos/galeriainvest-logo.png',           alt: 'Galéria Invest',    tone: 'color' },
  { src: '/logos/helkem_logo2.png',                 alt: 'Helkem',            tone: 'light' },
  { src: '/logos/home-logo-1.svg',                  alt: 'roa.r',             tone: 'dark' },
  { src: '/logos/logo-BBLUr7dk.jpg',                alt: 'Árpád Strandfürdő', tone: 'dark', scale: 1.5 },
  { src: '/logos/logo-transparent-DBnOkuss.png',    alt: 'Visit Kígyós',      tone: 'dark', scale: 1.5 },
  { src: '/logos/logo.png',                         alt: 'Csabai Piac',       tone: 'dark' },
  { src: '/logos/logo_black.png',                   alt: 'Biro David Films',  tone: 'dark' },
  { src: '/logos/logo_nav.png',                     alt: 'Szemüvegek Háza',   tone: 'dark' },
  { src: '/logos/neos-logo-feher.png',              alt: 'NEOS',              tone: 'light' },
  { src: '/logos/ps-logo-2048x400.webp',            alt: 'Phonestrap',        tone: 'dark' },
]

const doubled = [...logos, ...logos]

export function LogoCarousel() {
  return (
    <div
      className="logo-carousel-wrapper"
      style={{
        overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div
        className="logo-track"
        style={{
          display: 'flex',
          gap: '24px',
          animation: 'logo-scroll 50s linear infinite',
          width: 'max-content',
        }}
      >
        {doubled.map((logo, i) => (
          <div
            key={i}
            className={`logo-chip logo-${logo.tone}`}
            style={{
              flexShrink: 0,
              width: '200px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '18px 24px',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%', transform: logo.scale ? `scale(${logo.scale})` : undefined }}>
              <Image
                src={logo.src}
                alt={i < logos.length ? logo.alt : ''}
                fill
                sizes="160px"
                unoptimized={logo.src.endsWith('.svg')}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
