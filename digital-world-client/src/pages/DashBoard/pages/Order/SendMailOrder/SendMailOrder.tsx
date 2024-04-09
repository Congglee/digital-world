import { yupResolver } from '@hookform/resolvers/yup'
import { format } from 'date-fns'
import { List, Loader } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import RichTextEditor from 'src/components/AdminPanel/RichTextEditor'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import path from 'src/constants/path'
import { useSendNotifyMailMutation } from 'src/redux/apis/mail.api'
import { useGetOrderQuery } from 'src/redux/apis/order.api'
import { Order } from 'src/types/order.type'
import { OrderSchema, orderSchema } from 'src/utils/rules'
import { formatCurrency } from 'src/utils/utils'

function generateOrderNotifyMail(order: Order) {
  if (!order) return ''
  return `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0;">
  <div style="max-width: 880px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center;">
      <img src="https://res.cloudinary.com/di3eto0bg/image/upload/v1712352612/digital-world/logo_tx9mt2.png" alt="Shop Logo" style="max-width: 100%; height: auto; margin-bottom: 20px;">
    </div>
    <div style="background-color: #3498db; color: #fff; padding: 20px; text-align: center; border-top-left-radius: 5px; border-top-right-radius: 5px;">
      <h1>Xác nhận đơn hàng</h1>
    </div>
    <div style="margin-top: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <h2 style="margin-top: 0; color: #333;">Cảm ơn!</h2>
      <p>Kính gửi ${order.order_by.user_name},</p>
      <p>Chúng tôi xin chân thành cảm ơn bạn đã đặt hàng ở shop chúng tôi.</p>
      <p>Nếu như có bất cứ thông tin mới nhất nào cập nhật về đơn hàng của bạn chúng tôi sẽ thông báo lại cho bạn qua mail sau.</p>
      <p>Dưới đây là những thông tin chi tiết về đơn hàng của bạn:</p>
      <div style="margin-bottom: 10px;">
        <strong>Mã đơn hàng:</strong> ${order.order_code}
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Ngày đặt hàng:</strong> ${format(order.date_of_order, 'dd/MM/yyyy')}
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Trạng thái đơn hàng:</strong> ${order.order_status}
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Sản phẩm</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Ảnh</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Số lượng</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Giá</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
        ${order.products
          .map((product) => {
            return `<tr>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${product.product_name}</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">
                <img src="${product.product_thumb}" alt="{{this.name}}" style="max-width: 100%; height: auto;">
              </td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${product.buy_count}</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${formatCurrency(product.product_price)}đ</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${formatCurrency(product.buy_count * product.product_price)}đ</td>
            </tr>`
          })
          .join('')}
        </tbody>
      </table>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #333; border: 1px dotted #ddd;">Tóm tắt đơn hàng</td>
          <td style="padding: 10px; font-weight: bold; color: #333; border: 1px dotted #ddd;"></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px dotted #ddd;">Tổng phụ</td>
          <td style="padding: 10px; text-align: right; border: 1px dotted #ddd;">${formatCurrency(order.total_amount)}đ</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px dotted #ddd;">Phí vận chuyển</td>
          <td style="padding: 10px; text-align: right; border: 1px dotted #ddd;">0.00đ</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px dotted #ddd;">Tổng tiền</td>
          <td style="padding: 10px; text-align: right; border: 1px dotted #ddd;">${formatCurrency(order.total_amount)}đ</td>
        </tr>
      </table>
      <div style="margin-top: 20px;">
        <h3 style="font-weight: bold; color: #333;">Phương thức thanh toán</h3>
        <div style="color: #666;">
          ${order.payment_method}
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="width: 50%; padding: 10px; border: 1px dotted #ddd;">
            <h3 style="font-weight: bold; color: #333;">Thông tin thanh toán</h3>
            <div style="color: #666;">
              ${order.order_by.user_name}<br>
              ${order.delivery_at}<br>
              ${order.order_by.user_email}<br>
              ${order.order_by.user_phone}
            </div>
          </td>
          <td style="width: 50%; padding: 10px; border: 1px dotted #ddd;">
            <h3 style="font-weight: bold; color: #333;">Thông tin vận chuyển</h3>
            <div style="color: #666;">
              ${order.order_by.user_name}<br>
              ${order.delivery_at}<br>
              <br>
              <br>
            </div>
          </td>
        </tr>
      </table>
      <div style="text-align: center; margin-top: 20px;">
        <p>Đây là email tự động. Xin vui lòng không trả lời.</p>
        <p>Truy cập trang web của chúng tôi: <a href="http://localhost:3000/">www.digital-world-2.com</a></p>
      </div>
  </body>`
}

type FormData = Pick<OrderSchema, 'email' | 'subject' | 'content'>
const sendOrderMailSchema = orderSchema.pick(['email', 'subject', 'content'])

export default function SendMailOrder() {
  const { order_id } = useParams()
  const { data: orderData } = useGetOrderQuery(order_id!)
  const order = orderData?.data.data

  const form = useForm<FormData>({
    resolver: yupResolver(sendOrderMailSchema),
    defaultValues: { email: '', subject: '', content: '' }
  })
  const emailContent = generateOrderNotifyMail(order!)
  const [sendNotifyMail, { data, isSuccess, isLoading }] = useSendNotifyMailMutation()

  useEffect(() => {
    if (order) {
      form.setValue('email', order.order_by.user_email)
      form.setValue('content', emailContent)
      form.setValue('subject', 'Thông báo: Trạng thái đơn hàng của bạn đã được cập nhật!')
    }
  }, [order])

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await sendNotifyMail(data)
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.data.message)
    }
  }, [isSuccess])

  if (!order) return null

  return (
    <>
      <PageHeading heading='Gửi mail thông báo đơn hàng' isDownload={false}>
        <Link to={path.orderDashBoard}>
          <Button variant='outline' className='w-full space-x-2 bg-blue-500'>
            <List />
            <span>Quản lý đơn hàng</span>
          </Button>
        </Link>
      </PageHeading>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 sm:gap-5 mb-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>Người nhận</FormLabel>
                  <FormControl>
                    <Input placeholder='Email người nhận...' className='cursor-pointer' {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='subject'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder='Tiêu đề...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <RichTextEditor value={emailContent} onChange={field.onChange} editorHeight={500} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='space-x-4'>
            <Button type='submit' className='px-10' disabled={isLoading}>
              {isLoading ? <Loader className='animate-spin w-4 h-4 mr-1' /> : null}
              Gửi
            </Button>
            <Button
              type='button'
              variant='outline'
              className='px-10'
              onClick={() => {
                form.reset((values) => ({
                  ...values,
                  subject: 'Thông báo: Trạng thái đơn hàng của bạn đã được cập nhật!'
                }))
              }}
            >
              Hủy
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
