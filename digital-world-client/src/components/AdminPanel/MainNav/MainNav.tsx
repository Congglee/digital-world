import { Gauge, Menu, Receipt, Settings, ShoppingBag, Star, UserRound } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import { DialogClose } from 'src/components/ui/dialog'
import { Sheet, SheetContent, SheetTrigger } from 'src/components/ui/sheet'
import path from 'src/constants/path'
import { cn } from 'src/utils/utils'
import Search from '../Search'
import { Brand, Category, Website } from 'src/utils/icons'
import { useHorizontalScroll } from 'src/hooks/useSideScroll'

interface MenuNavProps extends React.HTMLAttributes<HTMLElement> {
  className: string
  horizontalScroll?: boolean
}

const NavMenus = [
  {
    path: path.home,
    label: 'Website',
    icon: <Website className='w-5 h-5' />
  },
  {
    path: path.dashboard,
    label: 'Trang chủ',
    icon: <Gauge className='w-5 h-5' />
  },
  {
    path: path.categoryDashboard,
    label: 'Danh mục',
    icon: <Category className='w-5 h-5' />
  },
  {
    path: path.brandDashBoard,
    label: 'Thương hiệu',
    icon: <Brand className='w-5 h-5' />
  },
  {
    path: path.productsDashboard,
    label: 'Sản phẩm',
    icon: <ShoppingBag className='w-5 h-5' />,
    children: [path.addProduct, path.updateProduct]
  },
  {
    path: path.ratingDashboard,
    label: 'Đánh giá',
    icon: <Star className='w-5 h-5' />,
    children: [path.detailRatingDashboard]
  },
  {
    path: path.userDashBoard,
    label: 'Tài khoản',
    icon: <UserRound className='w-5 h-5' />
  },
  {
    path: path.orderDashBoard,
    label: 'Đơn hàng',
    icon: <Receipt className='w-5 h-5' />,
    children: [path.updateUserOrder, path.sendMailOrder]
  },
  {
    path: '/examples/dashboard',
    label: 'Cài đặt',
    icon: <Settings />
  }
]

function MenuNav({ className, horizontalScroll = false, ...props }: MenuNavProps) {
  const scrollRef = useHorizontalScroll()
  const { pathname } = useLocation()

  return (
    <nav
      className={cn('hidden md:flex items-center overflow-auto', horizontalScroll && 'scroll', className)}
      {...props}
      ref={scrollRef}
    >
      {NavMenus.map((menu, idx) => (
        <Button asChild variant='ghost' key={idx}>
          <NavLink to={menu.path} end={!menu.children}>
            {({ isActive }) => (
              <div
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary flex items-center gap-2',
                  isActive || (menu.children && menu.children.some((childPath) => pathname.includes(childPath)))
                    ? null
                    : 'text-muted-foreground'
                )}
              >
                {menu.icon}
                <span>{menu.label}</span>
              </div>
            )}
          </NavLink>
        </Button>
      ))}
    </nav>
  )
}

function MainNavDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          className='border border-input hover:bg-accent hover:text-accent-foreground block md:hidden'
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='text-primary'>
        <MenuNav className='flex flex-col items-start mb-5' />
        <Search />
        <div className='flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-5'>
          <DialogClose className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'>
            Close
          </DialogClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function MainNav() {
  return (
    <>
      <MenuNav className='lg:mx-4' horizontalScroll={true} />
      <MainNavDrawer />
    </>
  )
}
