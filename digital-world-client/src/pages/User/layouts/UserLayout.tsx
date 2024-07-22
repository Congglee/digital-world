import { Outlet, useLocation } from 'react-router-dom'
import Breadcrumbs from 'src/components/Breadcrumbs'
import path from 'src/constants/path'
import UserSideNav from 'src/pages/User/components/UserSideNav'

export default function UserLayout() {
  const { pathname } = useLocation()
  const currentPageName =
    pathname === path.profile
      ? 'Hồ sơ của tôi'
      : pathname === path.historyOrder
        ? 'Lịch sử mua hàng'
        : pathname === path.changePassword
          ? 'Đổi mật khẩu'
          : ''

  return (
    <>
      <Breadcrumbs currentPageName={currentPageName} />
      <div className='py-10 text-sm'>
        <div className='container'>
          <div className='grid grid-cols-1 gap-[30px] md:grid-cols-12'>
            <div className='md:col-span-3 lg:col-span-2'>
              <UserSideNav />
            </div>
            <div className='md:col-span-9 lg:col-span-10'>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
