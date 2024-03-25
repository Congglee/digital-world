import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { Category } from 'src/types/category.type'

Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500
    },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 600 }
  ]
})

const styles = StyleSheet.create({
  body: {
    padding: 10,
    fontFamily: 'Roboto'
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1
    // borderRightWidth: 0,
    // borderBottomWidth: 0
  },
  tableRow: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
    flexGrow: 1
  },
  tableColHeader: {
    width: '33.33%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol: {
    width: '33.33%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCellHeader: {
    // margin: 'auto',
    margin: 8,
    fontSize: 8,
    fontWeight: 500
  },
  tableCell: {
    // margin: 'auto',
    margin: 8,
    fontSize: 8
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey'
  }
})

function chunkSubstr(str: string, size: number) {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substring(o, size)
  }

  return chunks
}

Font.registerHyphenationCallback((word) => {
  if (word.length > 12) {
    return chunkSubstr(word, 10)
  } else {
    return [word]
  }
})

export function PDFCategoriesTableDocument({ categories }: { categories: Category[] }) {
  return (
    <Document title='Danh sách danh mục'>
      <Page size='A4' style={styles.body} wrap>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>ID</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Tên danh mục</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Thương hiệu</Text>
            </View>
          </View>
          {categories?.map((category) => (
            <View style={styles.tableRow} key={category._id}>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{category._id}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{category.name}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{category.brands.map((brand) => brand.name).join(' - ')}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
