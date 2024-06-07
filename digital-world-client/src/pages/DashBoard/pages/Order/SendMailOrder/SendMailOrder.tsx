import { yupResolver } from '@hookform/resolvers/yup'
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
import { generateOrderNotifyEmail } from 'src/utils/mail'
import { MailSchema, mailSchema } from 'src/utils/rules'

type FormData = Pick<MailSchema, 'email' | 'subject' | 'content'>
const sendOrderMailSchema = mailSchema.pick(['email', 'subject', 'content'])

export default function SendMailOrder() {
  const { order_id } = useParams()
  const { data: orderData } = useGetOrderQuery(order_id!)
  const order = orderData?.data.data

  const form = useForm<FormData>({
    resolver: yupResolver(sendOrderMailSchema),
    defaultValues: { email: '', subject: '', content: '' }
  })
  const emailContent = generateOrderNotifyEmail(order!)
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
      <PageHeading heading='Gửi mail thông báo đơn hàng' hasDownload={false}>
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
