import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { ContractActions } from './ContractActions'

function ContractContent({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div style={{
      fontFamily: 'Georgia, "Times New Roman", Times, serif',
      fontSize: '10.5pt',
      lineHeight: 1.75,
      color: '#1A1917',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
    }}>
      {lines.map((line, i) => {
        if (line === '---') return <hr key={i} style={{ border: 'none', borderTop: '1px solid #D6D3CE', margin: '7mm 0' }} />
        if (line.trim() === '') return <div key={i} style={{ height: '5mm' }} />
        const isAllCaps = line === line.toUpperCase() && line.trim().length > 3 && /[A-ZÁÉÍÓÖŐÚÜŰ]/.test(line)
        const isNumberedSection = /^\d+\.\s/.test(line.trim())
        const isSignatureLine = line.includes('_____')
        if (isSignatureLine) return (
          <div key={i} style={{ fontFamily: 'Courier New, monospace', fontSize: '9pt', color: '#6B6860', letterSpacing: '0.02em', marginTop: '2mm' }}>{line}</div>
        )
        if (isAllCaps && line.trim().length > 5) return (
          <div key={i} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700, fontSize: '9.5pt', color: '#1E3A5F', marginTop: '6mm', marginBottom: '2mm', letterSpacing: '0.08em' }}>{line}</div>
        )
        if (isNumberedSection) return (
          <div key={i} style={{ fontWeight: 700, color: '#1A1917', marginTop: '4mm', marginBottom: '1mm' }}>{line}</div>
        )
        return <div key={i} style={{ color: '#3D3B39' }}>{line}</div>
      })}
    </div>
  )
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const STATUS_INFO: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  draft:            { label: 'Tervezet',        color: '#6B6860', bg: '#F5F4F2', dot: '#A09D98' },
  generated:        { label: 'Generált',         color: '#6B6860', bg: '#F5F4F2', dot: '#A09D98' },
  sent:             { label: 'Elküldve',         color: '#1E3A5F', bg: '#E8EFF8', dot: '#2563EB' },
  review_requested: { label: 'Módosítás kérve',  color: '#7C3A00', bg: '#FFF8EC', dot: '#D97706' },
  signed:           { label: 'Aláírva',          color: '#14663B', bg: '#E9F7EE', dot: '#16A34A' },
}

export default async function PublicContractPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = getServiceClient()

  const [{ data: doc }, { data: settings }] = await Promise.all([
    supabase
      .from('documents')
      .select('id, title, status, review_note, customers(name, company_name, is_company, email)')
      .eq('public_token', token)
      .single(),
    supabase
      .from('company_settings')
      .select('owner_signature, company_name, brand_name, logo_url')
      .limit(1)
      .single(),
  ])

  if (!doc) notFound()

  const { data: version } = await supabase
    .from('document_versions')
    .select('content, signed_at, client_signature')
    .eq('document_id', doc.id)
    .order('version', { ascending: false })
    .limit(1)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customer = (doc.customers as unknown as { name: string | null; company_name: string | null; is_company: boolean; email: string | null } | null)
  const partnerName = customer?.is_company ? (customer.company_name || customer.name) : customer?.name
  const hasOwnerSignature = !!(settings?.owner_signature)
  const companyName = settings?.brand_name || settings?.company_name || 'Weboldalas.hu'
  const statusInfo = STATUS_INFO[doc.status] ?? STATUS_INFO.sent

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#EAE8E3', color: '#1A1917', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Sticky header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #D6D3CE', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '11px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Image src="/weboldalas-logo.svg" alt="Weboldalas" width={118} height={16} style={{ opacity: 0.7 }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 500, padding: '5px 11px', borderRadius: 20,
            color: statusInfo.color, background: statusInfo.bg,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusInfo.dot, display: 'inline-block', flexShrink: 0 }} />
            {statusInfo.label}
          </div>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 780, width: '100%', margin: '0 auto', padding: '32px 16px 130px', boxSizing: 'border-box' }}>

        {/* Intro */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
            fontSize: 'clamp(21px, 4vw, 29px)',
            fontWeight: 700,
            color: '#1A1917',
            margin: '0 0 10px',
            lineHeight: 1.3,
          }}>
            {doc.title}
          </h1>
          {partnerName && (
            <p style={{ fontSize: 14, color: '#6B6860', margin: 0, lineHeight: 1.6 }}>
              Kedves <strong style={{ color: '#1A1917' }}>{partnerName}</strong>! Kérjük, olvassa el figyelmesen az alábbi szerződést, majd válasszon az oldal alján megjelenő lehetőségek közül.
            </p>
          )}
        </div>

        {/* Status banners */}
        {doc.status === 'signed' && (
          <div style={{ marginBottom: 24, padding: '13px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 11, background: '#E9F7EE', border: '1px solid #86EFAC' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#14663B', margin: 0 }}>Ez a szerződés aláírásra került.</p>
          </div>
        )}
        {doc.status === 'review_requested' && doc.review_note && (
          <div style={{ marginBottom: 24, padding: '13px 16px', borderRadius: 8, background: '#FFF8EC', border: '1px solid #FCD34D' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#7C3A00', margin: '0 0 3px' }}>Módosítási kérelem elküldve</p>
            <p style={{ fontSize: 13, color: '#92400E', margin: 0 }}>&ldquo;{doc.review_note}&rdquo;</p>
          </div>
        )}

        {/* Document paper */}
        <div style={{
          background: '#fff',
          borderRadius: 4,
          boxShadow: '0 2px 14px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
          border: '1px solid #D6D3CE',
          overflow: 'hidden',
        }}>
          <div style={{ padding: 'clamp(28px, 6vw, 56px) clamp(24px, 7vw, 64px)' }}>
            <ContractContent content={version?.content ?? ''} />
          </div>

          {/* Signatures after signing */}
          {doc.status === 'signed' && version?.client_signature && (
            <div style={{ padding: '24px clamp(24px, 7vw, 64px)', borderTop: '1px solid #EAE8E3' }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A09D98', margin: '0 0 16px' }}>Aláírások</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                <div>
                  <p style={{ fontSize: 12, color: '#A09D98', margin: '0 0 8px' }}>{partnerName || 'Partner'}</p>
                  <div style={{ borderRadius: 6, border: '1px solid #EAE8E3', background: '#FAFAF9', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={version.client_signature} alt="Aláírás" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  {version.signed_at && (
                    <p style={{ fontSize: 11, color: '#A09D98', margin: '6px 0 0' }}>
                      {new Date(version.signed_at).toLocaleString('hu-HU')}
                    </p>
                  )}
                </div>
                <div>
                  <p style={{ fontSize: 12, color: '#A09D98', margin: '0 0 8px' }}>{companyName}</p>
                  {settings?.owner_signature ? (
                    <div style={{ borderRadius: 6, border: '1px solid #EAE8E3', background: '#FAFAF9', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img src={settings.owner_signature} alt="Aláírás" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                  ) : (
                    <div style={{ borderRadius: 6, border: '1px solid #EAE8E3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A09D98', fontSize: 12, height: 80 }}>P.H.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom spacing label */}
        <p style={{ textAlign: 'center', fontSize: 12, color: '#A09D98', margin: '20px 0 0' }}>
          © {new Date().getFullYear()} {companyName}
        </p>
      </main>

      <ContractActions
        token={token}
        status={doc.status}
        reviewNote={doc.review_note ?? null}
        partnerEmail={customer?.email ?? null}
        hasOwnerSignature={hasOwnerSignature}
        title={doc.title}
      />
    </div>
  )
}
