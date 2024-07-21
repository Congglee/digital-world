import { Link } from 'react-router-dom'
import { cn, formatCurrency, generateNameId, scrollToTop } from 'src/utils/utils'
import { AlignJustify, Eye, Heart, Loader2 } from 'lucide-react'
import ProductRating from 'src/components/ProductRating'
import { Product } from 'src/types/product.type'
import path from 'src/constants/path'
import QuickViewModal from 'src/components/QuickViewModal'
import { useEffect, useState } from 'react'
import { useAddToWishListMutation } from 'src/redux/apis/user.api'
import { toast } from 'react-toastify'

// Best - Total Ratings > 4.5
// Featured - Is Featured === true
// Trending - View > 500
// Deal - Has Price Before Discount > 0
// New - New products added this month (createdAt: ISOString)

interface ProductLabel {
  title: string
  color: string
}

function getProductLabel(product: Product): ProductLabel | null {
  if (product) {
    const conditions: { condition: (product: Product) => boolean; label: ProductLabel }[] = [
      { condition: (product) => product.total_ratings > 4.8, label: { title: 'Best', color: 'green' } },
      { condition: (product) => product.is_featured, label: { title: 'Featured', color: 'red' } },
      { condition: (product) => product.view > 500, label: { title: 'Trending', color: 'blue' } },
      { condition: (product) => product.price_before_discount > 0, label: { title: 'Deal', color: 'cyan' } },
      {
        condition: (product) => {
          const createdAt = new Date(product.createdAt)
          const currentMonth = new Date().getMonth()
          const productMonth = createdAt.getMonth()
          return createdAt.getFullYear() === new Date().getFullYear() && productMonth === currentMonth
        },
        label: { title: 'New', color: 'orange' }
      }
    ]

    for (const { condition, label } of conditions) {
      if (condition(product)) {
        return label
      }
    }
  }

  return null
}

export default function ProductTab({ product }: { product: Product }) {
  const labelColors = {
    green: 'bg-[#00ff27] after:border-r-[#00ff27]',
    cyan: 'bg-[#00d5d5] after:border-r-[#00d5d5]',
    orange: 'bg-[#ffb400] after:border-r-[#ffb400]',
    blue: 'bg-[#003cff] after:border-r-[#003cff]',
    red: 'bg-[#df0029] after:border-r-[#df0029]'
  }
  const label = getProductLabel(product)
  const [open, setOpen] = useState(false)
  const [addToWishList, { data, isSuccess, isLoading }] = useAddToWishListMutation()

  const closeModal = () => {
    setOpen(false)
  }

  const openModal = () => {
    setOpen(true)
  }

  const handleAddToWishList = async () => {
    await addToWishList(product._id)
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message, { autoClose: 1000 })
    }
  }, [isSuccess])

  return (
    <>
      <div className='bg-white border border-[#ebebeb] p-[15px] group'>
        <div className='w-full overflow-hidden relative'>
          <Link to={`${path.products}/${generateNameId({ name: product.name, id: product._id })}`}>
            <img src={product.thumb} alt={`product ${product.name} thumbnail`} className='w-full h-full object-cover' />
          </Link>
          <div className='absolute top-0 right-0 text-left'>
            {label && (
              <span
                className={cn(
                  'text-white py-[6px] text-[10px] font-semibold absolute w-[70px] h-[25px] right-0 text-center uppercase',
                  'before:content-[""] before:size-[6px] before:bg-white before:absolute before:left-0 before:top-[10px] before:rounded-full',
                  'after:content-[""] after:size-0 after:border-r-[10px] after:border-t-[13px] after:border-t-transparent after:border-b-[12px] after:border-b-transparent after:absolute after:top-0 after:right-0 after:-left-[10px] after:text-center',
                  `${labelColors[label.color as keyof typeof labelColors]}`
                )}
              >
                {label.title}
              </span>
            )}
          </div>
          <div className='opacity-0 invisible group-hover:opacity-100 group-hover:visible w-full group-hover:bottom-5 absolute left-0 -bottom-10 px-5 flex items-center justify-center gap-[10px] transition-all duration-400'>
            <button className='size-10 bg-white text-[#2a2a2a] border border-[#c5cfd6] rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-[#2a2a2a] hover:text-white'>
              <Link
                to={`${path.products}/${generateNameId({ name: product.name, id: product._id })}`}
                onClick={scrollToTop}
                className='w-full h-full flex items-center justify-center'
              >
                <AlignJustify className='size-4' />
              </Link>
            </button>
            <button
              className='size-10 bg-white text-[#2a2a2a] border border-[#c5cfd6] rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-[#2a2a2a] hover:text-white'
              onClick={openModal}
            >
              <Eye className='size-4' />
            </button>
            <button
              className={cn(
                'size-10 bg-white text-[#2a2a2a] border border-[#c5cfd6] rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-[#2a2a2a] hover:text-white',
                isLoading && 'animate-spin'
              )}
              onClick={handleAddToWishList}
            >
              {isLoading && <Loader2 className='size-4' />}
              {!isLoading && <Heart className='size-4' />}
            </button>
          </div>
        </div>
        <div className='flex flex-col gap-[6px]'>
          <Link
            to={`${path.products}/${generateNameId({ name: product.name, id: product._id })}`}
            className='line-clamp-2 text-[#2b3743]'
          >
            {product.name}
          </Link>
          <ProductRating
            rating={product.total_ratings}
            activeClassname='w-[14px] h-[14px] fill-[#f1b400] text-[#f1b400]'
            nonActiveClassname='w-[14px] h-[14px] fill-current text-gray-300'
          />
          <div className='space-x-1'>
            {product.price_before_discount !== 0 && (
              <span className='text-gray-500 line-through'>{formatCurrency(product.price_before_discount)} VND</span>
            )}
            <span>{formatCurrency(product.price)} VND</span>
          </div>
        </div>
      </div>
      <QuickViewModal open={open} product={product} closeModal={closeModal} />
    </>
  )
}
