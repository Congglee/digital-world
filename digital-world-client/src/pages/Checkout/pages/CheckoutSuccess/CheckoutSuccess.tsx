import { Check } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import path from 'src/constants/path'
import CheckoutSummary from 'src/pages/Checkout/components/CheckoutSummary'
import CheckoutSummaryDisclosure from 'src/pages/Checkout/components/CheckoutSummaryDisclosure'
import { useGetOrderByOrderCodeQuery } from 'src/redux/apis/order.api'

export default function CheckoutSuccess() {
  const { order_code } = useParams()
  const { data: orderData } = useGetOrderByOrderCodeQuery(order_code!)
  const order = orderData?.data.data

  if (!order) return null

  const checkoutPurchasesCart = order.products.map((product) => ({
    _id: product._id,
    price: product.product_price,
    buy_count: product.buy_count,
    product: product.product_id
  }))

  return (
    <>
      <CheckoutSummaryDisclosure checkoutPurchasesCart={checkoutPurchasesCart} />
      <div className='grid md:grid-cols-2 gap-[30px]'>
        <div className='py-10'>
          <div className='flex items-center gap-3'>
            <div className='border-2 border-[#2c6ecb] rounded-full p-[5px] text-[#2c6ecb]'>
              <Check className='w-[30px] h-[30px]' />
            </div>
            <div className='space-y-1'>
              <h3 className='text-2xl font-medium'>Cảm ơn {order.order_by.user_fullname}! 🎉</h3>
              <p className='text-[#3a3a3a]'>
                Quý khách có thể theo dõi đơn hàng tại trang{' '}
                <Link to={path.historyOrder} className='text-[#2c6ecb] underline'>
                  Đơn hàng của tôi
                </Link>{' '}
                hoặc qua email đã đăng ký.
              </p>
            </div>
          </div>
          <div className='mt-[30px] border border-[#e1e3e5] rounded-md p-5'>
            <h2 className='text-2xl font-medium'>Đơn hàng {order.order_code}</h2>
            <div className='grid sm:grid-cols-2 gap-[30px] mt-5'>
              <div className='grid gap-[30px] place-content-between'>
                <div className='flex flex-col'>
                  <h3 className='mb-2 text-xl'>Thông tin liên hệ</h3>
                  <span>{order.order_by.user_fullname}</span>
                  <span className='break-all'>{order.order_by.user_email}</span>
                </div>
                <div className='flex flex-col'>
                  <h3 className='mb-2 text-xl'>Địa chỉ giao hàng</h3>
                  <span>{order.shipping_address.address}</span>
                  <span>{order.shipping_address.province}</span>
                  <span>{order.shipping_address.district}</span>
                  <span>{order.shipping_address.ward}</span>
                </div>
              </div>
              <div className='grid gap-[30px] place-content-between'>
                <div className='flex flex-col'>
                  <h3 className='mb-2 text-xl'>Phương thức thanh toán</h3>
                  <span>{order.payment_method}</span>
                </div>
                <div className='flex flex-col'>
                  <h3 className='mb-2 text-xl'>Địa chỉ thanh toán</h3>
                  <span>{order.billing_address.address}</span>
                  <span>{order.billing_address.province}</span>
                  <span>{order.billing_address.district}</span>
                  <span>{order.billing_address.ward}</span>
                </div>
              </div>
            </div>
          </div>
          <Link
            to={path.historyOrder}
            type='submit'
            className='mt-6 p-5 text-white bg-[#3a3a3a] shadow-[0_1px_0_rgba(0,_0,_0,_.05),_inset_0_-1px_0_rgba(0,_0,_0,_0.2)] hover:bg-purple transition-colors uppercase'
          >
            Kiểm tra đơn hàng
          </Link>
        </div>
        <div className='hidden md:block pl-5 pt-[30px] pb-5 relative after:content-[""] after:absolute after:top-0 after:left-0 after:block after:w-[400%] after:bottom-0 after:bg-[#fafafa] after:-z-10 border-l border-[#e1e3e5]'>
          <CheckoutSummary checkoutPurchasesCart={checkoutPurchasesCart} />
        </div>
      </div>
    </>
  )
}
