const CONTACT_PHONE = '+36 30 540 4177'
const CONTACT_EMAIL = 'info@weboldalas.hu'
const YEAR = new Date().getFullYear()

function shell(appUrl: string, body: string) {
  return `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#07070e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#07070e;padding:40px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

  <!-- Logo -->
  <tr>
    <td style="padding-bottom:28px;text-align:center;">
      <img src="${appUrl}/weboldalas-logo.svg" alt="Weboldalas" width="150" height="20" style="display:inline-block;opacity:0.85;" />
    </td>
  </tr>

  <!-- Card -->
  <tr>
    <td style="background:linear-gradient(160deg,#150b28,#0d0d1e);border:1px solid rgba(124,58,237,0.2);border-radius:20px;overflow:hidden;">
      ${body}

      <!-- Contact footer -->
      <div style="padding:18px 32px;border-top:1px solid rgba(255,255,255,0.05);">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:12px;color:#505070;">
              <strong style="color:#6060a0;display:block;margin-bottom:6px;">Kérdése van?</strong>
              📧 <a href="mailto:${CONTACT_EMAIL}" style="color:#7c6aed;text-decoration:none;">${CONTACT_EMAIL}</a>
              &nbsp;&nbsp;
              📞 <a href="tel:${CONTACT_PHONE}" style="color:#7c6aed;text-decoration:none;">${CONTACT_PHONE}</a>
            </td>
          </tr>
        </table>
      </div>
    </td>
  </tr>

  <!-- Bottom note -->
  <tr>
    <td style="padding:20px 0 0;text-align:center;">
      <p style="margin:0;font-size:11px;color:#252540;line-height:1.7;">
        Ez az üzenet automatikusan lett küldve a Weboldalas rendszeréből.<br/>
        © ${YEAR} Weboldalas – Minden jog fenntartva.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

function checkRow(text: string) {
  return `<tr>
    <td width="20" style="padding:5px 0;font-size:13px;color:#7c6aed;vertical-align:top;">✓</td>
    <td style="padding:5px 0;font-size:13px;color:#8080a0;line-height:1.5;">${text}</td>
  </tr>`
}

// ─── Ügyfélnek: elfogadás / elutasítás ───────────────────────────────────────

export function respondCustomerHtml(
  name: string,
  action: 'accept' | 'reject',
  amount: number,
  appUrl: string
) {
  const isAccept = action === 'accept'

  const topBar = isAccept
    ? `background:linear-gradient(135deg,#065f46,#059669)`
    : `background:linear-gradient(135deg,#7f1d1d,#b91c1c)`

  const badge = isAccept ? 'Elfogadva' : 'Elutasítva'
  const icon  = isAccept ? '✅' : '❌'

  const bodyContent = isAccept
    ? `<p style="margin:0 0 20px;font-size:15px;color:#a0a0c0;line-height:1.75;">
        Köszönjük! Sikeresen <strong style="color:#e0e0f0;">elfogadta az árajánlatunkat</strong>.
        Munkatársunk hamarosan felveszi Önnel a kapcsolatot a következő lépések egyeztetéséhez.
       </p>

       <!-- Amount box -->
       <div style="background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.2);border-radius:12px;padding:16px 20px;margin-bottom:24px;">
         <table width="100%" cellpadding="0" cellspacing="0">
           <tr>
             <td style="font-size:12px;color:#6060a0;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;padding-bottom:6px;">Elfogadott összeg</td>
           </tr>
           <tr>
             <td style="font-size:26px;font-weight:800;color:#a855f7;">${amount.toLocaleString('hu-HU')} Ft</td>
           </tr>
         </table>
       </div>

       <!-- Next steps -->
       <div style="background:rgba(255,255,255,0.025);border-radius:12px;padding:18px 20px;margin-bottom:24px;">
         <p style="margin:0 0 12px;font-size:11px;color:#505080;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Mi következik?</p>
         <table width="100%" cellpadding="0" cellspacing="0">
           ${checkRow('Visszahívjuk Önt a részletek egyeztetéséhez')}
           ${checkRow('Elkészítjük a menetrendet és megkezdjük a munkát')}
           ${checkRow('Folyamatos tájékoztatás az előrehaladásról')}
         </table>
       </div>`
    : `<p style="margin:0 0 20px;font-size:15px;color:#a0a0c0;line-height:1.75;">
        Megkaptuk visszajelzését, köszönjük az őszinteségét.
        Ha meggondolta magát, vagy szeretne egy módosított ajánlatot kapni, állunk rendelkezésére.
       </p>
       <div style="background:rgba(255,255,255,0.025);border-radius:12px;padding:18px 20px;margin-bottom:24px;">
         <p style="margin:0 0 12px;font-size:11px;color:#505080;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Állunk rendelkezésére</p>
         <table width="100%" cellpadding="0" cellspacing="0">
           ${checkRow('Ingyenes telefonos konzultáció')}
           ${checkRow('Módosított ajánlat kérése')}
           ${checkRow('Kérdések megbeszélése')}
         </table>
       </div>`

  return shell(appUrl, `
      <!-- Top bar -->
      <div style="${topBar};padding:26px 32px 24px;">
        <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.65);text-transform:uppercase;letter-spacing:3px;font-weight:600;">${icon} Árajánlat ${badge}</p>
        <h1 style="margin:0;font-size:24px;font-weight:800;color:#ffffff;line-height:1.3;">Kedves ${name}!</h1>
      </div>

      <!-- Body -->
      <div style="padding:28px 32px 24px;">
        ${bodyContent}
      </div>
  `)
}

// ─── Adminnak: elfogadás / elutasítás ────────────────────────────────────────

export function adminRespondHtml(
  contactName: string,
  contactEmail: string,
  action: 'accept' | 'reject',
  amount: number,
  offerId: string,
  appUrl: string
) {
  const isAccept = action === 'accept'
  const actionText = isAccept ? 'elfogadta' : 'elutasította'
  const color  = isAccept ? '#10b981' : '#ef4444'
  const icon   = isAccept ? '✅' : '❌'
  const adminUrl = `${appUrl}/offers/${offerId}`

  return shell(appUrl, `
      <!-- Top bar -->
      <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:26px 32px 24px;">
        <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.65);text-transform:uppercase;letter-spacing:3px;font-weight:600;">Admin értesítő</p>
        <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;">Visszajelzés érkezett!</h1>
      </div>

      <!-- Body -->
      <div style="padding:28px 32px 24px;">
        <!-- Status badge -->
        <div style="display:inline-flex;align-items:center;gap:8px;background:${isAccept ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};border:1px solid ${isAccept ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};border-radius:10px;padding:10px 18px;margin-bottom:24px;">
          <span style="font-size:16px;">${icon}</span>
          <span style="font-size:14px;font-weight:700;color:${color};">${contactName} ${actionText} az ajánlatot</span>
        </div>

        <!-- Info grid -->
        <div style="background:rgba(255,255,255,0.025);border-radius:12px;padding:18px 20px;margin-bottom:24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#606080;width:90px;">Ügyfél</td>
              <td style="padding:6px 0;font-size:13px;color:#d0d0e8;font-weight:600;">${contactName}</td>
            </tr>
            ${contactEmail ? `<tr>
              <td style="padding:6px 0;font-size:13px;color:#606080;">Email</td>
              <td style="padding:6px 0;font-size:13px;"><a href="mailto:${contactEmail}" style="color:#7c6aed;text-decoration:none;">${contactEmail}</a></td>
            </tr>` : ''}
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#606080;">Összeg</td>
              <td style="padding:6px 0;font-size:20px;font-weight:800;color:#a855f7;">${amount.toLocaleString('hu-HU')} Ft</td>
            </tr>
          </table>
        </div>

        ${isAccept ? `<p style="margin:0 0 20px;font-size:13px;color:#10b981;font-weight:600;">✅ A pénzügyi tételek automatikusan létrejöttek a rendszerben.</p>` : ''}

        <!-- CTA -->
        <div style="text-align:center;">
          <a href="${adminUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:12px;letter-spacing:0.2px;">
            Ajánlat megtekintése az adminban →
          </a>
        </div>
      </div>
  `)
}

// ─── Ügyfélnek: lejárati emlékeztetők ────────────────────────────────────────

export function expiryCustomerHtml(
  name: string,
  publicUrl: string,
  type: 'tomorrow' | 'today' | 'expired',
  appUrl: string
) {
  const cfg = {
    tomorrow: {
      topColor: 'background:linear-gradient(135deg,#92400e,#b45309)',
      label: '⏰ Emlékeztető',
      headline: 'Ajánlata holnap jár le',
      body: 'Az Önnek küldött árajánlat <strong style="color:#fbbf24;">holnap éjfélig érvényes</strong>. Kérjük, döntsön időben — egyetlen kattintással elfogadhatja vagy elutasíthatja.',
      btnText: 'Ajánlat megtekintése →',
      btnColor: 'background:linear-gradient(135deg,#b45309,#d97706)',
    },
    today: {
      topColor: 'background:linear-gradient(135deg,#7f1d1d,#b91c1c)',
      label: '🔔 Utolsó nap',
      headline: 'Ajánlata ma éjfélig érvényes',
      body: 'Ez az <strong style="color:#fca5a5;">utolsó lehetőség</strong> a döntésre. Az ajánlat ma éjfélkor lejár — ha szeretné elfogadni, tegye meg még ma.',
      btnText: 'Döntés most →',
      btnColor: 'background:linear-gradient(135deg,#dc2626,#ef4444)',
    },
    expired: {
      topColor: 'background:linear-gradient(135deg,#1f2937,#374151)',
      label: '❌ Lejárt ajánlat',
      headline: 'Az ajánlat lejárt',
      body: 'Sajnáljuk, de az Önnek küldött árajánlat <strong style="color:#9ca3af;">lejárt</strong>. Ha továbbra is érdekli a weboldal készítés, keresse fel munkatársunkat — szívesen küldünk frissített ajánlatot.',
      btnText: undefined,
      btnColor: '',
    },
  }[type]

  return shell(appUrl, `
      <!-- Top bar -->
      <div style="${cfg.topColor};padding:26px 32px 24px;">
        <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.65);text-transform:uppercase;letter-spacing:3px;font-weight:600;">${cfg.label}</p>
        <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;">${cfg.headline}</h1>
      </div>

      <!-- Body -->
      <div style="padding:28px 32px 24px;">
        <p style="margin:0 0 6px;font-size:14px;color:#7070a0;">Kedves <strong style="color:#c0c0e0;">${name}</strong>!</p>
        <p style="margin:0 0 24px;font-size:15px;color:#9090b0;line-height:1.75;">${cfg.body}</p>

        ${cfg.btnText
          ? `<div style="text-align:center;margin-bottom:16px;">
               <a href="${publicUrl}" style="display:inline-block;${cfg.btnColor};color:#fff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 42px;border-radius:12px;letter-spacing:0.2px;">${cfg.btnText}</a>
             </div>
             <p style="text-align:center;font-size:11px;color:#303050;word-break:break-all;margin:0 0 8px;">${publicUrl}</p>`
          : ''}
      </div>
  `)
}

// ─── Adminnak: lejárati értesítők ────────────────────────────────────────────

export function expiryAdminHtml(
  name: string,
  email: string,
  amount: number,
  offerId: string,
  type: 'tomorrow' | 'today' | 'expired',
  appUrl: string
) {
  const cfg = {
    tomorrow: { icon: '⏰', label: 'holnap jár le', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
    today:    { icon: '🔔', label: 'ma jár le',     color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)'  },
    expired:  { icon: '❌', label: 'lejárt',         color: '#9ca3af', bg: 'rgba(156,163,175,0.06)',border: 'rgba(156,163,175,0.2)' },
  }[type]
  const adminUrl = `${appUrl}/offers/${offerId}`

  return shell(appUrl, `
      <!-- Top bar -->
      <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:26px 32px 24px;">
        <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.65);text-transform:uppercase;letter-spacing:3px;font-weight:600;">Admin értesítő</p>
        <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;">${cfg.icon} Ajánlat ${cfg.label}</h1>
      </div>

      <!-- Body -->
      <div style="padding:28px 32px 24px;">
        <!-- Status badge -->
        <div style="display:inline-block;background:${cfg.bg};border:1px solid ${cfg.border};border-radius:10px;padding:10px 18px;margin-bottom:24px;">
          <span style="font-size:13px;font-weight:700;color:${cfg.color};">${cfg.icon} ${name} ajánlata ${cfg.label}</span>
        </div>

        <!-- Info -->
        <div style="background:rgba(255,255,255,0.025);border-radius:12px;padding:18px 20px;margin-bottom:24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#606080;width:90px;">Ügyfél</td>
              <td style="padding:6px 0;font-size:13px;color:#d0d0e8;font-weight:600;">${name}</td>
            </tr>
            ${email ? `<tr>
              <td style="padding:6px 0;font-size:13px;color:#606080;">Email</td>
              <td style="padding:6px 0;font-size:13px;"><a href="mailto:${email}" style="color:#7c6aed;text-decoration:none;">${email}</a></td>
            </tr>` : ''}
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#606080;">Összeg</td>
              <td style="padding:6px 0;font-size:20px;font-weight:800;color:#a855f7;">${amount.toLocaleString('hu-HU')} Ft</td>
            </tr>
          </table>
        </div>

        <div style="text-align:center;">
          <a href="${adminUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:12px;">
            Ajánlat kezelése az adminban →
          </a>
        </div>
      </div>
  `)
}
