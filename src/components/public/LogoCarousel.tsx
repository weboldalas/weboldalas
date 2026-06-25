'use client'

type Logo = { src: string; alt: string; bg: 'transparent' | 'whitebg' }

const logos: Logo[] = [
  { src: '/logos/DIGBUILD_WHITE_FEKVO.png',        alt: 'DigBuild',           bg: 'transparent' },
  { src: '/logos/DME_logo4-1.png',                 alt: 'DME',                bg: 'transparent' },
  { src: '/logos/DentalConcepts_white_full_rgb.png',alt: 'Dental Concepts',    bg: 'transparent' },
  { src: '/logos/Group.png',                       alt: 'Hellopay',           bg: 'whitebg' },
  { src: '/logos/LOGO_FEKVO.png',                  alt: 'Füredi Hajózás',     bg: 'transparent' },
  { src: '/logos/Sztanfa_logo_color.png',          alt: 'Sztanfa',            bg: 'transparent' },
  { src: '/logos/barista-logo-white.png',          alt: 'Barista',            bg: 'transparent' },
  { src: '/logos/cedruskert_felirat_feher.png',    alt: 'Cedruskert',         bg: 'transparent' },
  { src: '/logos/cropped-log.png',                 alt: 'Étterem',            bg: 'whitebg' },
  { src: '/logos/cropped-logo.png',                alt: 'Rutinbau',           bg: 'whitebg' },
  { src: '/logos/eyeloveyou_00009.png',            alt: 'Eye Love You',       bg: 'whitebg' },
  { src: '/logos/g_logo_fekvo_white.png',          alt: 'Grafikus',           bg: 'transparent' },
  { src: '/logos/galeriainvest-logo.png',          alt: 'Galéria Invest',     bg: 'whitebg' },
  { src: '/logos/helkem_logo2.png',                alt: 'Helkem',             bg: 'whitebg' },
  { src: '/logos/home-logo-1.svg',                 alt: 'roa.r',              bg: 'whitebg' },
  { src: '/logos/logo-BBLUr7dk.jpg',               alt: 'Árpád Strandfürdő', bg: 'whitebg' },
  { src: '/logos/logo-transparent-DBnOkuss.png',   alt: 'Visit Kígyós',      bg: 'whitebg' },
  { src: '/logos/logo.png',                        alt: 'Csabai Piac',        bg: 'whitebg' },
  { src: '/logos/logo_black.png',                  alt: 'Biro David Films',   bg: 'whitebg' },
  { src: '/logos/logo_nav.png',                    alt: 'Szemüvegek Háza',    bg: 'whitebg' },
  { src: '/logos/neos-logo-feher.png',             alt: 'NEOS',               bg: 'whitebg' },
  { src: '/logos/ps-logo-2048x400.webp',           alt: 'Phonestrap',         bg: 'whitebg' },
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
          animation: 'logo-scroll 50s linear infinite',
          width: 'max-content',
        }}
      >
        {doubled.map((logo, i) => (
          <div
            key={i}
            className={`logo-chip ${logo.bg === 'transparent' ? 'logo-transparent' : 'logo-whitebg'}`}
            style={{
              flexShrink: 0,
              width: '200px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px 20px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.alt}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
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
