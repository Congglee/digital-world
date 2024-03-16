import { AlignJustify } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from 'src/components/ui/sheet'
import path from 'src/constants/path'
import { cn } from 'src/utils/utils'

function MainNavDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' className='block md:hidden'>
          <AlignJustify />
        </Button>
      </SheetTrigger>
      <SheetContent side='left'>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
        </SheetHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input id='name' value='Pedro Duarte' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Username
            </Label>
            <Input id='username' value='@peduarte' className='col-span-3' />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type='submit'>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <>
      <nav className={cn('hidden md:flex items-center overflow-x-auto', className)} {...props}>
        <Button asChild variant='ghost'>
          <NavLink to={path.dashboard} className='' end>
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
          <NavLink to={path.brandDashBoard} end>
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
      <MainNavDrawer />
    </>
  )
}
