import BlogPostSection from 'src/pages/Home/components/BlogPostSection'
import BrandsSection from 'src/pages/Home/components/BrandsSection'
import FeaturedProductsSection from 'src/pages/Home/components/FeaturedProductsSection'
import HeroSection from 'src/pages/Home/components/HeroSection'
import HotCollectionsSection from 'src/pages/Home/components/HotCollectionsSection'
import NewArrivalsSection from 'src/pages/Home/components/NewArrivalsSection'
import { useGetAllBrandsQuery } from 'src/redux/apis/brand.api'
import { useGetAllCategoriesQuery } from 'src/redux/apis/category.api'
import { useGetAllProductsQuery } from 'src/redux/apis/product.api'

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
