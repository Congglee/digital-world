import DOMPurify from 'dompurify'
import { AlignJustify, Eye, Heart, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import ProductRating from 'src/components/ProductRating'
import QuickViewModal from 'src/components/QuickViewModal'
import path from 'src/constants/path'
import { useAddToWishListMutation } from 'src/redux/apis/user.api'
import { Product } from 'src/types/product.type'
import { cn, formatCurrency, generateNameId, scrollToTop } from 'src/utils/utils'

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

interface ProductCardProps {
  product: Product
  actionButtonsClassname?: string
  overviewClassname?: string
}

export default function ProductCard({ product, actionButtonsClassname, overviewClassname }: ProductCardProps) {
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
      <div className='bg-white border border-[#ebebeb] p-[15px] relative group'>
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
        </div>
        <div className='flex flex-col gap-[6px]'>
          <h3 className='line-clamp-2 text-[#2b3743]'>
            <Link to={`${path.products}/${generateNameId({ name: product.name, id: product._id })}`}>
              {product.name}
            </Link>
          </h3>
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

        <div className='opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute size-full top-0 left-0 py-[10px] bg-white overflow-hidden transition-all duration-300 ease-in'>
          <div className='pb-[10px] border-b border-b-[#ebebeb] mb-[10px] overflow-hidden flex items-start gap-5 px-5'>
            <h3 className='overflow-hidden line-clamp-2 text-[#2b3743] hover:text-purple'>
              <Link
                to={`${path.products}/${generateNameId({ name: product.name, id: product._id })}`}
                onClick={scrollToTop}
              >
                {product.name}
              </Link>
            </h3>
            <div className='flex flex-col text-right'>
              {product.price_before_discount !== 0 && (
                <span className='text-gray-500 line-through'>{formatCurrency(product.price_before_discount)} VND</span>
              )}
              <span>{formatCurrency(product.price)} VND</span>
            </div>
          </div>
          <div
            className={cn('mb-[15px] text-[13px] leading-5 text-[#505050] px-5 line-clamp-[10]', overviewClassname)}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product.overview)
            }}
          />
          <div
            className={cn(
              'relative w-full group-hover:bottom-0 left-0 -bottom-10 flex items-center justify-center gap-[10px] transition-all duration-400 px-5',
              actionButtonsClassname
            )}
          >
            <button className='size-10 bg-white text-[#2a2a2a] border border-[#c5cfd6] rounded-full transition-colors duration-300 hover:bg-[#2a2a2a] hover:text-white cursor-pointer'>
              <Link
                to={`${path.products}/${generateNameId({ name: product.name, id: product._id })}`}
                onClick={scrollToTop}
                className='w-full h-full flex items-center justify-center'
              >
                <AlignJustify className='size-4' />
              </Link>
            </button>
            <button
              className='size-10 bg-white text-[#2a2a2a] border border-[#c5cfd6] rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-[#2a2a2a] hover:text-white cursor-pointer'
              onClick={openModal}
            >
              <Eye className='size-4' />
            </button>
            <button
              className={cn(
                'size-10 bg-white text-[#2a2a2a] border border-[#c5cfd6] rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-[#2a2a2a] hover:text-white cursor-pointer',
                isLoading && 'animate-spin'
              )}
              onClick={handleAddToWishList}
            >
              {isLoading && <Loader2 className='size-4' />}
              {!isLoading && <Heart className='size-4' />}
            </button>
          </div>
        </div>
      </div>
      <QuickViewModal open={open} product={product} closeModal={closeModal} />
    </>
  )
}
