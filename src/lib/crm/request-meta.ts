// Request metadata (IP, browser, OS, device) for the contract audit log.

function parseUA(ua: string): { browser: string; os: string; device: string } {
  const isMobile = /Mobile|Android|iPhone/.test(ua)
  const isTablet = /iPad|Tablet/.test(ua)
  const device = isTablet ? 'Tablet' : isMobile ? 'Mobil' : 'Asztali'

  let browser = 'Ismeretlen'
  const edgeM = ua.match(/Edg\/([\d]+)/)
  const chromeM = ua.match(/Chrome\/([\d]+)/)
  const ffM = ua.match(/Firefox\/([\d]+)/)
  const safariM = ua.match(/Version\/([\d]+).*Safari/)
  if (edgeM) browser = `Edge ${edgeM[1]}`
  else if (chromeM && !/Chromium/.test(ua)) browser = `Chrome ${chromeM[1]}`
  else if (ffM) browser = `Firefox ${ffM[1]}`
  else if (safariM) browser = `Safari ${safariM[1]}`

  let os = 'Ismeretlen'
  if (/Windows NT 10|Windows NT 11/.test(ua)) os = 'Windows 10/11'
  else if (/Windows NT 6\.3/.test(ua)) os = 'Windows 8.1'
  else if (/Windows NT 6\.1/.test(ua)) os = 'Windows 7'
  else if (/Windows/.test(ua)) os = 'Windows'
  else if (/Mac OS X/.test(ua)) {
    const m = ua.match(/Mac OS X ([\d_]+)/)
    os = m ? `macOS ${m[1].replace(/_/g, '.')}` : 'macOS'
  } else if (/iPhone OS/.test(ua)) {
    const m = ua.match(/iPhone OS ([\d_]+)/)
    os = m ? `iOS ${m[1].replace(/_/g, '.')}` : 'iOS'
  } else if (/iPad.*OS/.test(ua)) {
    const m = ua.match(/OS ([\d_]+)/)
    os = m ? `iPadOS ${m[1].replace(/_/g, '.')}` : 'iPadOS'
  } else if (/Android/.test(ua)) {
    const m = ua.match(/Android ([\d.]+)/)
    os = m ? `Android ${m[1]}` : 'Android'
  } else if (/Linux/.test(ua)) os = 'Linux'

  return { browser, os, device }
}

export type ActivityMeta = { ip: string; browser: string; os: string; device: string }

export function requestMetaFromHeaders(h: Headers): ActivityMeta {
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'ismeretlen'
  return { ip, ...parseUA(h.get('user-agent') || '') }
}
