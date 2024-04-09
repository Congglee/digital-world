import { Document, Font, Image, Page, Polygon, StyleSheet, Svg, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import config from 'src/constants/config'
import { Rating } from 'src/types/product.type'
import { chunkSubstr } from 'src/utils/utils'

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
    width: '16.6666667%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol: {
    width: '16.6666667%',
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

Font.registerHyphenationCallback((word) => {
  if (word.length > 12) {
    return chunkSubstr(word, 10)
  } else {
    return [word]
  }
})

export default function PDFRatingDetailTable({ ratings, productName }: { ratings: Rating[]; productName: string }) {
  return (
    <Document title={`Danh sách đánh giá của sản phẩm ${productName}`}>
      <Page size='A4' style={styles.body} wrap>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>RatingID</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Khách hàng</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Avatar</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Đánh giá</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Bình luận</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Ngày đăng</Text>
            </View>
          </View>
          {ratings?.map((rating) => (
            <View style={styles.tableRow} key={rating._id}>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{rating._id}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{rating.user_name}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Image src={rating.user_avatar ? rating.user_avatar : config.defaultUserImageUrl} />
              </View>
              <View style={[styles.tableCol]}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <>
                    <Text style={[styles.tableCell, { marginRight: 3 }]}>{rating.star}</Text>
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
                </View>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{rating.comment}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{format(rating.date, 'dd/MM/yyyy')}</Text>
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
