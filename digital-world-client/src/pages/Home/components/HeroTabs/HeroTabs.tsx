import { useMemo, useState } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from 'src/components/ui/carousel'
import { Product } from 'src/types/product.type'
import { cn } from 'src/utils/utils'
import ProductTab from '../ProductTab/ProductTab'

export default function HeroTabs({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState(0)

  const bestSellerProducts = useMemo(() => {
    return [...products].sort((a, b) => b.sold - a.sold).slice(0, 5) || []
  }, [products])
  const newArrivalProducts = useMemo(() => {
    return [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
  }, [products])
  const appleProducts = useMemo(() => {
    return products.filter((product) => product.brand === 'Apple').slice(0, 5) || []
  }, [products])

  return (
    <>
      <ul className='pb-[15px] mb-5 border-b-2 border-purple divide-y-2 md:divide-x-2 md:divide-y-0 divide-[#ebebeb] flex flex-col md:flex-row'>
        <li className='py-[5px] md:py-0 md:px-5 first:pl-0 cursor-pointer'>
          <button
            className={cn(
              'text-[#151515] font-semibold text-xl uppercase opacity-50',
              activeTab === 0 && 'opacity-100'
            )}
            onClick={() => {
              setActiveTab(0)
            }}
          >
            Bán chạy nhất
          </button>
        </li>
        <li className='py-[5px] md:py-0 md:px-5 cursor-pointer'>
          <button
            className={cn(
              'text-[#151515] font-semibold text-xl uppercase opacity-50',
              activeTab === 1 && 'opacity-100'
            )}
            onClick={() => setActiveTab(1)}
          >
            Hàng Mới Về
          </button>
        </li>
        <li className='pt-[5px] md:py-0 md:px-5 cursor-pointer'>
          <button
            className={cn(
              'text-[#151515] font-semibold text-xl uppercase opacity-50',
              activeTab === 2 && 'opacity-100'
            )}
            onClick={() => setActiveTab(2)}
          >
            Macbook
          </button>
        </li>
      </ul>
      <Carousel opts={{ align: 'start', loop: true }} className='mb-5'>
        <CarouselContent className='-ml-[15px]'>
          {activeTab === 0 &&
            bestSellerProducts.map((product) => (
              <CarouselItem className='md:basis-1/2 lg:basis-1/3' key={product._id}>
                <ProductTab product={product} />
              </CarouselItem>
            ))}
          {activeTab === 1 &&
            newArrivalProducts.map((product) => (
              <CarouselItem className='md:basis-1/2 lg:basis-1/3' key={product._id}>
                <ProductTab product={product} />
              </CarouselItem>
            ))}
          {activeTab === 2 &&
            appleProducts.map((product) => (
              <CarouselItem className='md:basis-1/2 lg:basis-1/3' key={product._id}>
                <ProductTab product={product} />
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious
          className='absolute left-0 py-1 px-[10px] top-1/2 size-20 transition-all duration-300 rounded-none text-[#151515] opacity-60 hover:opacity-100 bg-white hover:bg-white hover:text-[#ee3131] border-none'
          iconClassName='h-9 w-9'
        />
        <CarouselNext
          className='absolute right-0 py-1 px-[10px] top-1/2 size-20 transition-all duration-300 rounded-none text-[#151515] opacity-60 hover:opacity-100 bg-white hover:bg-white hover:text-[#ee3131] border-none'
          iconClassName='h-9 w-9'
        />
      </Carousel>
      <div className='grid md:grid-cols-2 gap-5'>
        <div className='tab-hover-animation'>
          <img
            src='https://res.cloudinary.com/di3eto0bg/image/upload/v1695207846/ecommerce-techshop/banner1-home2_jswako.png'
            alt='hero tab 1'
            className='w-full h-full object-cover'
          />
        </div>
        <div className='tab-hover-animation'>
          <img
            src='https://res.cloudinary.com/di3eto0bg/image/upload/v1695207845/ecommerce-techshop/banner2-home2_scej7r.png'
            alt='hero tab 2'
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </>
  )
}
