import CategorySideFilter from 'src/components/CategorySideFilter'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { Category } from 'src/types/category.type'
import { Product } from 'src/types/product.type'
import BannerSliders from '../BannerSliders'
import DailyDeals from '../DailyDeals'
import HeroTabs from '../HeroTabs'
import { useMemo } from 'react'

export default function HeroSection({ categories, products }: { categories: Category[]; products: Product[] }) {
  const queryConfig = useQueryConfig()

  const dailyDealProduct = useMemo(() => {
    if (products.length === 0) {
      return null
    }
    const [mostDiscountProduct] = [...products].sort((a, b) => {
      const aDiscount = a.price_before_discount - a.price
      const bDiscount = b.price_before_discount - b.price
      return bDiscount - aDiscount
    })
    return mostDiscountProduct
  }, [products]) // Hard code product (too lazy 🥱)

  return (
    <>
      <div className='grid grid-cols-12 gap-5 mb-[30px]'>
        <div className='hidden md:block md:col-span-3'>
          <CategorySideFilter queryConfig={queryConfig} categories={categories} />
        </div>
        <div className='col-span-12 md:col-span-9'>
          <BannerSliders />
        </div>
      </div>

      <div className='grid grid-cols-12 md:gap-5 mb-5'>
        <div className='col-span-12 md:col-span-4 lg:col-span-3'>
          <DailyDeals product={dailyDealProduct} />
        </div>
        <div className='col-span-12 md:col-span-8 lg:col-span-9'>
          <HeroTabs products={products} />
        </div>
      </div>
    </>
  )
}
