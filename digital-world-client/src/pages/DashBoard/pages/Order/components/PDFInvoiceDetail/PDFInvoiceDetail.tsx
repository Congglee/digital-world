import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Fragment } from 'react'
import logo from 'src/assets/images/logo.png'
import { Order } from 'src/types/order.type'
import { chunkSubstr, formatCurrency } from 'src/utils/utils'

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
  ],
  format: 'truetype'
})

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    paddingTop: 20,
    paddingLeft: 40,
    paddingRight: 40,
    lineHeight: 1.5,
    flexDirection: 'column',
    fontFamily: 'Roboto'
  },

  spaceBetween: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#3E3E3E'
  },

  titleContainer: { flexDirection: 'row', marginTop: 24 },

  logo: { width: 90 },

  reportTitle: { fontSize: 16, textAlign: 'center' },

  addressTitle: { fontSize: 11 },

  invoice: { fontWeight: 600, fontSize: 20 },

  invoiceNumber: { fontSize: 11, fontWeight: 600 },

  address: { fontWeight: 400, fontSize: 10 },

  theader: {
    marginTop: 20,
    fontSize: 10,
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1,
    height: 20,
    backgroundColor: '#DEDEDE',
    borderColor: 'whitesmoke',
    borderRightWidth: 1,
    borderBottomWidth: 1
  },

  theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

  tbody: {
    fontSize: 9,
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1,
    borderColor: 'whitesmoke',
    borderRightWidth: 1,
    borderBottomWidth: 1
  },

  total: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1.5, borderColor: 'whitesmoke', borderBottomWidth: 1 },

  tbody2: { flex: 2, borderRightWidth: 1 }
})

Font.registerHyphenationCallback((word) => {
  if (word.length > 12) {
    return chunkSubstr(word, 10)
  } else {
    return [word]
  }
})

function WrapText({ text }: { text?: string }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {text?.match(/\w+|\W+/g)?.map((seg, i) => <Text key={i}>{seg}</Text>)}
    </View>
  )
}

export default function PDFInvoiceDetailDocument({ order }: { order: Order }) {
  function InvoiceTitle() {
    return (
      <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
          <Image style={styles.logo} src={logo} />
          <Text style={styles.reportTitle}>Digital World 2</Text>
        </View>
      </View>
    )
  }

  function Address() {
    return (
      <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
          <View>
            <Text style={styles.invoice}>Hóa đơn </Text>
            <Text style={styles.invoiceNumber}>Mã hóa đơn: {order.order_code}</Text>
          </View>
          <View>
            <Text style={styles.addressTitle}>{order.order_by.user_name}</Text>
            <WrapText text={order.order_by.user_email} />
            <Text style={styles.addressTitle}>{order.order_by.user_phone}</Text>
          </View>
        </View>
      </View>
    )
  }

  function UserAddress() {
    return (
      <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
          <View style={{ maxWidth: 200 }}>
            <Text style={styles.addressTitle}>Địa chỉ giao tới</Text>
            <Text style={styles.address}>{order.delivery_at}</Text>
          </View>
          <Text style={styles.addressTitle}>{format(order.date_of_order, 'dd/MM/yyyy', { locale: vi })}</Text>
        </View>
      </View>
    )
  }

  function TableHead() {
    return (
      <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
        <View style={[styles.theader, styles.theader2]}>
          <Text>Sản phẩm</Text>
        </View>
        <View style={[styles.theader]}>
          <Text>Ảnh</Text>
        </View>
        <View style={styles.theader}>
          <Text>Giá</Text>
        </View>
        <View style={styles.theader}>
          <Text>Số lượng</Text>
        </View>
        <View style={styles.theader}>
          <Text>Thành tiền</Text>
        </View>
      </View>
    )
  }

  function TableBody() {
    return order.products.map((product) => (
      <Fragment key={product._id}>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <View style={[styles.tbody, styles.tbody2]}>
            <Text>{product.product_name}</Text>
          </View>
          <View style={[styles.tbody]}>
            <Image src={product.product_thumb} />
          </View>
          <View style={styles.tbody}>
            <Text>{formatCurrency(product.product_price)}đ</Text>
          </View>
          <View style={styles.tbody}>
            <Text>{product.buy_count}</Text>
          </View>
          <View style={styles.tbody}>
            <Text>{formatCurrency(product.buy_count * product.product_price)}đ</Text>
          </View>
        </View>
      </Fragment>
    ))
  }

  function TableTotal() {
    return (
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <View style={styles.total}>
          <Text></Text>
        </View>
        <View style={styles.total}>
          <Text> </Text>
        </View>
        <View style={styles.tbody}>
          <Text>Tổng cộng</Text>
        </View>
        <View style={styles.tbody}>
          <Text>{formatCurrency(order.total_amount)}đ</Text>
        </View>
      </View>
    )
  }

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <InvoiceTitle />
        <Address />
        <UserAddress />
        <TableHead />
        <TableBody />
        <TableTotal />
      </Page>
    </Document>
  )
}
