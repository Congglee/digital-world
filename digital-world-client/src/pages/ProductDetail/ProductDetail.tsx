import { MoveLeft } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from 'src/components/Breadcrumbs'
import path from 'src/constants/path'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useGetProductDetailQuery, useGetProductsQuery } from 'src/redux/apis/product.api'
import { ListConfig } from 'src/types/utils.type'
import { getIdFromNameId } from 'src/utils/utils'
import ProductDetailTabs from './components/ProductDetailTabs'
import ProductExtraInfomation from './components/ProductExtraInfomation/ProductExtraInfomation'
import ProductImages from './components/ProductImages'
import ProductInfomation from './components/ProductInfomation'
import RelateProducts from './components/RelateProducts'

export default function ProductDetail() {
  const queryConfig = useQueryConfig()
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const { data: productDetailData } = useGetProductDetailQuery(id)
  const { data: productsData } = useGetProductsQuery({ ...queryConfig, limit: 24 } as ListConfig)
  const product = productDetailData?.data.data
  const products = productsData?.data.products

  const relateProducts = useMemo(() => {
    if (!product || !products) return []
    return products.filter((p) => p.brand === product.brand && p._id !== product._id)
  }, [products, product])

  if (!product) return null

  return (
    <>
      <Breadcrumbs currentPageName={product.name} />
      <div className='container pt-5 pb-10'>
        <div className='grid grid-cols-12 md:gap-[45px]'>
          <div className='col-span-12 md:col-span-5'>
            <ProductImages product={product} />
          </div>
          <div className='col-span-12 md:col-span-7 grid grid-cols-3 gap-5 md:gap-0'>
            <div className='col-span-3 px-6 md:px-0 md:col-span-2'>
              <ProductInfomation product={product} />
            </div>
            <div className='col-span-3 md:col-span-1'>
              <ProductExtraInfomation />
            </div>
          </div>
        </div>
        <div className='mt-5 flex items-center justify-center'>
          <div className='flex items-center gap-1 text-sm text-[#151515] uppercase hover:text-purple'>
            <MoveLeft className='size-3.5' />
            <Link to={path.products}>Quay về trang sản phẩm</Link>
          </div>
        </div>
        <ProductDetailTabs product={product} nameId={nameId!} />
        <RelateProducts relateProducts={relateProducts} />
      </div>
    </>
  )
}
