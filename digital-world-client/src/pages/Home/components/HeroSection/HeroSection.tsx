import CategorySideFilter from 'src/components/CategorySideFilter'
import BannerSliders from '../BannerSliders'
import DailyDeals from '../DailyDeals'
import HeroTabs from '../HeroTabs'
import { Category } from 'src/types/category.type'
import { Product } from 'src/types/product.type'

export default function HeroSection({ categories, products }: { categories: Category[]; products: Product[] }) {
  return (
    <>
      <div className='grid grid-cols-12 gap-5 mb-[30px]'>
        <div className='hidden md:block md:col-span-3'>
          <CategorySideFilter categories={categories} />
        </div>
        <div className='col-span-12 md:col-span-9'>
          <BannerSliders />
        </div>
      </div>

      <div className='grid grid-cols-12 md:gap-5 mb-5'>
        <div className='col-span-12 md:col-span-4 lg:col-span-3'>
          <DailyDeals />
        </div>
        <div className='col-span-12 md:col-span-8 lg:col-span-9'>
          <HeroTabs products={products} />
        </div>
      </div>
    </>
  )
}
