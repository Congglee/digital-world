import { Outlet } from 'react-router-dom'
import MainNav from 'src/components/AdminPanel/MainNav'
import Search from 'src/components/AdminPanel/Search'
import UserNav from 'src/components/AdminPanel/UserNav'
import { ToastContainer } from 'react-toastify'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-toastify/dist/ReactToastify.css'

export default function DashboardLayout() {
  return (
    <>
      <div className='flex-col md:flex text-foreground'>
        <div className='border-b'>
          <div className='flex h-16 items-center px-4'>
            <MainNav />
            <div className='ml-auto flex items-center space-x-4'>
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className='flex-1 lg:px-20 space-y-4 p-10 pt-6'>
          <Outlet />
        </div>
      </div>
      <ToastContainer
        position='bottom-right'
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
