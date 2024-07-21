import { LogOut, UserRound } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Order } from 'src/components/Icons/Icons'
import path from 'src/constants/path'
import { cn } from 'src/utils/utils'

export default function UserSideNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const userSideNavOpen = pathname === path.profile || pathname === path.changePassword
  const [open, setOpen] = useState(userSideNavOpen)

  return (
    <nav>
      <ul className='border border-[#ebebeb] divide-y divide-[#ebebeb] rounded-sm'>
        <li>
          <button
            className={cn(
              'py-[10px] px-[15px] hover:bg-[#ebebeb] transition-colors duration-300 ease-in-out relative cursor-pointer w-full',
              userSideNavOpen ? 'bg-[#ebebeb]' : ''
            )}
            onClick={() => {
              navigate(path.profile)
              setOpen(true)
            }}
          >
            <NavLink to={path.profile} className='flex items-center gap-[5px] hover:text-purple capitalize'>
              <UserRound className='size-4' />
              Tài khoản của tôi
            </NavLink>
            <div
              className={cn(
                'space-y-3 h-0 opacity-0 overflow-hidden [transition:height_.4s_cubic-bezier(0.4,_0,_0.2,_1),_opacity_.4s_cubic-bezier(.4,0,.2,1)]',
                open && 'h-auto opacity-100 mt-3'
              )}
            >
              <div className='pl-5'>
                <NavLink
                  to={path.profile}
                  className={({ isActive }) =>
                    cn('flex items-center gap-[5px] hover:text-purple capitalize', isActive && 'text-purple')
                  }
                >
                  Hồ sơ
                </NavLink>
              </div>
              <div className='pl-5'>
                <NavLink
                  to={path.changePassword}
                  className={({ isActive }) =>
                    cn('flex items-center gap-[5px] hover:text-purple capitalize', isActive && 'text-purple')
                  }
                >
                  Đổi mật khẩu
                </NavLink>
              </div>
            </div>
          </button>
        </li>
        <li>
          <NavLink
            to={path.historyOrder}
            className={({ isActive }) =>
              cn(
                'py-[10px] px-[15px] flex items-center hover:bg-[#ebebeb] hover:text-purple gap-[5px] transition-colors duration-300 ease-in-out capitalize',
                isActive && 'bg-[#ebebeb] text-purple'
              )
            }
            onClick={() => setOpen(false)}
          >
            <Order className='size-4' />
            Đơn mua
          </NavLink>
        </li>
        <li>
          <button
            className={cn(
              'w-full py-[10px] px-[15px] flex items-center hover:bg-[#ebebeb] gap-[5px] transition-colors duration-300 ease-in-out capitalize'
            )}
          >
            <LogOut className='size-4' />
            Đăng xuất
          </button>
        </li>
      </ul>
    </nav>
  )
}
