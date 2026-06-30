import ReactPDF, { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 60,
    paddingBottom: 60,
    paddingLeft: 70,
    paddingRight: 70,
    lineHeight: 1.6,
    color: '#1a1a1a',
  },
  line: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    marginBottom: 1,
  },
  lineBold: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    marginBottom: 2,
  },
  emptyLine: {
    marginBottom: 6,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginVertical: 8,
  },
})

function ContractDocument({ content, title }: { content: string; title: string }) {
  const lines = content.split('\n')

  return (
    <Document title={title} author="Weboldalas.hu">
      <Page size="A4" style={styles.page}>
        <View>
          {lines.map((line, i) => {
            if (line === '---') {
              return <View key={i} style={styles.separator} />
            }
            if (line.trim() === '') {
              return <View key={i} style={styles.emptyLine} />
            }
            const isBold =
              line === line.toUpperCase() &&
              line.trim().length > 2 &&
              /[A-ZÁÉÍÓÖŐÚÜŰ]/.test(line)
            return (
              <Text key={i} style={isBold ? styles.lineBold : styles.line}>
                {line}
              </Text>
            )
          })}
        </View>
      </Page>
    </Document>
  )
}

export async function generatePdfBuffer(content: string, title: string): Promise<Buffer> {
  const stream = await ReactPDF.renderToBuffer(
    <ContractDocument content={content} title={title} />
  )
  return Buffer.isBuffer(stream) ? stream : Buffer.from(stream)
}
