import { Dialog, Transition } from '@headlessui/react'
import DOMPurify from 'dompurify'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import ProductImages from 'src/pages/ProductDetail/components/ProductImages'
import { useAddToCartMutation } from 'src/redux/apis/user.api'
import { Product } from 'src/types/product.type'
import { formatCurrency, generateNameId, scrollToTop } from 'src/utils/utils'

interface QuickViewModalProps {
  open: boolean
  closeModal: () => void
  product: Product
}

export default function QuickViewModal({ open, closeModal, product }: QuickViewModalProps) {
  const [buyCount, setBuyCount] = useState(1)
  const [addToCart, { data, isSuccess, isLoading }] = useAddToCartMutation()

  const handleBuyCount = useCallback((value: number) => {
    setBuyCount(value)
  }, [])

  const handleAddToCart = async () => {
    await addToCart({ product_id: product._id, buy_count: buyCount })
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message, { autoClose: 1000 })
    }
  }, [isSuccess])

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/30' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-8 text-center'>
            <div className='relative'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-[800px] transform overflow-hidden bg-white p-7 text-left align-middle shadow-xl transition-all grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div className='col-span-1'>
                    <ProductImages product={product} />
                  </div>
                  <div className='col-span-1'>
                    <h3 className='uppercase font-semibold text-lg mb-5 text-[#505050] hover:text-purple'>
                      <Link
                        to={`${path.products}/${generateNameId({ name: product.name, id: product._id })}`}
                        onClick={scrollToTop}
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <div
                      className='mb-4 text-sm text-[#505050] leading-6 line-clamp-[9]'
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(product.overview)
                      }}
                    />
                    <div className='space-x-2 mb-4 text-[#333] font-semibold text-xl'>
                      {product.price_before_discount !== 0 && (
                        <span className='text-[#999] line-through'>
                          {formatCurrency(product.price_before_discount)} VND
                        </span>
                      )}
                      <span>{formatCurrency(product.price)} VND</span>
                    </div>
                    <div className='flex flex-wrap items-center mb-4'>
                      <div className='text-[#151515] font-semibold text-sm'>Số lượng</div>
                      <QuantityController
                        onDecrease={handleBuyCount}
                        onIncrease={handleBuyCount}
                        onType={handleBuyCount}
                        value={buyCount}
                        max={product.quantity}
                        classNameWrapper='xs:ml-6'
                      />
                    </div>
                    <Button
                      className='bg-purple py-[11px] px-[15px] text-sm uppercase text-white hover:bg-[#333] transition-colors duration-150 ease-out mb-5 flex items-center justify-center gap-2'
                      onClick={handleAddToCart}
                      disabled={isLoading}
                      isLoading={isLoading}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </div>
                  <button
                    className='w-8 h-8 sm:w-10 sm:h-10 absolute top-0 right-0 text-center text-3xl text-[#1c1d1d] m-0 sm:m-1'
                    onClick={closeModal}
                  >
                    ×
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
