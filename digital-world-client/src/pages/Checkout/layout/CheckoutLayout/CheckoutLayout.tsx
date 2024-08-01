import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import logo from 'src/assets/images/logo.png'
import { CreditCard, MasterCard, Paypal, ShoppingBag, Visa } from 'src/components/Icons/Icons'
import path from 'src/constants/path'

export default function CheckoutLayout() {
  const location = useLocation()
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
            <span>Thanh toán {location.pathname === path.checkoutSuccess && 'thành công'}</span>
          </div>
          <Outlet />
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
