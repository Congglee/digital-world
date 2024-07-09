import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from 'src/components/ui/dropdown-menu'
import { Button } from 'src/components/ui/button'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { useLogoutMutation } from 'src/redux/apis/auth.api'
import { useEffect } from 'react'
import { setAuthenticated, setProfile } from 'src/redux/slices/auth.slice'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import { config } from 'src/constants/config'

export default function UserNav() {
  const { profile } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const [logout, { isSuccess }] = useLogoutMutation()

  const handleLogout = async () => {
    await logout()
  }

  useEffect(() => {
    if (isSuccess) {
      dispatch(setProfile(null))
      dispatch(setAuthenticated(false))
    }
  }, [isSuccess])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={profile?.avatar ? profile.avatar : config.defaultUserImageUrl} alt={profile?.name} />
            <AvatarFallback>{profile?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 font-normal' align='end' forceMount>
        <DropdownMenuLabel>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{profile?.name}</p>
            <p className='text-xs leading-none text-muted-foreground'>{profile?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to={path.settingsProfile} className='flex items-center justify-between w-full cursor-pointer'>
              <span>Hồ sơ cá nhân</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={path.settingsDashboard} className='flex items-center justify-between w-full cursor-pointer'>
              <span>Cài đặt</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
          Đăng xuất
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
