import { ChevronUpIcon, Circle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from 'src/components/Button'
import path from 'src/constants/path'
import CheckoutBreadcrumbs from 'src/pages/Checkout/components/CheckoutBreadcrumbs'
import { type FormData as CheckoutProfileType } from 'src/pages/Checkout/pages/CheckoutProfile/CheckoutProfile'
import { useAddOrderMutation } from 'src/redux/apis/order.api'
import { useGetAllPaymentMethodsQuery } from 'src/redux/apis/payment-method.api'
import { useGetMeQuery } from 'src/redux/apis/user.api'
import { CircleCheckBig } from 'src/components/Icons/Icons'
import { cn } from 'src/utils/utils'
import { useSendCommonMailMutation } from 'src/redux/apis/mail.api'
import { Order } from 'src/types/order.type'
import { generateOrderNotifyEmail } from 'src/utils/mail'

export default function CheckoutPayment() {
  const { data: profileData } = useGetMeQuery()
  const { data: paymentMethodData } = useGetAllPaymentMethodsQuery()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const profile = profileData?.data.data
  const checkoutProfile: CheckoutProfileType = JSON.parse(localStorage.getItem('checkout-profile')!)

  useEffect(() => {
    if (paymentMethodData && paymentMethodData.data.payment_methods.length > 0) {
      const initialPaymentMethod = paymentMethodData.data.payment_methods
        .filter((item) => item.is_actived)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0]
      setPaymentMethod(initialPaymentMethod.name)
    }
  }, [paymentMethodData])

  const [addOrder, { data, isSuccess }] = useAddOrderMutation()
  const [sendMail, sendMailResult] = useSendCommonMailMutation()

  const orderDeliveryAt = checkoutProfile
    ? `${checkoutProfile.delivery_at}, ${checkoutProfile.province}, ${checkoutProfile.district} ${checkoutProfile.ward && `, ${checkoutProfile.ward}`}`
    : ''

  const handleBuyPurchases = async () => {
    if (profile && profile.cart.length > 0) {
      const payloadData = {
        payment_method: paymentMethod,
        delivery_at: orderDeliveryAt,
        order_fullname: checkoutProfile.order_fullname,
        order_phone: checkoutProfile.order_phone,
        order_note: checkoutProfile.order_note,
        products: profile.cart.map((product) => ({
          _id: product.product._id,
          name: product.product.name,
          price: product.product.price,
          thumb: product.product.thumb,
          buy_count: product.buy_count
        }))
      }
      await addOrder(payloadData)
    }
  }

  useEffect(() => {
    const handleSendOrderNotifyMail = async (order: Order) => {
      const htmlContent = generateOrderNotifyEmail(order)
      await sendMail({
        email: order.order_by.user_email,
        subject: 'Thông báo: Đơn hàng của bạn đã được đặt thành công!',
        content: htmlContent
      })
    }

    if (isSuccess) {
      handleSendOrderNotifyMail(data?.data.data)
    }
  }, [isSuccess])

  useEffect(() => {
    if (sendMailResult.isSuccess) {
      toast.success(data?.data.message)
      navigate(path.checkoutSuccess.replace(':order_id', data?.data.data._id as string))
      localStorage.removeItem('checkout-profile')
    }
  }, [sendMailResult.isSuccess])

  if (!profile) return null

  if (!checkoutProfile) {
    navigate(path.checkoutProfile)
    return null
  }

  return (
    <div className='mt-1'>
      <CheckoutBreadcrumbs active='payment' />
      <div className='mt-1'>
        <div className='px-5 border border-[#e1e3e5] rounded-sm divide-y'>
          <div className='grid gap-1 xs:grid-cols-4 py-[10px]'>
            <div className='col-span-1'>
              <span>Liên hệ</span>
            </div>
            <div className='col-span-2'>
              <span>{profile.email}</span>
            </div>
            <div className='col-span-1 flex justify-end'></div>
          </div>
          <div className='grid gap-1 xs:grid-cols-4 py-[10px]'>
            <div className='col-span-1'>
              <span>Giao tới</span>
            </div>
            <div className='col-span-2'>{orderDeliveryAt}</div>
            <div className='col-span-1 xs:flex xs:justify-end'>
              <Link to={path.checkoutProfile} className='text-[#2c6ecb] hover:underline'>
                Sửa
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-[30px]'>
        <h4 className='mb-[10px] capitalize text-2xl'>Phương thức thanh toán</h4>
        <div className='w-full border border-[#e1e3e5] divide-y'>
          {paymentMethodData &&
            paymentMethodData.data.payment_methods
              .filter((paymentMethod) => paymentMethod.is_actived)
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              .map((item) => {
                const isOpen = paymentMethod === item.name
                return (
                  <div className='border-[#e1e3e5]' key={item._id}>
                    <button
                      className={cn(
                        'flex items-center justify-between w-full px-5 py-4 focus:outline-none focus-visible:ring focus-visible:ring-[#2c6ecb]/75',
                        isOpen && 'bg-[#2c6ecb]/20'
                      )}
                      onClick={() => {
                        setPaymentMethod(item.name)
                      }}
                    >
                      <div className='flex items-center gap-4'>
                        {isOpen ? (
                          <CircleCheckBig className='w-5 h-5 text-[#2c6ecb]' />
                        ) : (
                          <Circle className='w-5 h-5 text-gray-500' />
                        )}
                        {item.image && (
                          <img src={item.image} alt={item.name} className='aspect-square w-28 h-12 hidden xs:block' />
                        )}
                        <span className='text-sm font-medium text-[#3a3a3a]'>{item.name}</span>
                      </div>
                      {item.description && (
                        <ChevronUpIcon className={cn('h-5 w-5', isOpen && 'rotate-180 transform')} />
                      )}
                    </button>
                    {isOpen && item.description && (
                      <div className='p-5 pt-0 text-sm text-gray-500 bg-[#2c6ecb]/20'>
                        <div className='border border-gray-400 rounded p-3'>{item.description}</div>
                      </div>
                    )}
                  </div>
                )
              })}
        </div>
        <div className='flex justify-end mt-5'>
          <Button
            type='button'
            className='flex items-center justify-center gap-2 p-5 text-white bg-[#3a3a3a] shadow-[0_1px_0_rgba(0,_0,_0,_.05),_inset_0_-1px_0_rgba(0,_0,_0,_0.2)] hover:bg-purple transition-colors'
            onClick={handleBuyPurchases}
            disabled={sendMailResult.isLoading}
            isLoading={sendMailResult.isLoading}
          >
            Đặt Đơn
          </Button>
        </div>
      </div>
    </div>
  )
}
