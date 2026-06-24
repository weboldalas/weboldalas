'use client'

const logos = [
  { src: '/logos/DIGBUILD_WHITE_FEKVO.png',       alt: 'DigBuild' },
  { src: '/logos/DME_logo4-1.png',                alt: 'DME' },
  { src: '/logos/DentalConcepts_white_full_rgb.png', alt: 'Dental Concepts' },
  { src: '/logos/Group.png',                      alt: 'Hellopay' },
  { src: '/logos/LOGO_FEKVO.png',                 alt: 'Füredi Hajózás' },
  { src: '/logos/Sztanfa_logo_color.png',         alt: 'Sztanfa' },
  { src: '/logos/barista-logo-white.png',         alt: 'Barista' },
  { src: '/logos/cedruskert_felirat_feher.png',   alt: 'Cedruskert' },
  { src: '/logos/cropped-log.png',                alt: 'Étterem' },
  { src: '/logos/cropped-logo.png',               alt: 'Rutinbau' },
  { src: '/logos/eyeloveyou_00009.png',           alt: 'Eye Love You' },
  { src: '/logos/g_logo_fekvo_white.png',         alt: 'Grafikus' },
  { src: '/logos/galeriainvest-logo.png',         alt: 'Galéria Invest' },
  { src: '/logos/helkem_logo2.png',               alt: 'Helkem' },
  { src: '/logos/home-logo-1.svg',                alt: 'roa.r' },
  { src: '/logos/logo-BBLUr7dk.jpg',              alt: 'Árpád Strandfürdő' },
  { src: '/logos/logo-transparent-DBnOkuss.png',  alt: 'Visit Kígyós' },
  { src: '/logos/logo.png',                       alt: 'Csabai Piac' },
  { src: '/logos/logo_black.png',                 alt: 'Biro David Films' },
  { src: '/logos/logo_nav.png',                   alt: 'Szemüvegek Háza' },
  { src: '/logos/neos-logo-feher.png',            alt: 'NEOS' },
  { src: '/logos/ps-logo-2048x400.webp',          alt: 'Phonestrap' },
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
          gap: '16px',
          animation: 'logo-scroll 45s linear infinite',
          width: 'max-content',
        }}
      >
        {doubled.map((logo, i) => (
          <div
            key={i}
            className="logo-chip"
            style={{
              flexShrink: 0,
              height: '76px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px 22px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              transition: 'background 0.4s ease',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.alt}
              style={{
                maxHeight: '44px',
                maxWidth: '160px',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
