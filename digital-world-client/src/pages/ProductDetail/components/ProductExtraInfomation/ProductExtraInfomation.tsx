import { ClipboardCheck, PhoneCall, ShieldCheck, Truck, Undo2 } from 'lucide-react'

export default function ProductExtraInfomation() {
  return (
    <ul className='space-y-[10px]'>
      <li className='p-[10px] border border-[#ebebeb] text-sm leading-[6px] overflow-hidden flex items-center gap-[10px]'>
        <div className='w-9 h-9 bg-[#505050] rounded-full flex items-center justify-center text-white flex-shrink-0'>
          <ShieldCheck className='size-5' />
        </div>
        <div className='flex flex-col flex-1 text-sm leading-4'>
          <span>Bảo đảm</span>
          <span className='text-xs text-[#999] capitalize'>Sản phẩm chính hãng 100%</span>
        </div>
      </li>
      <li className='p-[10px] border border-[#ebebeb] text-sm leading-[6px] overflow-hidden flex items-center gap-[10px]'>
        <div className='w-9 h-9 bg-[#505050] rounded-full flex items-center justify-center text-white flex-shrink-0'>
          <Truck className='size-5' />
        </div>
        <div className='flex flex-col flex-1 text-sm leading-4'>
          <span>Giao hàng miễn phí</span>
          <span className='text-xs text-[#999] capitalize'>Giao hàng toàn quốc</span>
        </div>
      </li>
      <li className='p-[10px] border border-[#ebebeb] text-sm leading-[6px] overflow-hidden flex items-center gap-[10px]'>
        <div className='w-9 h-9 bg-[#505050] rounded-full flex items-center justify-center text-white flex-shrink-0'>
          <ClipboardCheck className='size-5' />
        </div>
        <div className='flex flex-col flex-1 text-sm leading-4'>
          <span>Bảo hành</span>
          <span className='text-xs text-[#999] capitalize'>Bảo hành 24 tháng</span>
        </div>
      </li>
      <li className='p-[10px] border border-[#ebebeb] text-sm leading-[6px] overflow-hidden flex items-center gap-[10px]'>
        <div className='w-9 h-9 bg-[#505050] rounded-full flex items-center justify-center text-white flex-shrink-0'>
          <Undo2 className='size-5' />
        </div>
        <div className='flex flex-col flex-1 text-sm leading-4'>
          <span>Hoàn trả miễn phí</span>
          <span className='text-xs text-[#999] capitalize'>Trong vòng 7 ngày</span>
        </div>
      </li>
      <li className='p-[10px] border border-[#ebebeb] text-sm leading-[6px] overflow-hidden flex items-center gap-[10px]'>
        <div className='w-9 h-9 bg-[#505050] rounded-full flex items-center justify-center text-white flex-shrink-0'>
          <PhoneCall className='size-5' />
        </div>
        <div className='flex flex-col flex-1 text-sm leading-4'>
          <span>Tư vấn & Hỗ trợ</span>
          <span className='text-xs text-[#999] capitalize'>Trọn đời 24/7/356 </span>
        </div>
      </li>
    </ul>
  )
}
