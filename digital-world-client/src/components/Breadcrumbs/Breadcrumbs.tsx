import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import useBreadcrumbs from 'use-react-router-breadcrumbs'

interface BreadcrumbsProps {
  currentPageName?: string
}

export default function Breadcrumbs({ currentPageName }: BreadcrumbsProps) {
  const routes = [
    { path: path.home, breadcrumb: 'Trang chủ' },
    { path: path.products, breadcrumb: 'Sản phẩm' },
    { path: path.productDetail, breadcrumb: currentPageName },
    { path: path.login, breadcrumb: 'Đăng nhập' },
    { path: path.register, breadcrumb: 'Đăng ký' },
    { path: path.forgotPassword, breadcrumb: 'Quên mật khẩu' },
    { path: path.resetPassword, breadcrumb: 'Đổi mật khẩu' },
    { path: '/reset-password', breadcrumb: 'Đổi mật khẩu' },
    { path: path.cart, breadcrumb: 'Giỏ hàng' },
    { path: path.user, breadcrumb: 'Tài khoản' },
    { path: path.profile, breadcrumb: 'Hồ sơ' },
    { path: path.historyOrder, breadcrumb: 'Đơn mua' },
    { path: path.wishlist, breadcrumb: 'Danh sách yêu thích' }
  ]
  const breadcrumbs = useBreadcrumbs(routes)

  return (
    <div className='py-[15px] bg-[#f7f7f7]'>
      <div className='container'>
        <h3 className='uppercase text-[#151515] mb-2 font-bold text-lg'>{currentPageName}</h3>
        <nav className='flex flex-wrap items-center gap-1'>
          {breadcrumbs.map(({ match, breadcrumb }, index, self) => {
            const isDefaultUserRoute = match.pathname === path.user
            return (
              match.route?.path !== path.resetPassword && (
                <Fragment key={match.pathname}>
                  <Link
                    to={isDefaultUserRoute ? path.profile : match.pathname}
                    className='capitalize text-[#1c1d1d] text-sm'
                  >
                    {breadcrumb}
                  </Link>
                  {index !== self.length - 1 && <span>›</span>}
                </Fragment>
              )
            )
          })}
        </nav>
      </div>
    </div>
  )
}
