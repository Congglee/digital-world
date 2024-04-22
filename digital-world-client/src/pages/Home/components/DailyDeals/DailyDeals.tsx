import { AlignJustify, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import { Product } from 'src/types/product.type'
import { formatCurrency } from 'src/utils/utils'

export default function DailyDeals({ product }: { product: Product | null }) {
  if (!product) return null

  return (
    <div className='p-5 border border-[#ebebeb] text-center'>
      <div className='text-center'>
        <div className='flex items-center'>
          <Star className='size-5 text-purple' fill='#aa78ae' />
          <h2 className='mx-auto uppercase text-[#505050] font-semibold text-xl'>Ưu đãi hàng ngày</h2>
        </div>
      </div>
      <div className='mb-[15px]'>
        <Link to='/products'>
          <img src={product.thumb} alt='daily deal product thumbnail' />
        </Link>
        <div className='flex flex-col items-center'>
          <Link to='/products' className='line-clamp-2 hover:text-purple text-[#2b3743] mb-2'>
            {product.name}
          </Link>
          <div className='mb-[15px]'>
            <ProductRating
              rating={product.total_ratings}
              activeClassname='w-4 h-4 fill-[#f1b400] text-[#f1b400]'
              nonActiveClassname='w-4 h-4 fill-current text-gray-300'
            />
          </div>
          <div className='mb-[15px] space-x-1'>
            <span className='text-gray-500 line-through'>{formatCurrency(product.price_before_discount)} VND</span>
            <span>{formatCurrency(product.price)} VND</span>
          </div>

          <div className='w-full grid grid-cols-3 gap-1 '>
            <div className='flex flex-col px-[5px] py-[10px] text-center bg-[#f4f4f4]'>
              <span className='font-semibold text-lg text-[#151515]'>0</span>
              <span className='text-xs text-[#8b8b8b]'>Giờ</span>
            </div>
            <div className='flex flex-col px-[5px] py-[10px] text-center bg-[#f4f4f4]'>
              <span className='font-semibold text-lg text-[#151515]'>0</span>
              <span className='text-xs text-[#8b8b8b]'>Phút</span>
            </div>
            <div className='flex flex-col px-[5px] py-[10px] text-center bg-[#f4f4f4]'>
              <span className='font-semibold text-lg text-[#151515]'>0</span>
              <span className='text-xs text-[#8b8b8b]'>Giây</span>
            </div>
          </div>
        </div>
      </div>
      <Link
        to='/products'
        className='flex items-center justify-center px-[15px] py-[11px] bg-purple text-white uppercase gap-2 text-sm hover:bg-black transition-colors duration-300'
      >
        <AlignJustify className='size-5' />
        Tùy chọn
      </Link>
    </div>
  )
}
