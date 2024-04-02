import { Gauge, Menu, Receipt, Settings, ShoppingBag, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import { DialogClose } from 'src/components/ui/dialog'
import { Sheet, SheetContent, SheetTrigger } from 'src/components/ui/sheet'
import path from 'src/constants/path'
import { cn } from 'src/utils/utils'
import Search from '../Search'
import { Brand, Category, Website } from 'src/utils/icons'
import { useHorizontalScroll } from 'src/hooks/useSideScroll'

interface SideMenuProps extends React.HTMLAttributes<HTMLElement> {
  className: string
  horizontalScroll?: boolean
}

function SideMenu({ className, horizontalScroll = false, ...props }: SideMenuProps) {
  const scrollRef = useHorizontalScroll()

  return (
    <nav
      className={cn('hidden md:flex items-center overflow-auto', horizontalScroll && 'scroll', className)}
      {...props}
      ref={scrollRef}
    >
      <Button asChild variant='ghost'>
        <NavLink to={path.home} end>
          {({ isActive }) => (
            <div
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary flex items-center gap-2',
                !isActive ? 'text-muted-foreground' : null
              )}
            >
              <Website className='w-5 h-5' />
              <span>Website</span>
            </div>
          )}
        </NavLink>
      </Button>
      <Button asChild variant='ghost'>
        <NavLink to={path.dashboard} end>
          {({ isActive }) => (
            <div
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary flex items-center gap-2',
                !isActive ? 'text-muted-foreground' : null
              )}
            >
              <Gauge className='w-5 h-5' />
              <span>Trang chủ</span>
            </div>
          )}
        </NavLink>
      </Button>
      <Button asChild variant='ghost'>
        <NavLink to={path.categoryDashboard} end>
          {({ isActive }) => (
            <div
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary flex items-center gap-2',
                !isActive ? 'text-muted-foreground' : null
              )}
            >
              <Category className='w-5 h-5' />
              <span>Danh mục</span>
            </div>
          )}
        </NavLink>
      </Button>
      <Button asChild variant='ghost'>
        <NavLink to={path.brandDashBoard} end>
          {({ isActive }) => (
            <div
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary flex items-center gap-2',
                !isActive ? 'text-muted-foreground' : null
              )}
            >
              <Brand className='w-5 h-5' />
              <span>Thương hiệu</span>
            </div>
          )}
        </NavLink>
      </Button>
      <Button asChild variant='ghost'>
        <NavLink to={path.productsDashboard} end>
          {({ isActive }) => (
            <div
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary flex items-center gap-2',
                !isActive ? 'text-muted-foreground' : null
              )}
            >
              <ShoppingBag className='w-5 h-5' />
              <span>Sản phẩm</span>
            </div>
          )}
        </NavLink>
      </Button>
      <Button asChild variant='ghost'>
        <NavLink to={path.userDashBoard} end>
          {({ isActive }) => (
            <div
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary flex items-center gap-2',
                !isActive ? 'text-muted-foreground' : null
              )}
            >
              <UserRound className='w-5 h-5' />
              <span>Tài khoản</span>
            </div>
          )}
        </NavLink>
      </Button>
      <Button asChild variant='ghost'>
        <NavLink to={path.orderDashBoard} end>
          {({ isActive }) => (
            <div
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary flex items-center gap-2',
                !isActive ? 'text-muted-foreground' : null
              )}
            >
              <Receipt className='w-5 h-5' />
              <span>Đơn hàng</span>
            </div>
          )}
        </NavLink>
      </Button>
      <Button asChild variant='ghost'>
        <NavLink to='/examples/dashboard' end>
          {({ isActive }) => (
            <div
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary flex items-center gap-2',
                !isActive ? 'text-muted-foreground' : null
              )}
            >
              <Settings />
              <span>Cài đặt</span>
            </div>
          )}
        </NavLink>
      </Button>
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
        <SideMenu className='flex flex-col items-start mb-5' />
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
      <SideMenu className='lg:mx-4' horizontalScroll={true} />
      <MainNavDrawer />
    </>
  )
}
