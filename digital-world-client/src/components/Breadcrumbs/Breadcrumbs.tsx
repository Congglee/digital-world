import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import path from 'src/constants/path'

function translatePathname(pathname: string) {
  switch (pathname) {
    case 'home':
      return 'Trang chủ'
    case 'login':
      return 'Đăng nhập'
    default:
      return pathname
  }
}

export default function Breadcrumbs() {
  const location = useLocation()

  let currentLink = ''
  const crumbs = location.pathname
    .split('/')
    .filter((crumb) => crumb !== '')
    .map((crumb) => {
      currentLink += `/${crumb}`
      const translatedCrumb = translatePathname(crumb)
      return (
        <Fragment key={crumb}>
          <span>›</span>
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
          {translatePathname(currentLink.replace('/', ''))}
        </h3>
        <nav className='flex items-center gap-1'>{crumbs}</nav>
      </div>
    </div>
  )
}
