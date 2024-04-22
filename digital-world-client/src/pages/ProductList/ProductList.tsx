import { useState } from 'react'
import AsideFilter from 'src/components/AsideFilter'
import Breadcrumbs from 'src/components/Breadcrumbs'
import CategorySideFilter from 'src/components/CategorySideFilter'
import Pagination from 'src/components/Pagination'
import ProductCard from 'src/components/ProductCard'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useGetAllBrandsQuery } from 'src/redux/apis/brand.api'
import { useGetAllCategoriesQuery } from 'src/redux/apis/category.api'
import { useGetProductsQuery } from 'src/redux/apis/product.api'
import { ListConfig } from 'src/types/utils.type'
import { FilterIcon } from 'src/utils/icons'
import FilterDrawer from './components/FilterDrawer'

export default function ProductList() {
  const queryConfig = useQueryConfig()
  const { data: categoriesData } = useGetAllCategoriesQuery()
  const { data: productsData } = useGetProductsQuery({ ...queryConfig, limit: 24 } as ListConfig)
  const { data: brandsData } = useGetAllBrandsQuery()
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false)

  return (
    <>
      <Breadcrumbs />
      <div className='py-5 container'>
        <div className='grid grid-cols-12 gap-6 mb-10'>
          <button
            className='flex md:hidden col-span-12 border border-[#696969] text-sm px-5 text-[#445958] items-center justify-center h-10'
            onClick={() => setFilterDrawerOpen(true)}
          >
            <FilterIcon className='size-10' />
            <span>Lọc và sắp xếp</span>
          </button>
          <div className='col-span-12 order-last lg:order-first lg:col-span-3 space-y-5'>
            <CategorySideFilter queryConfig={queryConfig} categories={categoriesData?.data.categories || []} />
            <AsideFilter queryConfig={queryConfig} brands={brandsData?.data.brands || []} />
            <img
              src='https://res.cloudinary.com/di3eto0bg/image/upload/v1695240655/ecommerce-techshop/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_300x_f6od9g.jpg'
              alt='aside image'
              className='w-full object-cover'
            />
          </div>
          <div className='col-span-12 lg:col-span-9'>
            <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-5'>
              {productsData &&
                productsData.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <ProductCard
                      product={product}
                      actionButtonsClassname='justify-start'
                      overviewClassname='line-clamp-[9]'
                    />
                  </div>
                ))}
            </div>
            {productsData && productsData.data.products.length > 0 && (
              <Pagination queryConfig={queryConfig} pageSize={productsData?.data.pagination.page_size || 1} />
            )}
          </div>
        </div>
      </div>
      <FilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        limitProducts={productsData?.data.products.length!}
        totalProducts={productsData?.data.total_products!}
        queryConfig={queryConfig}
        brands={brandsData?.data.brands || []}
      />
    </>
  )
}
