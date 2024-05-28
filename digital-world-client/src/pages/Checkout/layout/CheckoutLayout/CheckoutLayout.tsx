import { Link, Outlet } from 'react-router-dom'
import path from 'src/constants/path'
import logo from 'src/assets/images/logo.png'
import { CreditCard, MasterCard, Paypal, ShoppingBag, Visa } from 'src/utils/icons'
import CheckoutSummary from 'src/pages/Checkout/components/CheckoutSummary'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronUp, ShoppingCart } from 'lucide-react'
import { cn } from 'src/utils/utils'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'

export default function CheckoutLayout() {
  useEffect(() => {
    const htmlElement = document.documentElement

    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark')
    }

    return () => {
      htmlElement.classList.add('dark')
    }
  }, [])

  return (
    <>
      <div className='overflow-x-hidden'>
        <div className='py-5 border border-[#dedede]'>
          <div className='container flex items-center justify-between'>
            <Link to={path.products} className='inline-block w-full max-w-[350px]'>
              <img src={logo} alt='logo' className='w-full h-full object-cover' />
            </Link>
            <Link to={path.cart}>
              <ShoppingBag className='w-6 h-6 text-[#2c6ecb]' />
            </Link>
          </div>
        </div>
        <main className='container'>
          <div className='py-5'>
            <span>
              <Link to={path.home} className='text-[#2c6ecb]'>
                Trang chủ
              </Link>
              <span> / </span>
            </span>
            <span>Thanh toán</span>
          </div>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className='flex md:hidden w-full justify-between rounded-lg bg-[#ebebeb] px-4 py-2 text-left text-sm font-medium text-[#2c6ecb]/80 hover:bg-[#ebebeb]/60 focus:outline-none focus-visible:ring focus-visible:ring-[#ebebeb]/75 mb-3'>
                  <div className='flex items-center gap-2'>
                    <ShoppingCart className='w-4 h-4' />
                    <span>Hiển thị tóm tắt đơn hàng</span>
                  </div>
                  <ChevronUp
                    className={cn('h-5 w-5 text-[#2c6ecb]/80 transition-transform', open && 'rotate-180 transform')}
                  />
                </Disclosure.Button>
                <Transition
                  show={open}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0 scale-95'
                  enterTo='opacity-100 scale-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100 scale-100'
                  leaveTo='opacity-0 scale-95'
                >
                  <Disclosure.Panel as='div' className='px-4 pb-2 pt-4 text-sm text-gray-500 bg-[#fafafa]'>
                    <CheckoutSummary />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
          <div className='grid md:grid-cols-2 gap-[30px] divide-x divide-[#e1e3e5]'>
            <div className='mb-5'>
              <Outlet />
            </div>
            <div className='hidden md:block pl-5 pt-[30px] pb-5 relative after:content-[""] after:absolute after:top-0 after:left-0 after:block after:w-[400%] after:bottom-0 after:bg-[#fafafa] after:-z-10'>
              <CheckoutSummary />
            </div>
          </div>
        </main>
        <footer className='bg-[#f6f6f6] border-t border-[#dddddd] py-[10px]'>
          <div className='container flex flex-col sm:flex-row gap-2 items-center justify-between'>
            <div className='flex items-center gap-3'>
              <CreditCard className='w-10 h-6' />
              <Visa className='w-10 h-6' />
              <MasterCard className='w-10 h-6' />
              <Paypal className='w-10 h-6' />
            </div>
            <div className='text-[13px] text-[#737373]'>
              <span>© 2024 Digital World. All Rights Reserved.</span>
            </div>
          </div>
        </footer>
      </div>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
        className='text-[15px]'
      />
    </>
  )
}
