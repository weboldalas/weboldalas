const CONTACT_PHONE = '+36 30 540 4177'
const CONTACT_EMAIL = 'info@weboldalas.hu'

function baseHtml(body: string) {
  return `<!DOCTYPE html><html lang="hu"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#07070e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#07070e;padding:40px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
${body}
<tr><td style="padding:24px 0 0;text-align:center;">
  <p style="margin:0;font-size:11px;color:#303050;">
    © ${new Date().getFullYear()} Weboldalas – Minden jog fenntartva.<br/>
    📞 <a href="tel:${CONTACT_PHONE}" style="color:#5050a0;text-decoration:none;">${CONTACT_PHONE}</a>
    &nbsp;·&nbsp;
    📧 <a href="mailto:${CONTACT_EMAIL}" style="color:#5050a0;text-decoration:none;">${CONTACT_EMAIL}</a>
  </p>
</td></tr>
</table></td></tr></table></body></html>`
}

export function respondCustomerHtml(name: string, action: 'accept' | 'reject', amount: number) {
  const isAccept = action === 'accept'
  return baseHtml(`
  <tr><td style="background:linear-gradient(135deg,#1a0a2e,#0d0d20);border:1px solid rgba(124,58,237,0.25);border-radius:20px;overflow:hidden;">
    <div style="background:${isAccept ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#dc2626,#ef4444)'};padding:20px 32px;">
      <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:3px;">${isAccept ? '✅ Elfogadva' : '❌ Elutasítva'}</p>
      <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;">Kedves ${name}!</h1>
    </div>
    <div style="padding:28px 32px;">
      ${isAccept
        ? `<p style="margin:0 0 16px;font-size:15px;color:#9090b0;line-height:1.7;">Köszönjük! <strong style="color:#e0e0f0;">Elfogadta az árajánlatot.</strong> Hamarosan felvesszük Önnel a kapcsolatot a következő lépésekkel kapcsolatban.</p>
           <p style="margin:0 0 20px;font-size:14px;color:#6060a0;"><strong style="color:#9090b0;">Összeg:</strong> ${amount.toLocaleString('hu-HU')} Ft</p>`
        : `<p style="margin:0 0 16px;font-size:15px;color:#9090b0;line-height:1.7;">Megkaptuk visszajelzését. Ha meggondolta magát vagy kérdése van, szívesen állunk rendelkezésére.</p>`
      }
      <p style="margin:0;font-size:13px;color:#5050a0;">📞 <a href="tel:${CONTACT_PHONE}" style="color:#7c6aed;text-decoration:none;">${CONTACT_PHONE}</a> &nbsp;·&nbsp; 📧 <a href="mailto:${CONTACT_EMAIL}" style="color:#7c6aed;text-decoration:none;">${CONTACT_EMAIL}</a></p>
    </div>
  </td></tr>`)
}

export function expiryCustomerHtml(name: string, publicUrl: string, type: 'tomorrow' | 'today' | 'expired') {
  const configs = {
    tomorrow: {
      badge: '⏰ Emlékeztető',
      body: 'Árajánlata <strong>holnap jár le</strong>. Kérjük, döntsön időben — elfogadhatja vagy elutasíthatja az alábbi linken.',
      btn: 'Ajánlat megtekintése →',
    },
    today: {
      badge: '🔔 Utolsó nap',
      body: 'Árajánlata <strong>ma éjfélig érvényes</strong>. Ez az utolsó lehetőség a döntésre.',
      btn: 'Döntés most →',
    },
    expired: {
      badge: '❌ Lejárt',
      body: 'Sajnáljuk, de árajánlata <strong>lejárt</strong>. Ha szeretne megújított ajánlatot kapni, vegye fel velünk a kapcsolatot.',
      btn: undefined,
    },
  }
  const c = configs[type]
  return baseHtml(`
  <tr><td style="background:linear-gradient(135deg,#1a0a2e,#0d0d20);border:1px solid rgba(124,58,237,0.25);border-radius:20px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:20px 32px;">
      <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:3px;">${c.badge}</p>
      <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;">Kedves ${name}!</h1>
    </div>
    <div style="padding:28px 32px;">
      <p style="margin:0 0 24px;font-size:15px;color:#9090b0;line-height:1.7;">${c.body}</p>
      ${c.btn
        ? `<div style="text-align:center;margin-bottom:20px;">
             <a href="${publicUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:12px;">${c.btn}</a>
           </div>
           <p style="text-align:center;font-size:11px;color:#353555;word-break:break-all;margin:0 0 20px;">${publicUrl}</p>`
        : `<p style="margin:0 0 20px;font-size:14px;color:#7070a0;">📞 <a href="tel:${CONTACT_PHONE}" style="color:#7c6aed;text-decoration:none;">${CONTACT_PHONE}</a></p>`
      }
    </div>
  </td></tr>`)
}

export function expiryAdminHtml(name: string, email: string, amount: number, offerId: string, type: 'tomorrow' | 'today' | 'expired', appUrl: string) {
  const labels = { tomorrow: 'holnap jár le', today: 'ma jár le', expired: 'lejárt' }
  const icons  = { tomorrow: '⏰', today: '🔔', expired: '❌' }
  const adminUrl = `${appUrl}/offers/${offerId}`
  return baseHtml(`
  <tr><td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:28px 32px;">
    <h2 style="margin:0 0 16px;font-size:18px;color:#e0e0f0;">${icons[type]} Ajánlat ${labels[type]}</h2>
    <p style="margin:0 0 8px;font-size:14px;color:#9090b0;"><strong style="color:#c0c0d0;">Ügyfél:</strong> ${name}${email ? ` (${email})` : ''}</p>
    <p style="margin:0 0 20px;font-size:14px;color:#9090b0;"><strong style="color:#c0c0d0;">Összeg:</strong> ${amount.toLocaleString('hu-HU')} Ft</p>
    <a href="${adminUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px;">Ajánlat megtekintése az adminban →</a>
  </td></tr>`)
}
