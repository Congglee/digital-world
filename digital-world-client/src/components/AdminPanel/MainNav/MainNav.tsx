import { NavLink } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import path from 'src/constants/path'
import { cn } from 'src/utils/utils'

export default function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn('flex items-center', className)} {...props}>
      <Button asChild variant='ghost'>
        <NavLink to={path.dashboard} end>
          {({ isActive }) => (
            <span
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                !isActive ? 'text-muted-foreground' : null
              )}
            >
              Trang chủ
            </span>
          )}
        </NavLink>
      </Button>
      <Button asChild variant='ghost'>
        <NavLink to={path.categoryDashboard} end>
          {({ isActive }) => (
            <span
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                !isActive ? 'text-muted-foreground' : null
              )}
            >
              Danh mục
            </span>
          )}
        </NavLink>
      </Button>
      <Button asChild variant='ghost'>
        <NavLink to={path.productsDashboard} end>
          {({ isActive }) => (
            <span
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                !isActive ? 'text-muted-foreground' : null
              )}
            >
              Thương hiệu
            </span>
          )}
        </NavLink>
      </Button>
      <Button asChild variant='ghost'>
        <NavLink to={path.productsDashboard} end>
          {({ isActive }) => (
            <span
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                !isActive ? 'text-muted-foreground' : null
              )}
            >
              Sản phẩm
            </span>
          )}
        </NavLink>
      </Button>
      <Button asChild variant='ghost'>
        <NavLink to={path.userDashBoard} end>
          {({ isActive }) => (
            <span
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                !isActive ? 'text-muted-foreground' : null
              )}
            >
              Tài khoản
            </span>
          )}
        </NavLink>
      </Button>
      <Button asChild variant='ghost'>
        <NavLink to='/examples/dashboard' end>
          {({ isActive }) => (
            <span
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                !isActive ? 'text-muted-foreground' : null
              )}
            >
              Cài đặt
            </span>
          )}
        </NavLink>
      </Button>
    </nav>
  )
}
