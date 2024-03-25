import { View, StyleSheet, Text, Document, Page, Image, Font, PDFViewer, Svg, Polygon } from '@react-pdf/renderer'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { Product } from 'src/types/product.type'
import { convertHTMLToPlainText, formatCurrency } from 'src/utils/utils'

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
    width: '11.11%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol: {
    width: '11.11%',
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

export function PDFProductsTableDocument({ products }: { products: Product[] }) {
  return (
    <Document title='Danh sách sản phẩm'>
      <Page size='A4' style={styles.body} wrap>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>ID</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Tên sản phẩm</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Ảnh</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Giá</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Giá gốc</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Đánh giá</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '8%' }]}>
              <Text style={styles.tableCellHeader}>Danh mục</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '8%' }]}>
              <Text style={styles.tableCellHeader}>Thương hiệu</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '17.34%' }]}>
              <Text style={styles.tableCellHeader}>Thông số kỹ thuật</Text>
            </View>
          </View>
          {products?.map((product) => (
            <View style={styles.tableRow} key={product._id}>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{product._id}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{product.name}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Image src={product.thumb} />
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{formatCurrency(product.price)}đ</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{formatCurrency(product.price_before_discount)}đ</Text>
              </View>
              <View style={[styles.tableCol]}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  {product.total_ratings > 0 ? (
                    <>
                      <Text style={[styles.tableCell, { marginRight: 3 }]}>{product.total_ratings}</Text>
                      <Svg
                        width={8}
                        height={8}
                        viewBox='0 0 24 24'
                        fill='yellow'
                        stroke='currentColor'
                        strokeWidth={2}
                        strokeLinejoin='round'
                      >
                        <Polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
                      </Svg>
                    </>
                  ) : (
                    <Text style={[styles.tableCell]}>Không có đánh giá</Text>
                  )}
                </View>
              </View>
              <View style={[styles.tableCol, { width: '8%' }]}>
                <Text style={styles.tableCell}>{product.category.name}</Text>
              </View>
              <View style={[styles.tableCol, { width: '8%' }]}>
                <Text style={styles.tableCell}>{product.brand}</Text>
              </View>
              <View style={[styles.tableCol, { width: '17.34%' }]}>
                <Text style={styles.tableCell}>{convertHTMLToPlainText(product.overview)}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}

export default function PDFViewProductsTable({
  products,
  open,
  onOpenStateChange
}: {
  products: Product[]
  open: boolean
  onOpenStateChange: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenStateChange}>
      <DialogContent className='max-w-screen-lg h-[650px]'>
        <PDFViewer className='w-full h-full'>
          <PDFProductsTableDocument products={products} />
        </PDFViewer>
      </DialogContent>
    </Dialog>
  )
}
