import { CalendarDays, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from 'src/components/ui/carousel'
import { blogPosts } from 'src/constants/data'

export default function BlogPostSection() {
  return (
    <>
      <div className='text-[#151515] border-b-2 border-purple mb-5'>
        <h2 className='text-xl uppercase py-3 font-semibold'>Bài viết</h2>
      </div>
      <Carousel opts={{ align: 'start', loop: true }}>
        <CarouselContent>
          {blogPosts.map((blog, idx) => (
            <CarouselItem className='md:basis-1/2 lg:basis-1/3' key={idx}>
              <div className='flex flex-col gap-5'>
                <Link to='/'>
                  <img src={blog.thumb} alt={`Blog ${blog.title} thumbnail`} className='w-full h-full object-cover' />
                </Link>
                <div className='flex flex-col text-center items-center'>
                  <Link to='/' className='text-[#151515] uppercase font-semibold mb-[15px] hover:text-purple'>
                    {blog.title}
                  </Link>
                  <ul className='flex items-center gap-[10px] mb-[10px]'>
                    <li className='flex items-center gap-2 text-[13px] text-gray-500'>
                      <CalendarDays className='size-4' />
                      <span>{blog.date}</span>
                    </li>
                    <li className='flex items-center gap-2 text-[13px] text-gray-500'>
                      <MessageCircle className='size-4' />
                      <span>{blog.total_comments} comment</span>
                    </li>
                  </ul>
                  <p className='text-[13px] leading-6 text-[#505050]'>{blog.description}</p>
                </div>
              </div>
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
