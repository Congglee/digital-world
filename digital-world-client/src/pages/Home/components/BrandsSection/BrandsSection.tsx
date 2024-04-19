import { useRef } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from 'src/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

const brandsImages = [
  'https://res.cloudinary.com/di3eto0bg/image/upload/v1695210656/ecommerce-techshop/acer_nidkpe.png',
  'https://res.cloudinary.com/di3eto0bg/image/upload/v1695210664/ecommerce-techshop/dell_bgp8qp.png',
  'https://res.cloudinary.com/di3eto0bg/image/upload/v1695210670/ecommerce-techshop/apple_bkhtxu.png',
  'https://res.cloudinary.com/di3eto0bg/image/upload/v1695210677/ecommerce-techshop/asus_jvf4cv.png',
  'https://res.cloudinary.com/di3eto0bg/image/upload/v1695210685/ecommerce-techshop/lenovo_bh0abh.png',
  'https://res.cloudinary.com/di3eto0bg/image/upload/v1695210691/ecommerce-techshop/lg_kapcrm.png',
  'https://res.cloudinary.com/di3eto0bg/image/upload/v1695210698/ecommerce-techshop/msi_un5wxp.png'
]

export default function BrandsSection() {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

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
          {brandsImages.map((image, idx) => (
            <CarouselItem className='basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5' key={idx}>
              <img src={image} alt={`brand image ${idx}`} className='w-full h-full object-cover' />
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
