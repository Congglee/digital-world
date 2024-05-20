import DOMPurify from 'dompurify'
import { Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from 'src/components/Button'
import ProductRating from 'src/components/ProductRating'
import QuantityController from 'src/components/QuantityController'
import { useAddToCartMutation } from 'src/redux/apis/user.api'
import { Product } from 'src/types/product.type'
import { Facebook, Pinterest, Twitter } from 'src/utils/icons'
import { formatCurrency } from 'src/utils/utils'

interface ProductInfomationProps {
  product: Product
}

export default function ProductInfomation({ product }: ProductInfomationProps) {
  const [buyCount, setBuyCount] = useState(1)
  const [addToCart, { data, isSuccess, isLoading }] = useAddToCartMutation()

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const handleAddToCart = async () => {
    await addToCart({ product_id: product._id, buy_count: buyCount })
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message, { autoClose: 1000 })
    }
  }, [isSuccess])

  return (
    <>
      <div className='space-x-2 mb-5 text-[#333] font-semibold text-xl'>
        {product.price_before_discount !== 0 && (
          <span className='text-[#999] line-through'>{formatCurrency(product.price_before_discount)} VND</span>
        )}
        <span className='text-[30px] leading-[1.15]'>{formatCurrency(product.price)} VND</span>
      </div>
      <div className='flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-5 mb-5'>
        <div className='flex items-center gap-1'>
          <ProductRating
            rating={product.total_ratings}
            activeClassname='w-5 h-5 fill-[#f1b400] text-[#f1b400]'
            nonActiveClassname='w-5 h-5 fill-current text-gray-300'
          />
          <span className='text-[#505050] text-sm'>{product.ratings.length} đánh giá</span>
        </div>
        <div className='flex items-center gap-1 text-[#505050] text-sm'>
          <Eye className='w-4 h-4' />
          <span>Lượt xem: {product.view}</span>
        </div>
      </div>
      <div
        className='mb-4 text-sm text-[#505050] leading-6'
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(product.overview)
        }}
      />
      <div className='flex flex-wrap items-center mb-4'>
        <div className='text-[#151515] font-semibold text-sm'>Số lượng</div>
        <QuantityController
          onDecrease={handleBuyCount}
          onIncrease={handleBuyCount}
          onType={handleBuyCount}
          value={buyCount}
          max={product.quantity}
          classNameWrapper='ml-8'
        />
      </div>
      <Button
        className='max-w-[480px] w-full bg-purple py-[11px] px-[15px] font-bold text-sm uppercase text-white hover:bg-[#333] transition-colors duration-150 ease-out mb-5 flex items-center justify-center gap-2'
        onClick={handleAddToCart}
        disabled={isLoading}
        isLoading={isLoading}
      >
        Thêm vào giỏ hàng
      </Button>
      <div className='flex items-center gap-[10px]'>
        <Link
          to='https://www.facebook.com/'
          className='bg-black size-[35px] text-white leading-9 rounded-full flex items-center justify-center'
          target='_blank'
        >
          <Facebook className='w-4 h-4' fill='white' strokeWidth={1} />
        </Link>
        <Link
          to='https://twitter.com/home'
          className='bg-black size-[35px] text-white leading-9 rounded-full flex items-center justify-center'
          target='_blank'
        >
          <Twitter className='w-4 h-4' fill='white' strokeWidth={1} />
        </Link>
        <Link
          to='https://www.pinterest.com/'
          className='bg-black size-[35px] text-white leading-9 rounded-full flex items-center justify-center'
          target='_blank'
        >
          <Pinterest className='w-4 h-4' />
        </Link>
      </div>
    </>
  )
}
