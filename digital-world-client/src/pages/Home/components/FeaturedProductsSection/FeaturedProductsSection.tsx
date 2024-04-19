import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import path from 'src/constants/path'
import { Product } from 'src/types/product.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

export default function FeaturedProductsSection({ products }: { products: Product[] }) {
  const featuredProducts = useMemo(() => {
    return products.filter((product) => product.is_featured)
  }, [products])

  return (
    <>
      <div className='text-[#151515] border-b-2 border-purple mb-5'>
        <h2 className='text-xl uppercase py-[15px] font-semibold'>Sản phẩm nổi bật</h2>
      </div>
      <div className='grid md:grid-cols-3 gap-4 mb-5'>
        {featuredProducts.map((product, idx) => (
          <div className='flex gap-5 overflow-hidden bg-white border border-[#ebebeb] p-[15px]' key={product._id}>
            <div className='size-24'>
              <Link to={`${path.products}/${generateNameId({ name: product.name, id: product._id })}`}>
                <img src={product.thumb} alt={`product thumb ${idx}`} className='w-full h-full object-cover' />
              </Link>
            </div>
            <div className='flex-1 flex flex-col gap-[10px]'>
              <h4 className='line-clamp-2 text-sm text-[#2b3743]'>
                <Link to={`${path.products}/${generateNameId({ name: product.name, id: product._id })}`}>
                  {product.name}
                </Link>
              </h4>
              <ProductRating
                rating={product.total_ratings}
                activeClassname='w-3.5 h-3.5 fill-[#f1b400] text-[#f1b400]'
                nonActiveClassname='w-3.5 h-3.5 fill-current text-gray-300'
              />
              <div className='space-x-1 text-sm'>
                {product.price_before_discount !== 0 && (
                  <span className='text-gray-500 line-through'>
                    {formatCurrency(product.price_before_discount)} VND
                  </span>
                )}
                <span>{formatCurrency(product.price)} VND</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='grid md:grid-cols-4 gap-5 mb-5'>
        <div className='md:col-span-2 tab-hover-animation'>
          <img
            src='https://res.cloudinary.com/di3eto0bg/image/upload/v1695240373/ecommerce-techshop/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x_bybrgx.jpg'
            alt='feature products image 1'
            className='w-full h-full object-cover'
          />
        </div>
        <div className='grid gap-5 md:col-span-1'>
          <div className='tab-hover-animation'>
            <img
              src='https://res.cloudinary.com/di3eto0bg/image/upload/v1695240384/ecommerce-techshop/banner2-bottom-home2_400x_xrmf2m.jpg'
              alt='feature products image 2'
              className='w-full h-full object-cover'
            />
          </div>
          <div className='tab-hover-animation'>
            <img
              src='https://res.cloudinary.com/di3eto0bg/image/upload/v1695240395/ecommerce-techshop/banner3-bottom-home2_400x_yx0zop.jpg'
              alt='feature products image 3'
              className='w-full h-full object-cover'
            />
          </div>
        </div>
        <div className='md:col-span-1 tab-hover-animation'>
          <img
            src='https://res.cloudinary.com/di3eto0bg/image/upload/v1695240402/ecommerce-techshop/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x_y4mzyt.jpg'
            alt='feature products image 4'
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </>
  )
}
