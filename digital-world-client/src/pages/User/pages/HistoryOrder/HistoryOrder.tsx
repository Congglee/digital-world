import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import omit from 'lodash/omit'
import { createSearchParams, Link } from 'react-router-dom'
import path from 'src/constants/path'
import { ordersStatus } from 'src/constants/purchase'
import useQueryParams from 'src/hooks/useQueryParams'
import { useGetMyOrdersQuery } from 'src/redux/apis/order.api'
import { orderStatusFilter } from 'src/types/utils.type'
import { cn, formatCurrency } from 'src/utils/utils'

const orderTabs = [
  { status: ordersStatus.all, name: 'Tất cả' },
  { status: ordersStatus.waitForConfirmation, name: 'Chờ xác nhận' },
  { status: ordersStatus.inProgress, name: 'Chờ lấy hàng' },
  { status: ordersStatus.delivering, name: 'Đang giao' },
  { status: ordersStatus.deliveredSuccessfully, name: 'Đã giao' },
  { status: ordersStatus.cancelled, name: 'Đã hủy' }
]

export default function HistoryOrder() {
  const queryParams: { status?: string } = useQueryParams()
  const status: string = queryParams.status || ordersStatus.all
  const { data: historyOrdersData } = useGetMyOrdersQuery({ status: status as orderStatusFilter })

  const historyOrders = historyOrdersData?.data.orders || []

  const orderTabsLink = orderTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.historyOrder,
        search: createSearchParams(tab.status ? { status: String(tab.status) } : omit(queryParams, 'status')).toString()
      }}
      className={cn('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
        'border-b-purple text-purple': status === tab.status,
        'border-b-black/10 text-gray-900': status !== tab.status
      })}
    >
      {tab.name}
    </Link>
  ))

  return (
    <>
      <div className='overflow-x-auto'>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 flex border-t border-x rounded-t-sm shadow-sm'>{orderTabsLink}</div>
          <div className='mt-6 relative overflow-x-auto shadow-md rounded-sm'>
            <table className='w-full text-sm text-left rtl:text-right text-gray-500 border'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    Đơn hàng
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Ngày đặt
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Trạng thái đơn hàng
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Số lượng
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Tổng tiền
                  </th>
                  <th scope='col' className='px-6 py-3' />
                </tr>
              </thead>
              <tbody>
                {historyOrders.map((order) => (
                  <tr
                    className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'
                    key={order._id}
                  >
                    <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                      <Link
                        to={path.orderDetail.replace(':order_code', order.order_code)}
                        className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border border-purple text-purple hover:bg-purple hover:text-white h-10 px-4 py-2'
                      >
                        {order.order_code}
                      </Link>
                    </th>
                    <td className='px-6 py-4'>{format(order.date_of_order, 'dd MMMM yyyy', { locale: vi })}</td>
                    <td className='px-6 py-4'>{order.order_status}</td>
                    <td className='px-6 py-4'>x {order.products.reduce((total, item) => total + item.buy_count, 0)}</td>
                    <td className='px-6 py-4'>{formatCurrency(order.total_amount)}₫</td>
                    <td className='px-6 py-4'>
                      <button
                        type='button'
                        className='text-red-600 hover:text-white border border-red-600 hover:bg-red-700 focus:ring-2 focus:outline-none focus:ring-red-400 font-semibold rounded-lg text-sm px-5 py-2.5 text-center'
                      >
                        Hủy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
