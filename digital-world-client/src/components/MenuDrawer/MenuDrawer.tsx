import { Banknote, ChevronDown, LogIn, Search, UserPlus, X } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import { useClickOutsideListener } from 'src/hooks/useOutsideClick'
import { twMerge } from 'src/utils/utils'

interface MenuDrawerProps {
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MenuDrawer(props: MenuDrawerProps) {
  const { active, setActive } = props
  const menuDrawerRef = useRef<HTMLDivElement | null>(null)

  useClickOutsideListener(menuDrawerRef, () => {
    setActive(false)
  })

  return (
    <div
      className={twMerge(
        'md:hidden fixed top-0 bottom-0 left-0 bg-[#1c1d1d] px-[10px] w-3/5 z-50',
        { 'animate-drawer-up': active },
        { 'animate-drawer-down': !active }
      )}
      ref={menuDrawerRef}
    >
      <div className='py-4 text-right text-white border-b border-[#343535]'>
        <button onClick={() => setActive(false)}>
          <X />
        </button>
      </div>
      <ul>
        <li className='text-white uppercase py-3 border-b border-[#343535]'>
          <Link to={path.home}>Trang chủ</Link>
        </li>
        <li className='text-white uppercase py-3 border-b border-[#343535]'>
          <Link to={path.products}>Sản phẩm</Link>
        </li>
        <li className='text-white uppercase py-3 border-b border-[#343535]'>Blog</li>
        <li className='text-white uppercase py-3 border-b border-[#343535]'>Liên hệ</li>
      </ul>
      <div className='mb-5'>
        <Link to={path.login} className='flex items-center text-white py-3'>
          <LogIn size={20} />
          <span className='pl-2 uppercase'>Đăng nhập</span>
        </Link>
        <Link to={path.register} className='flex items-center text-white py-3'>
          <UserPlus size={20} />
          <span className='pl-2 uppercase'>Tạo tài khoản</span>
        </Link>
        <Link to='/profile' className='flex items-center text-white py-3'>
          <span className='uppercase'>Tài khoản</span>
        </Link>
        <button className='flex items-center text-white py-[10px]'>
          <span className='uppercase'>Đăng xuất</span>
        </button>
        <div className='flex gap-1 text-xs cursor-pointer'>
          <Banknote size={18} />
          <span>VND</span>
          <ChevronDown size={16} />
        </div>
      </div>
      <div>
        <form className='relative h-10 bg-white'>
          <input
            type='search'
            placeholder='Tìm kiếm...'
            className='border-2 border-purple py-2 pl-[10px] pr-10 bg-white  w-full h-10 outline-none'
          />
          <span className='absolute top-0 right-0'>
            <button className='bg-purple text-white w-10 h-10 flex items-center justify-center'>
              <Search size={20} strokeWidth={3} />
            </button>
          </span>
        </form>
      </div>
    </div>
  )
}
