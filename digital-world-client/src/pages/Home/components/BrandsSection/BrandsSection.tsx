import { useRef } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from 'src/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Brand } from 'src/types/brand.type'
import { Link, createSearchParams } from 'react-router-dom'
import path from 'src/constants/path'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { scrollToTop } from 'src/utils/utils'

export default function BrandsSection({ brands }: { brands: Brand[] }) {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))
  const queryConfig = useQueryConfig()

  return (
    <>
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
        opts={{ align: 'start', loop: true }}
        className='mt-14 mb-[30px]'
      >
        <CarouselContent>
          {brands
            .filter((brand) => brand.is_actived && brand.image)
            .map((brand, idx) => (
              <CarouselItem className='h-20 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5' key={idx}>
                <Link
                  to={{
                    pathname: path.products,
                    search: createSearchParams({
                      ...queryConfig,
                      brand: brand.name.toLowerCase()
                    }).toString()
                  }}
                  onClick={scrollToTop}
                >
                  <img src={brand.image} alt={`brand-image-${idx}`} className='w-full h-full object-contain' />
                </Link>
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
