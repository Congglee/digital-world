import { yupResolver } from '@hookform/resolvers/yup'
import { pdf } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { saveAs } from 'file-saver'
import { ArrowDownUp, CheckIcon, List, Loader, Send, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card'
import { Command, CommandGroup, CommandItem } from 'src/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from 'src/components/ui/table'
import { deliveryStatusOptions, orderStatusOptions, paymentStatusOptions } from 'src/constants/options'
import path from 'src/constants/path'
import { useGetOrderQuery, useUpdateUserOrderMutation } from 'src/redux/apis/order.api'
import { OrderSchema, orderSchema } from 'src/utils/rules'
import { cn, formatCurrency, getAvatarUrl } from 'src/utils/utils'
import PDFInvoiceDetailDocument from '../components/PDFInvoiceDetail'
import ShippingStatusDialog from '../components/ShippingStatusDialog'

type FormData = Pick<OrderSchema, 'order_status' | 'payment_status'>
const updateUserOrderSchema = orderSchema.pick(['order_status', 'payment_status'])

export default function UpdateUserOrder() {
  const { order_id } = useParams()
  const { data: orderData, refetch } = useGetOrderQuery(order_id!)
  const order = orderData?.data.data

  const form = useForm<FormData>({
    resolver: yupResolver(updateUserOrderSchema),
    defaultValues: { order_status: '', payment_status: '' }
  })
  const [updateUserOrder, { data, isSuccess, isLoading }] = useUpdateUserOrderMutation()
  const [shippingStatusDialogOpen, setShippingStatusDialogOpen] = useState<boolean>(false)

  useEffect(() => {
    if (order) {
      form.setValue('order_status', order.order_status)
      form.setValue('payment_status', order.payment_status)
    }
  }, [order, form.setValue])

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateUserOrder({ id: order_id!, payload: { ...data, delivery_status: order?.delivery_status! } })
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.data.message)
      refetch()
    }
  }, [isSuccess])

  const handleRefetchOrder = () => {
    refetch()
  }

  const handleDownloadPdf = () => {
    pdf(<PDFInvoiceDetailDocument order={order!} />)
      .toBlob()
      .then((blob) => saveAs(blob, 'hoa_don.pdf'))
  }

  if (!order) return null

  return (
    <>
      <PageHeading
        heading={`Đơn hàng ${order.order_code}`}
        handleDownloadPdf={handleDownloadPdf}
        pdfViewDocument={<PDFInvoiceDetailDocument order={order!} />}
        hasCsvDownload={false}
      >
        <Link to={`${path.orderDashBoard}/send-mail/${order._id}`}>
          <Button type='button' className='w-full space-x-2 bg-green-500 text-foreground hover:text-primary-foreground'>
            <Send className='size-5' />
            <span>Gửi mail</span>
          </Button>
        </Link>
        <Link to={path.orderDashBoard}>
          <Button variant='outline' className='w-full space-x-2 bg-blue-500'>
            <List />
            <span>Quản lý đơn hàng</span>
          </Button>
        </Link>
      </PageHeading>
      <Card className='flex items-center flex-wrap justify-between bg-accent p-6 space-y-4'>
        <CardHeader className='p-0'>
          <CardTitle className='leading-tight'>Mã đơn hàng: {order.order_code}</CardTitle>
          <CardDescription>
            Đơn hàng được đặt vào: {format(order.date_of_order, 'dd/MM/yyyy', { locale: vi })}
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <Form {...form}>
            <form onSubmit={onSubmit} className='flex justify-start items-end flex-wrap gap-4'>
              <div className='flex items-center flex-wrap gap-4'>
                <FormField
                  control={form.control}
                  name='order_status'
                  render={({ field }) => (
                    <FormItem className='grid gap-1'>
                      <FormLabel htmlFor='order_status'>Trạng thái đơn hàng</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              role='combobox'
                              className={cn(
                                'w-[200px] justify-between overflow-hidden bg-accent border-2 border-foreground hover:bg-background',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? orderStatusOptions.find((orderStatus) => orderStatus.value === field.value)?.label
                                : 'Hãy chọn trạng thái đơn hàng'}
                              <ArrowDownUp className='xs:block ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-[200px] p-0'>
                          <Command>
                            <CommandGroup>
                              {orderStatusOptions.map((orderStatus) => (
                                <CommandItem
                                  value={orderStatus.label}
                                  key={orderStatus.value}
                                  onSelect={() => {
                                    form.setValue('order_status', orderStatus.value)
                                  }}
                                >
                                  {orderStatus.label}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      orderStatus.value === field.value ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='payment_status'
                  render={({ field }) => (
                    <FormItem className='grid gap-1'>
                      <FormLabel htmlFor='order_status'>Trạng thái thanh toán</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              role='combobox'
                              className={cn(
                                'w-[200px] justify-between overflow-hidden bg-accent border-2 border-foreground hover:bg-background',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? paymentStatusOptions.find((paymentStatus) => paymentStatus.value === field.value)
                                    ?.label
                                : 'Hãy chọn trạng thái thanh toán'}
                              <ArrowDownUp className='xs:block ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-[200px] p-0'>
                          <Command>
                            <CommandGroup>
                              {paymentStatusOptions.map((paymentStatus) => (
                                <CommandItem
                                  value={paymentStatus.label}
                                  key={paymentStatus.value}
                                  onSelect={() => {
                                    form.setValue('payment_status', paymentStatus.value)
                                  }}
                                >
                                  {paymentStatus.label}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      paymentStatus.value === field.value ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid gap-1 space-y-2'>
                  <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    Trạng thái vận chuyển
                  </span>
                  <Button
                    type='button'
                    variant='outline'
                    className='w-[200px] justify-between overflow-hidden bg-accent border-2 border-foreground hover:bg-background'
                    onClick={() => setShippingStatusDialogOpen(true)}
                  >
                    {deliveryStatusOptions.find((option) => order.delivery_status.includes(option.value))?.label}
                    <Truck className='xs:block ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </div>
              </div>
              <Button type='submit' className='w-full sm:w-36' disabled={isLoading}>
                Lưu lại
                {isLoading ? <Loader className='animate-spin w-4 h-4 ml-2' /> : null}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <Card className='bg-accent'>
          <CardHeader>
            <CardTitle>Khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid divide-y-2 divide-foreground'>
              <div className='flex items-center justify-between space-x-4 py-3'>
                <h3 className='font-semibold'>Họ và tên</h3>
                <div className='flex items-center space-x-3'>
                  <div className='size-10 shrink-0 overflow-hidden rounded-full flex'>
                    <img
                      src={getAvatarUrl(order.order_by.user_avatar)}
                      alt='user avatar'
                      className='aspect-square size-full'
                    />
                  </div>
                  <p className='text-sm font-medium'>{order.order_by.user_name}</p>
                </div>
              </div>
              <div className='flex items-center justify-between space-x-4 py-3'>
                <h3 className='font-semibold'>Email</h3>
                <p className='text-sm font-medium'>{order.order_by.user_email}</p>
              </div>
              <div className='flex items-center justify-between space-x-4 py-3'>
                <h3 className='font-semibold'>Điện thoại</h3>
                <p className='text-sm font-medium'>{order.order_by.user_phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-accent'>
          <CardHeader>
            <CardTitle>Tóm tắt đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid divide-y-2 divide-foreground'>
              <div className='flex items-center justify-between space-x-4 py-3'>
                <h3 className='font-semibold'>Ngày đặt</h3>
                <p className='text-sm font-medium'>{format(order.date_of_order, 'dd/MM/yyyy', { locale: vi })}</p>
              </div>
              <div className='flex items-center justify-between space-x-4 py-3'>
                <h3 className='font-semibold'>Phương thức thanh toán</h3>
                <p className='text-sm font-medium'>{order.payment_method}</p>
              </div>
              <div className='flex items-center justify-between space-x-4 py-3'>
                <h3 className='font-semibold'>Tình trạng thanh toán</h3>
                <p className='text-sm font-medium'>{order.payment_status}</p>
              </div>
              <div className='flex items-center justify-between space-x-4 py-3'>
                <h3 className='font-semibold'>Ghi chú</h3>
                <p className='text-sm font-medium'>{order.order_note}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-accent'>
          <CardHeader>
            <CardTitle>Giao hàng tới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid divide-y-2 divide-foreground'>
              <div className='flex items-center justify-between space-x-4 py-3'>
                <h3 className='font-semibold'>Địa chỉ</h3>
                <p className='text-sm font-medium'>{order.delivery_at}</p>
              </div>
              <div className='flex items-center justify-between space-x-4 py-3'>
                <h3 className='font-semibold'>Tình trạng vận chuyển</h3>
                <p className='text-sm font-medium'>{order.delivery_status}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-accent md:col-span-2'>
          <CardHeader>
            <CardTitle>Sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Danh sách sản phẩm trong đơn hàng.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'>Sản phẩm</TableHead>
                  <TableHead>Đơn giá</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead className='text-right'>Tổng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className='font-medium'>
                      <div className='flex space-x-4'>
                        <div className='size-20 shrink-0 overflow-hidden rounded-md flex'>
                          <img src={product.product_thumb} alt='product thumb' className='aspect-square size-full' />
                        </div>
                        <p className='text-sm font-medium'>{product.product_name}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(product.product_price)}đ</TableCell>
                    <TableCell>{product.buy_count} sản phẩm</TableCell>
                    <TableCell className='text-right'>
                      {formatCurrency(product.buy_count * product.product_price)}đ
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className='bg-accent col-span-1 md:col-span-2 lg:col-span-1 h-fit'>
          <CardHeader>
            <CardTitle>Tổng đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid divide-y-2 divide-foreground'>
              <div className='flex items-center justify-between space-x-4 py-3'>
                <h3 className='font-semibold'>Tổng phụ</h3>
                <p className='text-sm font-medium'>{formatCurrency(order.total_amount)}đ</p>
              </div>
              <div className='flex items-center justify-between space-x-4 py-3'>
                <h3 className='font-semibold'>Phí vận chuyển</h3>
                <p className='text-sm font-medium'>0.00đ</p>
              </div>
              <div className='flex items-center justify-between space-x-4 py-3'>
                <h3 className='font-semibold'>Tổng cộng</h3>
                <p className='text-sm font-medium'>{formatCurrency(order.total_amount)}đ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <ShippingStatusDialog
        open={shippingStatusDialogOpen}
        onOpenChange={setShippingStatusDialogOpen}
        order={order}
        handleRefetchOrder={handleRefetchOrder}
      />
    </>
  )
}
