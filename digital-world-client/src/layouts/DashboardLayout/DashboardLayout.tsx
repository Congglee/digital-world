import { Outlet } from 'react-router-dom'
import MainNav from 'src/components/AdminPanel/MainNav'
import Search from 'src/components/AdminPanel/Search'
import UserNav from 'src/components/AdminPanel/UserNav'

export default function DashboardLayout() {
  return (
    <>
      <div className='hidden flex-col md:flex text-white'>
        <div className='border-b'>
          <div className='flex h-16 items-center px-4'>
            <MainNav className='mx-6' />
            <div className='ml-auto flex items-center space-x-4'>
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className='flex-1 px-20 space-y-4 p-8 pt-6'>
          <Outlet />
        </div>
      </div>
    </>
  )
}
