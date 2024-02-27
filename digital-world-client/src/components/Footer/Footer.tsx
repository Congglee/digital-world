import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  AmericanExpress,
  Discover,
  Facebook,
  GooglePlus,
  Instagram,
  MasterCard,
  Paypal,
  Pinterest,
  Twitter,
  Visa
} from 'src/utils/icons'

function Newsletter() {
  return (
    <div className='bg-purple py-[25px]'>
      <div className='container flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='md:w-1/2'>
          <h3 className='uppercase text-xl text-white tracking-[2px]'>ĐĂNG KÝ ĐỂ NHẬN TIN MỚI NHẤT</h3>
          <p className='text-white opacity-60'>Đăng ký ngay bây giờ và nhận tin hàng tuần</p>
        </div>
        <div className='relative md:w-1/2'>
          <input
            type='email'
            placeholder='Địa chỉ email'
            className='border-none w-full h-[50px] rounded-[30px] px-5 bg-[#ffffff1a] text-white outline-none placeholder:font-light placeholder:text-sm placeholder:text-white/35 pr-12'
          />
          <div className='absolute top-0 right-0'>
            <button className='text-white h-[50px] px-[25px]'>
              <Mail size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer>
      <Newsletter />
      <div className='container grid grid-flow-row py-6 divide-y divide-white divide-opacity-25 lg:py-[50px] lg:grid-cols-5 gap-6 lg:gap-0 lg:divide-none'>
        <div className='col-span-1 md:pt-6 lg:py-0 lg:col-span-2 lg:pr-10'>
          <p className='text-[#151515] uppercase font-semibold mb-3 md:mb-5 pl-[15px] text-[15px] relative before:bg-purple before:absolute before:content-[""] before:top-0 before:left-0 before:w-[3px] before:h-full'>
            Về chúng tôi
          </p>
          <p className='flex items-center gap-2 mb-[10px] text-[#808080] text-sm'>
            <MapPin size={14} color='#151515' />
            Địa chỉ: 474 Ontario St Toronto, ON M4X 1M7 Canada
          </p>
          <p className='flex items-center gap-2 mb-[10px] text-[#808080] text-sm'>
            <Phone size={14} color='#151515' />
            Điện thoại: (+1234)56789xxx
          </p>
          <p className='flex items-center gap-2 mb-[10px] text-[#808080] text-sm'>
            <Mail size={14} color='#151515' />
            Mail: tadathemes@gmail.com
          </p>
          <div className='text-base flex items-center gap-2 mt-4'>
            <Link
              to='/'
              target='_blank'
              className='text-[#151515] size-10 rounded-[3px] text-center bg-[#808080]/20 flex items-center justify-center'
            >
              <Facebook className='size-4' />
            </Link>
            <Link
              to='/'
              target='_blank'
              className='text-[#151515] size-10 rounded-[3px] text-center bg-[#808080]/20 flex items-center justify-center'
            >
              <Twitter className='size-4' />
            </Link>
            <Link
              to='/'
              target='_blank'
              className='text-[#151515] size-10 rounded-[3px] text-center bg-[#808080]/20 flex items-center justify-center'
            >
              <Pinterest className='size-4' />
            </Link>
            <Link
              to='/'
              target='_blank'
              className='text-[#151515] size-10 rounded-[3px] text-center bg-[#808080]/20 flex items-center justify-center'
            >
              <GooglePlus className='size-4' />
            </Link>
            <Link
              to='/'
              target='_blank'
              className='text-[#151515] size-10 rounded-[3px] text-center bg-[#808080]/20 flex items-center justify-center'
            >
              <Instagram className='size-4' />
            </Link>
          </div>
        </div>
        <div>
          <p className='text-[#151515] uppercase font-semibold mb-3 md:mb-5 pl-[15px] text-[15px] relative before:bg-purple before:absolute before:content-[""] before:top-0 before:left-0 before:w-[3px] before:h-full'>
            Thông tin
          </p>
          <nav className='grid gap-3'>
            <Link to='/' className='text-[#808080] text-sm hover:text-purple'>
              Bộ sưu tập
            </Link>
            <Link to='/' className='text-[#808080] text-sm hover:text-purple'>
              Vị trí cửa hàng
            </Link>
            <Link to='/' className='text-[#808080] text-sm hover:text-purple'>
              Ưu đãi hôm nay
            </Link>
            <Link to='/' className='text-[#808080] text-sm hover:text-purple'>
              Liên hệ
            </Link>
          </nav>
        </div>
        <div>
          <p className='text-[#151515] uppercase font-semibold mb-3 md:mb-5 pl-[15px] text-[15px] relative before:bg-purple before:absolute before:content-[""] before:top-0 before:left-0 before:w-[3px] before:h-full'>
            CHÚNG TÔI LÀ AI
          </p>
          <nav className='grid gap-3'>
            <Link to='/' className='text-[#808080] text-sm hover:text-purple'>
              Trợ giúp
            </Link>
            <Link to='/' className='text-[#808080] text-sm hover:text-purple'>
              Miễn phí vận chuyển
            </Link>
            <Link to='/' className='text-[#808080] text-sm hover:text-purple'>
              FAQs
            </Link>
            <Link to='/' className='text-[#808080] text-sm hover:text-purple'>
              Chính sách đổi trả
            </Link>
            <Link to='/' className='text-[#808080] text-sm hover:text-purple'>
              Chứng thực
            </Link>
          </nav>
        </div>
        <div>
          <p className='text-[#151515] uppercase font-semibold mb-3 md:mb-5 pl-[15px] text-[15px] relative before:bg-purple before:absolute before:content-[""] before:top-0 before:left-0 before:w-[3px] before:h-full'>
            #DIGITALWORLDSTORE
          </p>
        </div>
      </div>
      <div className='bg-[#0f0f0f] py-5 text-[#b7b7b7]'>
        <div className='container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='text-[#808080] text-xs'>© 2024, Digital World 5 Powered by Conggglee</div>
          <div>
            <ul className='flex items-center gap-[10px]'>
              <li>
                <Visa className='w-[50px] h-[30px] fill-white' />
              </li>
              <li>
                <MasterCard className='w-[50px] h-[30px] fill-white' />
              </li>
              <li>
                <AmericanExpress className='w-[50px] h-[30px] fill-white' />
              </li>
              <li>
                <Paypal className='w-[50px] h-[30px] fill-white' />
              </li>
              <li>
                <Discover className='w-[50px] h-[30px] fill-white' />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
