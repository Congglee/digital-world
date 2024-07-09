import { useMemo } from 'react'
import { ExtendedPurchaseCart } from 'src/types/cart.type'
import { formatCurrency } from 'src/utils/utils'

export default function CheckoutSummary() {
  const checkoutPurchasesCart = JSON.parse(
    localStorage.getItem('checkout-purchases-cart') || '[]'
  ) as ExtendedPurchaseCart[]

  const totalPurchaseAmount = useMemo(() => {
    return checkoutPurchasesCart.reduce((result, purchase) => result + purchase.price * purchase.buy_count, 0)
  }, [checkoutPurchasesCart])

  return (
    <>
      <table className='w-full'>
        <tbody className='divide-y divide-[#e1e3e5] align-top'>
          {checkoutPurchasesCart.map((purchase) => (
            <tr key={purchase._id}>
              <td className='py-4 pr-4'>
                <div className='w-[58px] h-[58px] relative'>
                  <div className='border border-[#e1e3e5] rounded overflow-hidden'>
                    <img
                      src={purchase.product.thumb}
                      alt={purchase.product.name}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <span className='absolute w-5 h-5 -top-3 -right-3 bg-[#e1e3e5] rounded-full flex items-center justify-center text-xs'>
                    {purchase.buy_count}
                  </span>
                </div>
              </td>
              <td className='py-4'>
                <span className='font-semibold text-sm'>{purchase.product.name}</span>
              </td>
              <td className='py-4 pl-4 text-right'>
                <span>{formatCurrency(purchase.price * purchase.buy_count)}₫</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='border-t border-[#e1e3e5] py-4 space-y-[10px]'>
        <div className='grid grid-cols-3 gap-[10px]'>
          <div className='col-span-1'>Tổng phụ</div>
          <div className='col-span-2 flex justify-between'>
            <span>{checkoutPurchasesCart.reduce((total, item) => total + item.buy_count, 0)} sản phẩm</span>
            <span className='pl-4'>{formatCurrency(totalPurchaseAmount)}₫</span>
          </div>
        </div>
        <div className='grid grid-cols-3 gap-[10px]'>
          <div className='col-span-1'>Vận chuyển</div>
          <div className='col-span-2 flex justify-between'>
            <span>Giao hàng tiêu chuẩn</span>
            <span className='pl-4'>0.00₫</span>
          </div>
        </div>
      </div>
      <div className='border-t border-[#e1e3e5] py-4 flex justify-between'>
        <span className='font-bold'>Tổng cộng</span>
        <span className='font-bold text-xl'>{formatCurrency(totalPurchaseAmount)}₫</span>
      </div>
    </>
  )
}
