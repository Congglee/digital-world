import ProductCard from 'src/components/ProductCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from 'src/components/ui/carousel'
import { Product } from 'src/types/product.type'

interface RelateProductsProps {
  relateProducts: Product[]
}

export default function RelateProducts({ relateProducts }: RelateProductsProps) {
  return (
    <div className='mt-[30px]'>
      <div className='text-[#151515] border-b-2 border-purple mb-10'>
        <h3 className='text-lg uppercase pb-[5px] font-semibold'>Sản phẩm tương tự</h3>
      </div>
      <Carousel opts={{ align: 'start', loop: true }} className='mb-5'>
        <CarouselContent className='-ml-[15px]'>
          {relateProducts.map((product) => (
            <CarouselItem className='sm:basis-1/2 md:basis-1/3 lg:basis-1/4' key={product._id}>
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {relateProducts.length > 0 && (
          <>
            <CarouselPrevious
              className='absolute left-0 py-1 px-[10px] top-1/2 size-20 transition-all duration-300 rounded-none text-[#151515] opacity-60 hover:opacity-100 bg-white hover:bg-white hover:text-[#ee3131] border-none'
              iconClassName='h-9 w-9'
            />
            <CarouselNext
              className='absolute right-0 py-1 px-[10px] top-1/2 size-20 transition-all duration-300 rounded-none text-[#151515] opacity-60 hover:opacity-100 bg-white hover:bg-white hover:text-[#ee3131] border-none'
              iconClassName='h-9 w-9'
            />
          </>
        )}
      </Carousel>
    </div>
  )
}
