import { X } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Breadcrumbs from 'src/components/Breadcrumbs'
import path from 'src/constants/path'
import { useGetMeQuery, useRemoveFromWishListMutation } from 'src/redux/apis/user.api'
import { formatCurrency, generateNameId } from 'src/utils/utils'

export default function Wishlist() {
  const { data: profileData } = useGetMeQuery()
  const profile = profileData?.data.data
  const [removeFromWishList, { data, isSuccess, isLoading }] = useRemoveFromWishListMutation()

  const handleRemoveFromWishList = async (productId: string) => {
    await removeFromWishList(productId)
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message, { autoClose: 1000 })
    }
  }, [isSuccess])

  if (!profile) return null

  return (
    <>
      <Breadcrumbs currentPageName='Danh sách yêu thích' />
      <div className='py-5 container mb-10'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px] border border-[#f1f1f1] divide-y divide-[#f1f1f1]'>
            <div className='grid grid-cols-12 gap-5 py-[15px] px-5 uppercase text-sm'>
              <div className='col-span-2 pl-8'>Ảnh</div>
              <div className='col-span-4'>Tên</div>
              <div className='col-span-2 text-center'>Giá</div>
              <div className='col-span-2 text-center'>Xóa</div>
              <div className='col-span-2 text-center'>Chi tiết</div>
            </div>
            {profile.wishlist.map((product) => (
              <div className='grid grid-cols-12 gap-5 items-center py-[15px] px-5'>
                <div className='col-span-2'>
                  <img src={product.thumb} alt={product.name} className='w-full h-full object-cover' />
                </div>
                <div className='col-span-4'>
                  <Link
                    to={`${path.products}/${generateNameId({ name: product.name, id: product._id })}`}
                    className='text-[#1c1d1d] text-sm hover:text-purple'
                  >
                    {product.name}
                  </Link>
                </div>
                <div className='col-span-2 text-center'>
                  <div className='flex flex-wrap justify-center text-sm'>
                    <span>{formatCurrency(product.price)} VND</span>
                    {product.price_before_discount !== 0 && (
                      <span className='text-gray-500 line-through'>
                        {formatCurrency(product.price_before_discount)} VND
                      </span>
                    )}
                  </div>
                </div>
                <div className='col-span-2 text-center'>
                  <button disabled={isLoading} onClick={() => handleRemoveFromWishList(product._id)}>
                    <X className='size-4' />
                  </button>
                </div>
                <div className='col-span-2 text-center'>
                  <Link
                    to={`${path.products}/${generateNameId({ name: product.name, id: product._id })}`}
                    className='text-sm text-[#1c1d1d] hover:text-purple'
                  >
                    Xem thêm
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
