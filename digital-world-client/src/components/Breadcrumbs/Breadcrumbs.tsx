import { Fragment } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import path from 'src/constants/path'

function translatePathname(pathname: string, tokenPathName?: string) {
  switch (pathname) {
    case 'home':
      return 'Trang chủ'
    case 'login':
      return 'Đăng nhập'
    case 'register':
      return 'Đăng ký'
    case 'forgot-password':
      return 'Quên mật khẩu'
    case 'reset-password':
      return 'Đổi mật khẩu'
    case tokenPathName:
      return ''
    case `reset-password/${tokenPathName}`:
      return 'Đổi mật khẩu'
    default:
      return pathname
  }
}

export default function Breadcrumbs() {
  const location = useLocation()
  const { token } = useParams()

  let currentLink = ''
  const crumbs = location.pathname
    .split('/')
    .filter((crumb) => crumb !== '')
    .map((crumb) => {
      currentLink += `/${crumb}`
      const translatedCrumb = token ? translatePathname(crumb, token) : translatePathname(crumb)
      return (
        <Fragment key={crumb}>
          {crumb !== token && <span>›</span>}
          <Link to={currentLink} className='capitalize text-[#1c1d1d] text-sm'>
            {translatedCrumb}
          </Link>
        </Fragment>
      )
    })

  if (crumbs.length === 0 || crumbs[0].key !== 'home') {
    crumbs.unshift(
      <Fragment key='home'>
        <Link to={path.home} className='capitalize text-[#1c1d1d] text-sm'>
          Trang chủ
        </Link>
      </Fragment>
    )
  }

  return (
    <div className='py-[15px] bg-[#f7f7f7]'>
      <div className='container'>
        <h3 className='uppercase text-[#151515] mb-2 font-bold text-lg'>
          {translatePathname(currentLink.replace('/', ''), token)}
        </h3>
        <nav className='flex items-center gap-1'>{crumbs}</nav>
      </div>
    </div>
  )
}
