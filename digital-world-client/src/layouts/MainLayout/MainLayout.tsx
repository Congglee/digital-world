import { Outlet } from 'react-router-dom'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'

export default function MainLayout() {
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
      <div className='bg-white'>
        <Header />
        <Outlet />
        <Footer />
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
