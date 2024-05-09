import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { config } from 'src/constants/config'
import { User } from 'src/types/user.type'
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
    width: '10%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol: {
    width: '10%',
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

function WrapText({ text }: { text?: string }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {text?.match(/\w+|\W+/g)?.map((seg, i) => <Text key={i}>{seg}</Text>)}
    </View>
  )
}

export default function PDFUsersTableDocument({ users }: { users: User[] }) {
  return (
    <Document title='Danh sách người dùng'>
      <Page size='A4' style={styles.body} wrap>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>ID</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Họ và tên</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Email</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Avatar</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Ngày sinh</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Địa chỉ</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Tỉnh</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Quận huyện</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Phường</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>SĐT</Text>
            </View>
          </View>
          {users?.map((user) => (
            <View style={styles.tableRow} key={user._id}>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{user._id}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{user.name}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>
                  <WrapText text={user.email} />
                </Text>
              </View>
              <View style={[styles.tableCol]}>
                <Image src={user.avatar ? user.avatar : config.defaultUserImageUrl} />
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>
                  {user.date_of_birth ? format(user.date_of_birth, 'dd/MM/yyyy', { locale: vi }) : ''}
                </Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{user.address || ''}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{user.province}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{user.district}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{user.ward}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>{user.phone}</Text>
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
