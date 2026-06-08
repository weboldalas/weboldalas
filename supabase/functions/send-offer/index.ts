import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const APP_URL = Deno.env.get('NEXT_PUBLIC_APP_URL') || 'http://localhost:3000';
const FROM_EMAIL = 'Weboldalas <noreply@weboldalas.hu>';
const CONTACT_EMAIL = 'info@weboldalas.hu';
const CONTACT_PHONE = '+36 30 540 4177';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { offer, customer } = await req.json();

    const { data: items } = await supabase
      .from('offer_items')
      .select('*')
      .eq('offer_id', offer.id)
      .order('created_at', { ascending: true });
    const publicUrl = `${APP_URL}/offers/view/${offer.public_token}`;

    let paymentBadge = 'Egyösszegű fizetés';
    let paymentLabel = 'Összesen fizetendő';
    let paymentNote = '';

    if (offer.payment_type === 'installments') {
      paymentBadge = `Részletfizetés — ${offer.installment_months} hónap`;
      const monthly = Math.round(Number(offer.total_amount) / offer.installment_months);
      paymentNote = `Havi részlet: <strong>${monthly.toLocaleString('hu-HU')} Ft</strong>`;
    } else if (offer.payment_type === 'subscription') {
      paymentBadge = `Előfizetés — ${offer.subscription_plan_name || 'Havidíjas'}`;
      paymentLabel = 'Havi díj';
      paymentNote = offer.subscription_note || '';
    }

    const itemsHtml = items.map((item: { description: string; price: number }) => `
      <tr>
        <td style="padding: 13px 20px; border-bottom: 1px solid #1a1a2e; color: #b0b0cc; font-size: 14px; line-height: 1.5;">${item.description}</td>
        <td style="padding: 13px 20px; border-bottom: 1px solid #1a1a2e; color: #e0e0f0; font-size: 14px; text-align: right; white-space: nowrap; font-weight: 700;">${Number(item.price).toLocaleString('hu-HU')} Ft</td>
      </tr>
    `).join('');

    const emailHtml = `
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Árajánlat – Weboldalas</title>
</head>
<body style="margin:0;padding:0;background:#07070e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#07070e;padding:40px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

  <!-- Logo -->
  <tr>
    <td style="padding-bottom:28px;text-align:center;">
      <img src="${APP_URL}/weboldalas-logo.svg" alt="Weboldalas" width="150" height="20" style="display:inline-block;opacity:0.9;" />
    </td>
  </tr>

  <!-- Hero card -->
  <tr>
    <td style="background:linear-gradient(135deg,#1a0a2e,#0d0d20);border:1px solid rgba(168,85,247,0.25);border-radius:20px;overflow:hidden;">

      <!-- Purple top bar -->
      <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:28px 32px;">
        <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:3px;font-weight:600;">Személyre szabott árajánlat</p>
        <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;">Kedves ${customer.name}!</h1>
        <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.75);line-height:1.6;">
          Köszönjük érdeklődését! Az alábbiakban megtalálja az Önnek összeállított árajánlatunkat.
        </p>
      </div>

      <!-- Body -->
      <div style="padding:28px 32px;">

        <!-- Payment type badge -->
        <div style="display:inline-block;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.35);border-radius:8px;padding:8px 16px;margin-bottom:24px;">
          <span style="font-size:13px;color:#a78bfa;font-weight:700;">${paymentBadge}</span>
        </div>

        <!-- Items table -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1e1e3a;border-radius:12px;overflow:hidden;margin-bottom:${paymentNote ? '16px' : '24px'};">
          <thead>
            <tr style="background:#0f0f1e;">
              <th style="padding:11px 20px;text-align:left;font-size:11px;color:#6060a0;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">Szolgáltatás</th>
              <th style="padding:11px 20px;text-align:right;font-size:11px;color:#6060a0;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">Ár</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background:rgba(124,58,237,0.12);">
              <td style="padding:16px 20px;font-size:14px;font-weight:700;color:#c4b5fd;">${paymentLabel}</td>
              <td style="padding:16px 20px;font-size:22px;font-weight:800;color:#a855f7;text-align:right;">${Number(offer.total_amount).toLocaleString('hu-HU')} Ft</td>
            </tr>
          </tfoot>
        </table>

        ${paymentNote ? `<p style="margin:0 0 24px;font-size:13px;color:#7070a0;line-height:1.6;padding:12px 16px;background:rgba(255,255,255,0.03);border-radius:8px;border-left:3px solid rgba(124,58,237,0.5);">${paymentNote}</p>` : ''}

        <!-- What's included -->
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;margin-bottom:28px;">
          <p style="margin:0 0 12px;font-size:12px;color:#6060a0;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">Miért válasszon minket?</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:5px 0;font-size:13px;color:#9090b0;width:20px;">✓</td>
              <td style="padding:5px 0;font-size:13px;color:#9090b0;">Modern, mobilbarát design</td>
            </tr>
            <tr>
              <td style="padding:5px 0;font-size:13px;color:#9090b0;width:20px;">✓</td>
              <td style="padding:5px 0;font-size:13px;color:#9090b0;">Gyors elkészítés, rövid átfutási idő</td>
            </tr>
            <tr>
              <td style="padding:5px 0;font-size:13px;color:#9090b0;width:20px;">✓</td>
              <td style="padding:5px 0;font-size:13px;color:#9090b0;">Folyamatos támogatás és karbantartás</td>
            </tr>
            <tr>
              <td style="padding:5px 0;font-size:13px;color:#9090b0;width:20px;">✓</td>
              <td style="padding:5px 0;font-size:13px;color:#9090b0;">SEO-optimalizált megoldások</td>
            </tr>
          </table>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin-bottom:20px;">
          <a href="${publicUrl}"
             style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 42px;border-radius:12px;letter-spacing:0.3px;">
            Ajánlat megtekintése és döntés →
          </a>
        </div>
        <p style="text-align:center;font-size:12px;color:#404060;margin:0 0 4px;">Az ajánlat megtekintéséhez és elfogadásához/elutasításához kattintson a gombra.</p>
        <p style="text-align:center;font-size:11px;color:#353555;word-break:break-all;margin:0;">${publicUrl}</p>
      </div>

      <!-- Contact footer -->
      <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#6060a0;">
              <strong style="color:#8080a0;display:block;margin-bottom:6px;">Kérdése van?</strong>
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
    <td style="padding:24px 0 0;text-align:center;">
      <p style="margin:0;font-size:11px;color:#303050;">
        Ez az üzenet automatikusan lett küldve a Weboldalas rendszeréből.<br/>
        © ${new Date().getFullYear()} Weboldalas – Minden jog fenntartva.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>

</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [customer.email],
        subject: `Árajánlat az Ön számára – Weboldalas`,
        html: emailHtml,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error('Resend error:', result);
      return new Response(JSON.stringify({ error: result }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
