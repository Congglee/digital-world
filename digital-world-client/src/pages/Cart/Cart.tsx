import isEqual from 'lodash/isEqual'
import keyBy from 'lodash/keyBy'
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from 'src/components/Breadcrumbs'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { useDeleteProductsCartMutation, useGetMeQuery, useUpdateUserCartMutation } from 'src/redux/apis/user.api'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { setExtendedPurchasesCart } from 'src/redux/slices/cart.slice'
import { ExtendedPurchaseCart } from 'src/types/cart.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

export default function Cart() {
  const { extendedPurchasesCart } = useAppSelector((state) => state.cart)
  const { data: profileData } = useGetMeQuery()
  const userCart = (profileData?.data.data.cart as ExtendedPurchaseCart[]) || []

  const [updateCart] = useUpdateUserCartMutation()
  const [deleteProductsCart] = useDeleteProductsCartMutation()

  const isAllChecked = useMemo(
    () => extendedPurchasesCart.every((purchase) => purchase.checked),
    [extendedPurchasesCart]
  )
  const checkedPurchases = useMemo(
    () => extendedPurchasesCart.filter((purchase) => purchase.checked),
    [extendedPurchasesCart]
  )

  const dispatch = useAppDispatch()
  const checkedPurchasesCount = checkedPurchases.length
  const totalCheckedPurchasePrice = useMemo(
    () =>
      extendedPurchasesCart.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [extendedPurchasesCart]
  )
  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      extendedPurchasesCart.reduce((result, current) => {
        const { price_before_discount, price } = current.product
        const discount = price_before_discount - price
        if (discount > 0) {
          return result + discount * current.buy_count
        }
        return result
      }, 0),
    [extendedPurchasesCart]
  )

  useEffect(() => {
    const extendedPurchasesObject = keyBy(extendedPurchasesCart, '_id')
    const newPurchasesCart =
      userCart.map((purchase) => {
        return {
          ...purchase,
          disabled: false,
          checked: Boolean(extendedPurchasesObject[purchase._id]?.checked)
        }
      }) || []

    if (!isEqual(newPurchasesCart, extendedPurchasesCart)) {
      dispatch(setExtendedPurchasesCart(newPurchasesCart))
      localStorage.setItem('checkout-purchases-cart', JSON.stringify(newPurchasesCart))
    }
  }, [userCart])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newExtendedPurchasesCart = extendedPurchasesCart.map((purchase, index) =>
      index === purchaseIndex ? { ...purchase, checked: event.target.checked } : purchase
    )
    dispatch(setExtendedPurchasesCart(newExtendedPurchasesCart))
  }

  const handleCheckAll = () => {
    const newExtendedPurchasesCart = extendedPurchasesCart.map((purchase) => ({
      ...purchase,
      checked: !isAllChecked
    }))
    dispatch(setExtendedPurchasesCart(newExtendedPurchasesCart))
  }

  const handleQuantity = async (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const newExtendedPurchasesCart = extendedPurchasesCart.map((purchase, index) =>
        index === purchaseIndex ? { ...purchase, disabled: true } : purchase
      )
      dispatch(setExtendedPurchasesCart(newExtendedPurchasesCart))
      await updateCart({ product_id: extendedPurchasesCart[purchaseIndex].product._id, buy_count: value })
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    const newExtendedPurchasesCart = extendedPurchasesCart.map((purchase, index) =>
      index === purchaseIndex ? { ...purchase, buy_count: value } : purchase
    )
    dispatch(setExtendedPurchasesCart(newExtendedPurchasesCart))
  }

  const handleDeleteProductCart = (purchaseIndex: number) => async () => {
    const productPurchaseId = extendedPurchasesCart[purchaseIndex].product._id
    await deleteProductsCart([productPurchaseId])
  }

  const handleDeleteManyProductsCart = async () => {
    const productPurchasesIds = checkedPurchases.map((purchase) => purchase.product._id)
    await deleteProductsCart(productPurchasesIds)
  }

  return (
    <>
      <Breadcrumbs currentPageName='Giỏ hàng' />
      <div className='py-5 container'>
        {extendedPurchasesCart.length > 0 ? (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-neutral-100 py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-purple'
                          checked={isAllChecked}
                          onChange={handleCheckAll}
                        />
                      </div>
                      <div className='flex-grow text-black'>Sản phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Đơn giá</div>
                      <div className='col-span-1'>Số lượng</div>
                      <div className='col-span-1'>Số tiền</div>
                      <div className='col-span-1'>Thao tác</div>
                    </div>
                  </div>
                </div>
                {extendedPurchasesCart.length > 0 && (
                  <div className='my-3 rounded-sm bg-white shadow'>
                    {extendedPurchasesCart.map((purchase, index) => (
                      <div
                        key={purchase._id}
                        className='grid items-center grid-cols-12 text-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-sm text-gray-500 first:mt-0 mt-5'
                      >
                        <div className='col-span-6'>
                          <div className='flex'>
                            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                              <input
                                type='checkbox'
                                className='h-5 w-5 accent-purple'
                                checked={purchase.checked}
                                onChange={handleCheck(index)}
                              />
                            </div>
                            <div className='flex-grow'>
                              <div className='flex'>
                                <Link
                                  to={`${path.products}/${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                                  className='h-24 w-24 flex-shrink-0'
                                >
                                  <img
                                    src={purchase.product.thumb}
                                    alt={purchase.product.name}
                                    className='w-full h-full object-cover'
                                  />
                                </Link>
                                <div className='flex-grow px-2 pt-1 pb-2'>
                                  <Link
                                    to={`${path.products}/${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                                    className='line-clamp-2 text-left'
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-span-6'>
                          <div className='grid grid-cols-5 items-center'>
                            <div className='col-span-2'>
                              <div className='flex items-center justify-center'>
                                {purchase.product.price_before_discount > 0 && (
                                  <span className='text-gray-400 line-through'>
                                    đ{formatCurrency(purchase.product.price_before_discount)}
                                  </span>
                                )}
                                <span className='ml-3'>đ{formatCurrency(purchase.product.price)}</span>
                              </div>
                            </div>
                            <div className='col-span-1'>
                              <QuantityController
                                max={purchase.product.quantity}
                                value={purchase.buy_count}
                                classNameWrapper='xs:ml-0'
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                onType={handleTypeQuantity(index)}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value >= 1 &&
                                      value <= purchase.product.quantity &&
                                      value !== userCart[index].buy_count
                                  )
                                }
                                disabled={purchase.disabled}
                              />
                            </div>
                            <div className='col-span-1'>
                              <span className='text-orange'>
                                đ{formatCurrency(purchase.product.price * purchase.buy_count)}
                              </span>
                            </div>
                            <div className='col-span-1'>
                              <button
                                onClick={handleDeleteProductCart(index)}
                                className='bg-none text-black transition-colors hover:text-purple'
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='sticky bottom-0 z-10 flex flex-col sm:flex-row sm:items-center rounded-sm bg-neutral-100 p-5 shadow border border-gray-100 mt-7'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    className='h-5 w-5 accent-purple'
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                  />
                </div>
                <button className='mx-3 border-none bg-none' onClick={handleCheckAll}>
                  Chọn tất cả ({extendedPurchasesCart.length})
                </button>
                <button className='mx-3 border-none bg-none'>Đang chọn ({checkedPurchasesCount})</button>
                <button className='mx-3 border-none bg-none' onClick={handleDeleteManyProductsCart}>
                  Xóa
                </button>
              </div>
              <div className='sm:ml-auto flex flex-col sm:flex-row sm:items-center mt-5 sm:mt-0'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>Tổng thanh toán ({extendedPurchasesCart.length} sản phẩm):</div>
                    <div className='ml-2 text-2xl text-purple'>₫{formatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>
                  <div className='flex items-center sm:justify-end text-sm'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-6 text-purple'>₫{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                  </div>
                </div>
                <Link
                  to={path.checkoutProfile}
                  className='sm:ml-4 mt-5 sm:mt-0 h-10 w-52 text-center uppercase bg-purple text-white text-sm hover:bg-purple/80 flex justify-center items-center'
                >
                  Mua hàng
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='text-center text-[#505050] mb-[50px]'>
              <h1 className='font-semibold text-2xl mb-3'>Giỏ hàng của bạn</h1>
              <hr className='my-5 mx-auto w-[50px] border-t border-[#1c1d1d]' />
              <p className='text-sm mb-[10px]'>Giỏ hàng của bạn hiện đang trống.</p>
              <p className='text-sm'>
                Tiếp tục mua hàng{' '}
                <Link to={path.products} className='hover:text-purple'>
                  tại đây
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </>
  )
}
