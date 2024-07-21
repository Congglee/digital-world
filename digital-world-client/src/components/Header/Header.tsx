import { AlignJustify, Banknote, ChevronDown, PhoneCall, Search, ShoppingCart, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, createSearchParams } from 'react-router-dom'
import logo from 'src/assets/images/logo.png'
import path from 'src/constants/path'
import { TriangleDown } from 'src/components/Icons/Icons'
import { cn } from 'src/utils/utils'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import Popover from '../Popover'
import { useLogoutMutation } from 'src/redux/apis/auth.api'
import { setAuthenticated, setProfile } from 'src/redux/slices/auth.slice'
import { allowedRoles } from 'src/static/data'
import useSearchProducts from 'src/hooks/useSearchProducts'
import { User as UserType } from 'src/types/user.type'
import { useGetMeQuery } from 'src/redux/apis/user.api'
import { useGetAllCategoriesQuery } from 'src/redux/apis/category.api'
import { Category } from 'src/types/category.type'
import useQueryConfig from 'src/hooks/useQueryConfig'
import MenuDrawer from 'src/components/MenuDrawer'

function DesktopTopHeader({
  handleLogout,
  isAuthenticated,
  profile
}: {
  handleLogout: () => Promise<void>
  isAuthenticated: boolean
  profile: UserType | null
}) {
  const isAllowedRole = profile && profile.roles.some((role: string) => allowedRoles.includes(role))

  return (
    <div className='bg-[#f0f0f0] text-[#505050] h-9 hidden md:block'>
      <div className='container flex flex-col justify-center h-full'>
        <div className='flex items-center justify-between text-xs'>
          <div className='flex items-center gap-[10px]'>
            <div>
              <span>Chào mừng đến với cửa hàng của chúng tôi!</span>
            </div>
            <div className='flex gap-1 cursor-pointer'>
              <Banknote size={18} />
              <span>VND</span>
              <ChevronDown size={16} />
            </div>
          </div>
          <div className='flex items-center'>
            {isAuthenticated && (
              <Popover
                className='flex items-center py-1 hover:text-gray-300 cursor-pointer ml-6 px-[10px]'
                renderPopover={
                  <div className='bg-white text-sm relative shadow-md rounded-md border border-gray-200'>
                    {isAllowedRole && (
                      <Link
                        to={path.dashboard}
                        className='block py-3 px-4 hover:bg-slate-100 hover:text-cyan-500 w-full text-left'
                      >
                        Quản lý website
                      </Link>
                    )}
                    <Link
                      to={path.profile}
                      className='block py-3 px-4 hover:bg-slate-100 hover:text-cyan-500 w-full text-left'
                    >
                      Tài khoản của tôi
                    </Link>
                    <Link
                      to={path.historyOrder}
                      className='block py-3 px-4 hover:bg-slate-100 hover:text-cyan-500 w-full text-left'
                    >
                      Đơn mua
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='block py-3 px-4 hover:bg-slate-100 hover:text-cyan-500 w-full text-left'
                    >
                      Đăng xuất
                    </button>
                  </div>
                }
              >
                <div className='text-white size-6 rounded-full bg-purple mr-2 flex-shrink-0 flex items-center justify-center overflow-hidden'>
                  {profile?.avatar ? (
                    <img src={profile?.avatar} alt='avatar' className='aspect-square w-full h-full' />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div>{profile?.email}</div>
              </Popover>
            )}
            {!isAuthenticated && (
              <>
                <Link to={path.login} className='px-[10px]'>
                  Tài khoản
                </Link>
              </>
            )}
            <Link to={isAuthenticated ? path.wishlist : path.login} className='px-[10px]'>
              Sản phẩm yêu thích
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function MegaMenu({
  wrapperClass,
  innerClass,
  categories
}: {
  wrapperClass?: string
  innerClass?: string
  categories: Category[]
}) {
  const [activeDropdownMenu, setActiveDropdownMenu] = useState(false)
  useEffect(() => {
    window.setTimeout(() => {
      if (window.innerWidth > 992) {
        setActiveDropdownMenu(true)
      }
    }, 1000)
  })
  const queryConfig = useQueryConfig()

  return (
    <div className={wrapperClass}>
      <nav className={innerClass}>
        <div className='py-4 group'>
          <Link
            to={path.home}
            className='pr-[15px] text-[#2b3743] uppercase flex items-center gap-1 text-sm hover:text-purple'
          >
            Trang chủ
          </Link>
        </div>
        <div className='py-4 group'>
          <Link
            to={path.products}
            className='px-[15px] text-[#2b3743] uppercase flex items-center gap-1 text-sm hover:text-purple'
          >
            Sản phẩm
            <TriangleDown />
          </Link>
          {activeDropdownMenu && (
            <DropdownMenu fullWidth={true} hasPromo={true}>
              <div className='flex flex-col'>
                <ul className='text-[#505050] font-Poppins'>
                  <li className='mb-5 uppercase font-semibold text-lg'>Laptop</li>
                  {categories
                    .filter((category) => category.is_actived)
                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                    .slice(0, 6)
                    .map((category) => (
                      <li className='mb-[10px]' key={category._id}>
                        <Link
                          to={{
                            pathname: path.products,
                            search: createSearchParams({
                              ...queryConfig,
                              category: category._id
                            }).toString()
                          }}
                          className='hover:text-purple text-sm'
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </DropdownMenu>
          )}
        </div>
        <div className='py-4 group'>
          <Link
            to={path.home}
            className='px-[15px] text-[#2b3743] uppercase flex items-center gap-1 text-sm hover:text-purple'
          >
            Trang
            <TriangleDown />
          </Link>
          {activeDropdownMenu && (
            <DropdownMenu columns={1}>
              <ul className='text-[#505050] font-Poppins'>
                <li className='mb-[10px]'>
                  <Link to='/' className='hover:text-purple text-sm'>
                    Giới thiệu
                  </Link>
                </li>
                <li className='mb-[10px]'>
                  <Link to='/' className='hover:text-purple text-sm'>
                    Dịch vụ
                  </Link>
                </li>
                <li className='mb-[10px]'>
                  <Link to='/' className='hover:text-purple text-sm'>
                    FAQs
                  </Link>
                </li>
                <li className='mb-[10px]'>
                  <Link to='/' className='hover:text-purple text-sm'>
                    Cửa hàng
                  </Link>
                </li>
              </ul>
            </DropdownMenu>
          )}
        </div>
        <div className='py-4 group'>
          <Link
            to={path.home}
            className='px-[15px] text-[#2b3743] uppercase flex items-center gap-1 text-sm hover:text-purple'
          >
            Dịch vụ
          </Link>
        </div>
        <div className='py-4 group'>
          <Link
            to={path.home}
            className='px-[15px] text-[#2b3743] uppercase flex items-center gap-1 text-sm hover:text-purple'
          >
            FAQS
          </Link>
        </div>
        <div className='py-4 group'>
          <Link
            to={path.home}
            className='px-[15px] text-[#2b3743] uppercase flex items-center gap-1 text-sm hover:text-purple'
          >
            Blog
          </Link>
        </div>
        <div className='py-4 group'>
          <Link
            to={path.home}
            className='px-[15px] text-[#2b3743] uppercase flex items-center gap-1 text-sm hover:text-purple'
          >
            Liên hệ
          </Link>
        </div>
      </nav>
    </div>
  )
}

function DropdownMenu({
  fullWidth = false,
  hasPromo = false,
  columns,
  children
}: {
  fullWidth?: boolean
  hasPromo?: boolean
  columns?: number
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'gap-10 py-[30px] absolute top-full bg-white z-30 text-black opacity-0 invisible transition-all duration-300 flex translate-y-10 group shadow-[0_2px_20px_#00000017]',
        'group-hover:opacity-100 group-hover:visible group-hover:translate-y-0',
        { 'left-4 right-4': fullWidth },
        { '-ml-8 max-w-[280px]': !fullWidth }
      )}
    >
      {hasPromo && <PromoSection />}
      <div className='flex flex-col px-12 gap-y-8 justify-between w-full'>
        <div
          className='grid gap-x-5 gap-y-6 col-span-2'
          style={{
            gridTemplateColumns: `repeat(${columns || 3}, minmax(0, 1fr)`
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function PromoSection() {
  return (
    <div className='flex flex-col gap-y-3 max-w-[25%] px-10'>
      <Link to='/'>
        <img src='https://cdn.shopify.com/s/files/1/1636/8779/articles/blog4_345x.jpg' alt='promo' />
      </Link>
      <p className='text-sm'>
        Lorem ipsum dolor sit amet, quod fabellas hendrerit per eu, mea populo epicuri et, ea possim numquam mea.
      </p>
    </div>
  )
}

function DesktopHeader({ productsInCart }: { productsInCart: number }) {
  const { onSubmitSearch, register } = useSearchProducts()

  return (
    <div className='hidden md:flex items-start justify-between text-sm'>
      <div className='flex items-center gap-[15px]'>
        <PhoneCall />
        <div>
          <div className='uppercase font-Poppins'>HỖ TRỢ: (+001) 1234567XXXX</div>
          <div className='text-xs opacity-60'>Thứ Hai - Thứ Bảy: 9:00AM - 5:00PM</div>
        </div>
      </div>
      <div className='w-1/5'>
        <Link to={path.home}>
          <img src={logo} alt='logo' className='max-w-[80%]' />
        </Link>
      </div>
      <div className='flex items-center flex-col-reverse lg:flex-row gap-5'>
        <div>
          <form className='relative h-10 bg-white' onSubmit={onSubmitSearch}>
            <input
              type='search'
              placeholder='Tìm kiếm...'
              className='border-2 border-purple py-2 pl-[10px] pr-10 bg-white  w-full h-10 outline-none'
              {...register('search_text')}
            />
            <span className='absolute top-0 right-0'>
              <button className='bg-purple text-white w-10 h-10 flex items-center justify-center'>
                <Search size={20} strokeWidth={3} />
              </button>
            </span>
          </form>
        </div>
        <div>
          <Link to={path.cart} className='flex items-center gap-2'>
            <div className='bg-purple text-white w-10 h-10 rounded-full flex items-center justify-center'>
              <ShoppingCart strokeWidth={3} size={24} />
            </div>
            <div className='flex flex-col'>
              <span className='uppercase font-bold'>Giỏ hàng</span>
              <span className='opacity-50 text-xs'>{productsInCart} sản phẩm</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

function MobileHeader({
  setActive,
  productsInCart
}: {
  setActive: React.Dispatch<React.SetStateAction<boolean>>
  productsInCart: number
}) {
  return (
    <div className='flex items-center sticky z-30 top-0 justify-between leading-none md:hidden gap-4 w-full h-16'>
      <div>
        <button className='flex items-center justify-center w-8 h-8' onClick={() => setActive(true)}>
          <AlignJustify className='w-8 h-8' />
        </button>
      </div>
      <Link to={path.home} className='flex items-center justify-center flex-grow w-full h-full'>
        <img src={logo} alt='logo' />
      </Link>
      <div>
        <Link to={path.cart} className='relative'>
          <ShoppingCart strokeWidth={3} fill='black' />
          <div className='bg-red-500 absolute -top-1 -right-[6px] text-white text-[10px] font-medium flex items-center justify-center rounded-full w-4 h-4 overflow-hidden'>
            <span>{productsInCart}</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default function Header() {
  const [active, setActive] = useState(false)
  const dispatch = useAppDispatch()
  const [logout, { isSuccess }] = useLogoutMutation()
  const { isAuthenticated, profile } = useAppSelector((state) => state.auth)
  const { data: profileData } = useGetMeQuery(undefined, { skip: !isAuthenticated })
  const { data: categoriesData } = useGetAllCategoriesQuery()
  const userProfile = profileData?.data.data

  const handleLogout = async () => {
    await logout()
  }

  useEffect(() => {
    if (isSuccess) {
      dispatch(setProfile(null))
      dispatch(setAuthenticated(false))
      localStorage.removeItem('checkout-profile')
      localStorage.removeItem('checkout-purchases-cart')
    }
  }, [isSuccess])

  return (
    <header>
      <DesktopTopHeader handleLogout={handleLogout} isAuthenticated={isAuthenticated} profile={profile} />
      <div className='md:py-10 text-[#505050]'>
        <div className='container'>
          <MenuDrawer
            isAuthenticated={isAuthenticated}
            active={active}
            setActive={setActive}
            handleLogout={handleLogout}
          />
          <DesktopHeader productsInCart={userProfile?.cart.length || 0} />
          <MobileHeader setActive={setActive} productsInCart={userProfile?.cart.length || 0} />
        </div>
      </div>
      <MegaMenu
        wrapperClass='hidden md:block container relative'
        innerClass='flex items-center border-t-2 border-t-purple shadow-[0_0_5px_#0003] px-5'
        categories={categoriesData?.data.categories || []}
      />
    </header>
  )
}
