import { useEffect, useState } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from 'src/components/ui/carousel'
import { Product } from 'src/types/product.type'
import { cn } from 'src/utils/utils'
import ProductCard from 'src/components/ProductCard'

export default function NewArrivalsSection({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState(0)
  const [newArrivalsProducts, setNewArrivalsProducts] = useState<Product[]>([])

  useEffect(() => {
    if (activeTab === 0) {
      setNewArrivalsProducts(products.filter((product) => product.category.name === 'Laptop gaming'))
    } else if (activeTab === 1) {
      setNewArrivalsProducts(products.filter((product) => product.category.name === 'Laptop đồ họa'))
    } else if (activeTab === 2) {
      setNewArrivalsProducts(products.filter((product) => product.category.name === 'Laptop văn phòng'))
    }
  }, [products, activeTab])

  return (
    <>
      <div className='text-[#151515] border-b-2 border-purple mb-5 flex flex-col md:flex-row md:items-center md:justify-between'>
        <h2 className='text-xl uppercase md:py-3 font-semibold'>Sản phẩm mới</h2>
        <ul className='flex flex-col md:flex-row md:items-center divide-y md:divide-y-0 md:divide-x divide-[#ebebeb] mb-[10px] md:mb-0'>
          <li className='py-[5px] px-[10px] md:py-0 md:px-5'>
            <button
              className={cn('text-gray-500 text-sm hover:text-purple', activeTab === 0 && 'text-purple')}
              onClick={() => {
                setActiveTab(0)
              }}
            >
              Laptop gaming
            </button>
          </li>
          <li className='py-[5px] px-[10px] md:py-0 md:px-5'>
            <button
              className={cn('text-gray-500 text-sm hover:text-purple', activeTab === 1 && 'text-purple')}
              onClick={() => {
                setActiveTab(1)
              }}
            >
              Laptop đồ họa
            </button>
          </li>
          <li className='py-[5px] px-[10px] md:py-0 md:px-5 last:pr-0'>
            <button
              className={cn('text-gray-500 text-sm hover:text-purple', activeTab === 2 && 'text-purple')}
              onClick={() => {
                setActiveTab(2)
              }}
            >
              Laptop văn phòng
            </button>
          </li>
        </ul>
      </div>
      <Carousel opts={{ align: 'start', loop: true }} className='mb-5'>
        <CarouselContent className='-ml-[15px]'>
          {newArrivalsProducts.map((product) => (
            <CarouselItem className='md:basis-1/2 lg:basis-1/3' key={product._id}>
              <ProductCard product={product} />
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
    </>
  )
}
