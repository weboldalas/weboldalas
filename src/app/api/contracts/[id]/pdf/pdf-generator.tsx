import {
  renderToBuffer,
  Document, Page, Text, View, Image, StyleSheet, Font,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    paddingTop: 55,
    paddingBottom: 55,
    paddingLeft: 56,
    paddingRight: 56,
    lineHeight: 1.6,
    color: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1.5,
    borderBottomColor: '#1a1a2e',
    paddingBottom: 12,
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerRight: {
    textAlign: 'right',
    fontSize: 8,
    color: '#666666',
  },
  logo: {
    height: 32,
    objectFit: 'contain',
    objectPositionX: 0,
  },
  companyName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 13,
    color: '#1a1a2e',
    marginBottom: 2,
  },
  companyAddress: {
    fontSize: 7.5,
    color: '#777777',
    marginTop: 1,
  },
  body: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10.5,
    color: '#1a1a2e',
    marginTop: 10,
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  numberedTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    color: '#1a1a2e',
    marginTop: 8,
    marginBottom: 1,
  },
  line: {
    fontSize: 9.5,
    color: '#333333',
    marginBottom: 1,
  },
  monoLine: {
    fontFamily: 'Courier',
    fontSize: 9,
    color: '#444444',
    marginTop: 2,
  },
  emptyLine: {
    marginBottom: 4,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginVertical: 10,
  },
  highlightedVar: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  footer: {
    position: 'absolute',
    bottom: 22,
    left: 56,
    right: 56,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7.5,
    color: '#bbbbbb',
  },
  signatureBlock: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    alignItems: 'center',
  },
  signatureImage: {
    width: 120,
    height: 40,
    objectFit: 'contain',
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    width: '100%',
    marginTop: 4,
    paddingTop: 3,
    fontSize: 8,
    color: '#555',
    textAlign: 'center',
  },
})

type CompanySettings = {
  company_name: string | null
  logo_url: string | null
  address: string | null
  website: string | null
  email: string | null
  phone: string | null
}

function PdfLine({ text }: { text: string }) {
  const isAllCaps = text === text.toUpperCase() && text.trim().length > 3 && /[A-ZÁÉÍÓÖŐÚÜŰ]/.test(text)
  const isNumbered = /^\d+\.\s/.test(text.trim())
  const isMono = text.includes('_____')

  if (isMono) return <Text style={styles.monoLine}>{text}</Text>
  if (isAllCaps && text.trim().length > 5) return <Text style={styles.sectionTitle}>{text}</Text>
  if (isNumbered) return <Text style={styles.numberedTitle}>{text}</Text>
  return <Text style={styles.line}>{text}</Text>
}

type PdfProps = {
  content: string
  title: string
  companySettings: CompanySettings | null
  clientSignature?: string | null
  companySignature?: string | null
}

function ContractDocument({ content, title, companySettings, clientSignature, companySignature }: PdfProps) {
  const lines = content.split('\n')
  const company = companySettings

  // Detect signature area lines (the last 5 lines before end)
  const signatureStartIndex = lines.findLastIndex(l => l.includes('_____'))
  const bodyLines = signatureStartIndex >= 0 ? lines.slice(0, signatureStartIndex - 3) : lines
  const sigLines = signatureStartIndex >= 0 ? lines.slice(signatureStartIndex - 3) : []

  const hasSignatures = !!(clientSignature || companySignature)

  return (
    <Document title={title} author={company?.company_name || 'Weboldalas.hu'}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            {company?.logo_url ? (
              <Image src={company.logo_url} style={styles.logo} />
            ) : (
              <Text style={styles.companyName}>{company?.company_name || 'Weboldalas.hu Kft.'}</Text>
            )}
            {company?.address && <Text style={styles.companyAddress}>{company.address}</Text>}
          </View>
          <View style={styles.headerRight}>
            {company?.email && <Text>{company.email}</Text>}
            {company?.phone && <Text>{company.phone}</Text>}
            {company?.website && <Text>{company.website}</Text>}
            <Text style={{ marginTop: 4, color: '#aaa' }}>
              {new Date().toLocaleDateString('hu-HU')}
            </Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {bodyLines.map((line, i) => {
            if (line === '---') return <View key={i} style={styles.separator} />
            if (line.trim() === '') return <View key={i} style={styles.emptyLine} />
            return <PdfLine key={i} text={line} />
          })}

          {/* Signature block */}
          {hasSignatures && (clientSignature || companySignature) ? (
            <View style={styles.signatureBlock}>
              <View style={styles.signatureBox}>
                {clientSignature && (
                  <Image src={clientSignature} style={styles.signatureImage} />
                )}
                <View style={styles.signatureLine}>
                  <Text>Megbízó</Text>
                </View>
              </View>
              <View style={styles.signatureBox}>
                {companySignature && (
                  <Image src={companySignature} style={styles.signatureImage} />
                )}
                <View style={styles.signatureLine}>
                  <Text>Megbízott</Text>
                </View>
              </View>
            </View>
          ) : (
            // Render signature lines from template text
            <>
              {sigLines.map((line, i) => {
                if (line === '---') return <View key={i} style={styles.separator} />
                if (line.trim() === '') return <View key={i} style={styles.emptyLine} />
                return <PdfLine key={i} text={line} />
              })}
            </>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>{company?.company_name || 'Weboldalas.hu'} · {company?.website || 'weboldalas.hu'}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}

export async function generatePdfBuffer(props: PdfProps): Promise<Buffer> {
  const result = await renderToBuffer(<ContractDocument {...props} />)
  return Buffer.isBuffer(result) ? result : Buffer.from(result)
}
