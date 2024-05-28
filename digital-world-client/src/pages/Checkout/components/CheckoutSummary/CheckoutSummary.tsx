import { useMemo } from 'react'
import { useGetMeQuery } from 'src/redux/apis/user.api'
import { formatCurrency } from 'src/utils/utils'

export default function CheckoutSummary() {
  const { data: profileData } = useGetMeQuery()
  const checkoutCart = profileData?.data.data.cart || []

  const totalPurchaseAmount = useMemo(() => {
    return checkoutCart.reduce((result, purchase) => result + purchase.price * purchase.buy_count, 0)
  }, [checkoutCart])

  return (
    <>
      <table className='w-full'>
        <tbody className='divide-y divide-[#e1e3e5] align-top'>
          {checkoutCart.map((purchase) => (
            <tr key={purchase._id}>
              <td className='py-4 pr-4 w-[60px]'>
                <div className='w-[58px] h-[58px] relative'>
                  <div className='border border-[#e1e3e5] rounded overflow-hidden'>
                    <img
                      src={purchase.product.thumb}
                      alt={`${purchase.product.name}-thumb`}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <span className='absolute w-5 h-5 -top-3 -right-3 bg-[#e1e3e5] rounded-full flex items-center justify-center text-xs'>
                    {purchase.buy_count}
                  </span>
                </div>
              </td>
              <td className='py-4 w-3/5'>
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
            <span>{checkoutCart.length} sản phẩm</span>
            <span className='pl-4'>{formatCurrency(totalPurchaseAmount)}₫</span>
          </div>
        </div>
        <div className='grid grid-cols-3 gap-[10px]'>
          <div className='col-span-1'>Vận chuyển</div>
          <div className='col-span-2 flex justify-between'>
            <span>Vận chuyển tiêu chuẩn</span>
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
