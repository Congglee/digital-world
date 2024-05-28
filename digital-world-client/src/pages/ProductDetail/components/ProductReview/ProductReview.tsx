import { yupResolver } from '@hookform/resolvers/yup'
import { format } from 'date-fns'
import { PlusCircle, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from 'src/components/Button'
import ConfirmModal from 'src/components/ConfirmModal'
import ProductRating from 'src/components/ProductRating'
import path from 'src/constants/path'
import { usePagination } from 'src/hooks/usePagination'
import { useDeleteRatingMutation, useRatingProductMutation } from 'src/redux/apis/product.api'
import { useAppSelector } from 'src/redux/hook'
import { Product, Rating } from 'src/types/product.type'
import { RatingSchema, ratingSchema } from 'src/utils/rules'
import { cn, getAvatarUrl } from 'src/utils/utils'

interface ProductReviewProps {
  product: Product
}

type FormData = Pick<RatingSchema, 'star' | 'comment'>
const ratingProductSchema = ratingSchema.pick(['star', 'comment'])

export default function ProductReview({ product }: ProductReviewProps) {
  const { isAuthenticated, profile } = useAppSelector((state) => state.auth)
  const form = useForm<FormData>({
    resolver: yupResolver(ratingProductSchema),
    defaultValues: { star: 0, comment: '' }
  })
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset
  } = form

  const [hoverStar, setHoverStar] = useState<number>(0)
  const [reviewFormActive, setReviewFormActive] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const [ratingProduct, ratingProductResult] = useRatingProductMutation()
  const [deleteRating, deleteRatingResult] = useDeleteRatingMutation()
  const { data: productRatings, nextPage, page, totalPages } = usePagination(product.ratings, 3)

  const userRating = profile && (product.ratings.find((rating) => rating.posted_by === profile._id) as Rating) // No more memo 😃

  const ratingPercentages = useMemo(() => {
    const totalRatings = product.ratings.length
    if (totalRatings === 0) {
      return Array(5).fill(0)
    }
    return [5, 4, 3, 2, 1].reduce((acc, curr) => {
      const count = product.ratings.filter((rating) => rating.star === curr).length
      acc[curr - 1] = Math.round((count / totalRatings) * 100)
      return acc
    }, Array<number>(5).fill(0))
  }, [product.ratings])

  useEffect(() => {
    if (userRating) {
      setValue('star', userRating.star)
      setValue('comment', userRating.comment)
      setHoverStar(userRating.star)
    }
  }, [userRating])

  const handleActiveReviewForm = () => {
    if (isAuthenticated) {
      setReviewFormActive(!reviewFormActive)
    } else {
      navigate(path.login)
    }
  }

  const closeModal = () => {
    setOpen(false)
  }

  const handleDeleteRating = async (productId: string, ratingId: string) => {
    await deleteRating({ product_id: productId, rating_id: ratingId })
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      await ratingProduct({ ...data, product_id: product._id })
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (ratingProductResult.isSuccess) {
      toast.success(ratingProductResult.data?.data.message)
    }
  }, [ratingProductResult.isSuccess])

  useEffect(() => {
    if (deleteRatingResult.isSuccess) {
      toast.success(deleteRatingResult.data?.data.message)
      closeModal()
      reset({ star: 0, comment: '' })
      setHoverStar(0)
    }
  }, [deleteRatingResult.isSuccess])

  return (
    <>
      <div className='text-[#505050] text-sm w-full relative'>
        <h2 className='text-xl font-semibold uppercase mb-[10px]'>Đánh giá & Nhận xét của {product.name}</h2>
        <div className='flex flex-col gap-0.5'>
          <ProductRating
            rating={product.total_ratings}
            wrapperClassname='gap-0.5'
            activeClassname='w-3.5 h-3.5 fill-[#ffd200] text-[#ffd200]'
            nonActiveClassname='w-3.5 h-3.5 fill-current text-gray-300'
          />
          <span>Dựa trên {product.ratings.length} đánh giá</span>
          <div className='py-5 space-y-4'>
            {[5, 4, 3, 2, 1].map((stars) => (
              <div className='flex items-center' key={stars}>
                <div className='flex items-center justify-between flex-shrink-0 w-full max-w-7 gap-1'>
                  <span className='text-sm font-medium'>{stars}</span>
                  <Star className='size-4 text-[#ffd200]' fill='#ffd200' />
                </div>
                <div className='group relative w-full max-w-screen-sm h-5 mx-4 bg-gray-200 rounded cursor-pointer'>
                  <div
                    className={cn('h-5 rounded', ratingPercentages[stars - 1] > 0 ? 'bg-yellow-300' : 'bg-gray-200')}
                    style={{ width: `${ratingPercentages[stars - 1]}%` }}
                  />
                  <span className='absolute bottom-6 left-1/2 -translate-x-1/2 scale-0 transition-all rounded bg-purple/80 p-2 text-xs text-white group-hover:scale-100 z-10'>
                    {product.ratings.filter((rating) => rating.star === stars).length} đánh giá
                  </span>
                </div>
                <div className='w-full max-w-10 text-[13px] font-medium text-gray-500'>
                  {ratingPercentages[stars - 1]}%
                </div>
              </div>
            ))}
          </div>
          <button
            className='text-purple text-left w-full max-w-fit hover:text-[#1c1d1d]'
            onClick={handleActiveReviewForm}
          >
            Gửi đánh giá của bạn
          </button>
        </div>
        {reviewFormActive && (
          <div className='border-t border-[#ECECEC] py-6 mt-6'>
            <h3 className='text-base leading-6 font-semibold mb-2'>Gửi đánh giá</h3>
            <form className='flex flex-col gap-[15px]' onSubmit={onSubmit}>
              <div className='space-y-0.5'>
                <label htmlFor=''>Đánh giá</label>
                <Controller
                  name='star'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className='flex items-center gap-1'>
                      {[...Array(5)].map((_, index) => {
                        const starIndex = (index += 1)
                        return (
                          <button
                            type='button'
                            key={starIndex}
                            onClick={() => onChange(starIndex)}
                            onDoubleClick={() => {
                              onChange(0)
                              setHoverStar(0)
                            }}
                            onMouseEnter={() => setHoverStar(starIndex)}
                            onMouseLeave={() => setHoverStar(value)}
                          >
                            <Star
                              className={cn(
                                'w-3.5 h-3.5 text-[#ffd200]',
                                starIndex <= ((value && hoverStar) || hoverStar) && 'fill-[#ffd200]'
                              )}
                            />
                          </button>
                        )
                      })}
                    </div>
                  )}
                />
                <div className='text-red-600 text-[13px]'>{errors.star?.message}</div>
              </div>
              <div className='space-y-0.5'>
                <label htmlFor='comment'>Nhận xét</label>
                <textarea
                  {...register('comment')}
                  id='comment'
                  className='w-full bg-[#f6f6f6] text-[#1c1d1d] transition-all duration-400 ease-out px-[10px] py-2 border-transparent'
                  rows={10}
                  placeholder='Nhận xét của bạn...'
                />
                <div className='text-red-600 text-[13px]'>{errors.comment?.message}</div>
              </div>
              <div className='ml-0 xs:ml-auto flex flex-col xs:flex-row xs:items-center gap-2'>
                <Button
                  className='px-[15px] py-[11px] bg-purple uppercase text-white hover:bg-[#333] transition-colors duration-150 ease-out flex items-center justify-center gap-2'
                  type='submit'
                  disabled={ratingProductResult.isLoading}
                  isLoading={ratingProductResult.isLoading}
                >
                  Xác nhận
                </Button>
                <Button
                  className='px-[15px] py-[11px] bg-[#09090b] uppercase text-white hover:bg-[#09090b]/80 transition-colors duration-150 ease-out flex items-center justify-center gap-2'
                  type='button'
                  onClick={() => {
                    if (userRating) {
                      reset({ comment: userRating.comment, star: userRating.star })
                      setHoverStar(userRating.star)
                    } else {
                      reset()
                      setHoverStar(0)
                    }
                  }}
                >
                  Hủy
                </Button>
                {userRating && (
                  <Button
                    className='px-[15px] py-[11px] bg-[#7f1d1d] uppercase text-white hover:bg-[#7f1d1d]/80 transition-colors duration-150 ease-out flex items-center justify-center gap-2'
                    type='button'
                    onClick={() => setOpen(true)}
                  >
                    Xóa
                  </Button>
                )}
              </div>
            </form>
          </div>
        )}
        {productRatings
          .filter((rating) => rating.publish)
          .map((rating) => (
            <div className='border-t border-[#ECECEC] py-6 mt-6' key={rating._id}>
              <div className='space-y-2 mb-[14px]'>
                <ProductRating
                  rating={rating.star}
                  wrapperClassname='gap-0.5'
                  activeClassname='w-3.5 h-3.5 fill-[#ffd200] text-[#ffd200]'
                  nonActiveClassname='w-3.5 h-3.5 fill-current text-gray-300'
                />
                <div className='flex items-center gap-2'>
                  <div className='flex-shrink-0 size-10 rounded-full overflow-hidden'>
                    <img src={getAvatarUrl(rating.user_avatar)} alt='avatar' className='w-full h-full object-cover' />
                  </div>
                  <div className='flex-1'>
                    <span className='font-bold italic'>{rating.user_name}</span> vào{' '}
                    <span className='font-bold italic'>{format(rating.date, 'dd/MM/yyyy')}</span>
                  </div>
                </div>
              </div>
              <p className='mb-6 leading-5'>{rating.comment}</p>
              <button className='mb-[10px] text-purple text-[11px] w-full text-right hover:text-black'>
                Báo cáo là không phù hợp
              </button>
            </div>
          ))}
        {page + 1 < totalPages && (
          <div
            className='absolute bottom-0 right-0 left-0 w-full h-[130px] pt-[85px] bg-gradient-to-b from-0% from-[#ffffff00] via-50% via-[#ffffffe8] to-55% to-[#fff]'
            onClick={nextPage}
          >
            <button className='animate-bounce text-purple text-sm px-[10px] h-7 border border-purple rounded-sm leading-6 flex mx-auto items-center gap-1'>
              Xem thêm
              <PlusCircle className='size-4' />
            </button>
          </div>
        )}
      </div>
      <ConfirmModal
        open={open}
        closeModal={closeModal}
        title='Bạn có chắc là muốn xóa đánh giá của bạn chứ?'
        description='Đánh giá sản phẩm sau bị xóa sẽ không thể khôi phục được'
        loading={deleteRatingResult.isLoading}
        handleConfirm={() => {
          if (!deleteRatingResult.isLoading) {
            userRating && handleDeleteRating(product._id, userRating._id)
          }
        }}
      />
    </>
  )
}
