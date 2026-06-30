'use client'

import { useMemo } from 'react'

type CompanySettings = {
  company_name: string | null
  logo_url: string | null
  address: string | null
  website: string | null
  email: string | null
  phone: string | null
  representative_name: string | null
}

type Customer = {
  name: string | null
  email: string | null
  phone: string | null
  is_company: boolean
  company_name: string | null
}

export function LivePreview({
  content,
  title,
  companySettings,
  customer,
}: {
  content: string
  title: string
  companySettings: CompanySettings | null
  customer: Customer | null
}) {
  const lines = useMemo(() => content.split('\n'), [content])

  const clientName = customer?.is_company
    ? (customer.company_name || customer.name || '')
    : (customer?.name || '')

  return (
    <div
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: 'white',
        color: '#1a1a1a',
        paddingTop: '18mm',
        paddingBottom: '22mm',
        paddingLeft: '20mm',
        paddingRight: '20mm',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: '1.55',
        boxShadow: '0 8px 50px rgba(0,0,0,0.5)',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1.5px solid #1a1a2e',
        paddingBottom: '6mm',
        marginBottom: '8mm',
      }}>
        <div>
          {companySettings?.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={companySettings.logo_url}
              alt="Logo"
              style={{ height: '36px', objectFit: 'contain', marginBottom: '4px' }}
            />
          )}
          {!companySettings?.logo_url && (
            <div style={{ fontSize: '14pt', fontWeight: '700', color: '#1a1a2e', letterSpacing: '-0.02em' }}>
              {companySettings?.company_name || 'Weboldalas.hu Kft.'}
            </div>
          )}
          {companySettings?.address && (
            <div style={{ fontSize: '8pt', color: '#555', marginTop: '2px' }}>{companySettings.address}</div>
          )}
        </div>
        <div style={{ textAlign: 'right', fontSize: '8pt', color: '#555' }}>
          {companySettings?.email && <div>{companySettings.email}</div>}
          {companySettings?.phone && <div>{companySettings.phone}</div>}
          {companySettings?.website && <div>{companySettings.website}</div>}
          <div style={{ marginTop: '4px', color: '#999' }}>{new Date().toLocaleDateString('hu-HU')}</div>
        </div>
      </div>

      {/* Document title */}
      <div style={{ fontSize: '8pt', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2mm' }}>
        Dokumentum
      </div>

      {/* Content */}
      <div style={{ fontSize: '9.5pt', lineHeight: '1.6', color: '#1a1a1a' }}>
        {lines.map((line, i) => {
          if (line === '---') {
            return <hr key={i} style={{ border: 'none', borderTop: '1px solid #ddd', margin: '6mm 0' }} />
          }
          if (line.trim() === '') {
            return <div key={i} style={{ height: '4mm' }} />
          }
          // All-caps lines are headings/section headers
          const isAllCaps = line === line.toUpperCase() && line.trim().length > 3 && /[A-ZÁÉÍÓÖŐÚÜŰ]/.test(line)
          const isNumberedSection = /^\d+\.\s/.test(line.trim())
          const isSignatureLine = line.includes('_____')

          if (isSignatureLine) {
            return (
              <div key={i} style={{
                fontFamily: 'Courier New, monospace',
                fontSize: '9pt',
                color: '#333',
                letterSpacing: '0.02em',
                marginTop: '2mm',
              }}>
                {line}
              </div>
            )
          }
          if (isAllCaps && line.trim().length > 5) {
            return (
              <div key={i} style={{
                fontWeight: '700',
                fontSize: '11pt',
                color: '#1a1a2e',
                marginTop: '5mm',
                marginBottom: '1mm',
                letterSpacing: '0.03em',
              }}>
                {line}
              </div>
            )
          }
          if (isNumberedSection) {
            return (
              <div key={i} style={{
                fontWeight: '700',
                fontSize: '10pt',
                color: '#1a1a2e',
                marginTop: '4mm',
                marginBottom: '1mm',
              }}>
                {line}
              </div>
            )
          }
          // Unresolved variables — highlight in yellow
          const hasVar = /\{\{[^}]+\}\}/.test(line)
          if (hasVar) {
            const parts = line.split(/(\{\{[^}]+\}\})/)
            return (
              <div key={i} style={{ color: '#333' }}>
                {parts.map((part, j) =>
                  /^\{\{[^}]+\}\}$/.test(part)
                    ? <span key={j} style={{ background: '#fff3cd', color: '#856404', padding: '0 2px', borderRadius: '3px', fontSize: '9pt' }}>{part}</span>
                    : <span key={j}>{part}</span>
                )}
              </div>
            )
          }
          return <div key={i} style={{ color: '#333' }}>{line}</div>
        })}
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '12mm',
        left: '20mm',
        right: '20mm',
        borderTop: '1px solid #eee',
        paddingTop: '3mm',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '7.5pt',
        color: '#aaa',
      }}>
        <span>{companySettings?.company_name || 'Weboldalas.hu Kft.'} · {companySettings?.website || 'weboldalas.hu'}</span>
        <span>1. oldal</span>
      </div>
    </div>
  )
}
