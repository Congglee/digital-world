import { ChevronRight } from 'lucide-react'
import { cn } from 'src/utils/utils'

export default function CheckoutBreadcrumbs({ active }: { active: string }) {
  return (
    <div className='mb-5 flex flex-wrap items-center text-xs'>
      <span className={cn('flex items-center', active === 'contact-information' && 'text-[#2c6ecb]')}>
        Thông tin liên hệ
        <span className='px-[5px]'>
          <ChevronRight className='w-3 h-3' />
        </span>
      </span>
      <span className={cn('flex items-center', active === 'shipment' && 'text-[#2c6ecb]')}>
        Vận chuyển
        <span className='px-[5px]'>
          <ChevronRight className='w-3 h-3' />
        </span>
      </span>
      <span className={cn('flex items-center', active === 'payment' && 'text-[#2c6ecb]')}>Thanh toán</span>
    </div>
  )
}
