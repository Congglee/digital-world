import { useGetAllCategoriesQuery } from 'src/redux/apis/category.api'
import { useGetAllProductsQuery } from 'src/redux/apis/product.api'
import BlogPostSection from './components/BlogPostSection'
import BrandsSection from './components/BrandsSection'
import FeaturedProductsSection from './components/FeaturedProductsSection'
import HeroSection from './components/HeroSection'
import HotCollectionsSection from './components/HotCollectionsSection'
import NewArrivalsSection from './components/NewArrivalsSection'
import { useGetAllBrandsQuery } from 'src/redux/apis/brand.api'

export default function Home() {
  const { data: categoriesData } = useGetAllCategoriesQuery()
  const { data: productsData } = useGetAllProductsQuery()
  const { data: brandsData } = useGetAllBrandsQuery()

  return (
    <div className='container py-5'>
      <HeroSection products={productsData?.data.products || []} categories={categoriesData?.data.categories || []} />
      <FeaturedProductsSection products={productsData?.data.products || []} />
      <NewArrivalsSection products={productsData?.data.products || []} />
      <HotCollectionsSection />
      <BlogPostSection />
      <BrandsSection brands={brandsData?.data.brands || []} />
    </div>
  )
}
