import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from 'src/components/ui/carousel'

const banners = [
  'https://res.cloudinary.com/di3eto0bg/image/upload/v1695208002/ecommerce-techshop/banner_1.jpg',
  'https://res.cloudinary.com/di3eto0bg/image/upload/v1695208248/ecommerce-techshop/banner_3.jpg'
]

export default function BannerSliders() {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{ align: 'start', loop: true }}
      className='group'
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.play}
    >
      <CarouselContent>
        {banners.map((item, index) => (
          <CarouselItem key={index}>
            <div className='w-full h-80 lg:h-[480px]'>
              <img src={item} alt={`banner-${index}`} className='w-full h-full object-cover' />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        variant='destructive'
        className='absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 left-5 top-1/2 transition-all duration-300 rounded-md size-10 bg-black/60 hover:bg-black'
      />
      <CarouselNext
        variant='destructive'
        className='absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 right-5 top-1/2 transition-all duration-300 rounded-md size-10 bg-black/60 hover:bg-black'
      />
    </Carousel>
  )
}
