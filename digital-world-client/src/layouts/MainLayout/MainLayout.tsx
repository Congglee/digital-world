import { Outlet } from 'react-router-dom'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function MainLayout() {
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
