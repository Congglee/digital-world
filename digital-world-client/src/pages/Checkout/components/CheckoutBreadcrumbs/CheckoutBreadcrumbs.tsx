import { ChevronRight } from 'lucide-react'

export default function CheckoutBreadcrumbs() {
  return (
    <div className='mb-5 flex flex-wrap items-center text-xs'>
      <span className='flex items-center'>
        Thông tin liên hệ
        <span className='px-[5px]'>
          <ChevronRight className='w-3 h-3' />
        </span>
      </span>
      <span className='text-[#2c6ecb] flex items-center'>
        Vận chuyển
        <span className='px-[5px]'>
          <ChevronRight className='w-3 h-3' />
        </span>
      </span>
      <span className='text-[#2c6ecb] flex items-center'>Thanh toán</span>
    </div>
  )
}
