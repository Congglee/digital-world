import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { RefreshCcw, ShoppingCart } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from 'src/components/ui/table'
import path from 'src/constants/path'
import { Order } from 'src/types/order.type'
import { Bill, Coupon } from 'src/components/Icons/Icons'
import { cn, formatCurrency } from 'src/utils/utils'

interface UserProfileOverviewProps {
  userOrders: Order[]
  userWishlistLength: number
  handleRefetch: () => void
  loading: boolean
}

export default function UserProfileOverview({
  userOrders,
  userWishlistLength,
  handleRefetch,
  loading
}: UserProfileOverviewProps) {
  const totalOrderAmount = useMemo(() => {
    return userOrders.reduce((acc, order) => acc + order.total_amount, 0)
  }, [userOrders])

  return (
    <div className='mt-[30px] space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 items-center'>
        <div className='p-[15px] shadow rounded-md border border-border flex items-center gap-[15px]'>
          <div className='flex-shrink-0 w-[60px] h-[60px] rounded-xl bg-[#88aaf3] flex items-center justify-center'>
            <Bill className='size-6 fill-foreground' />
          </div>
          <div className='flex-1 space-y-0.5'>
            <h4 className='text-lg font-semibold'>{userOrders.length}</h4>
            <p className='text-sm text-muted-foreground'>Đã Đặt</p>
          </div>
        </div>
        <div className='p-[15px] shadow rounded-md border border-border flex items-center gap-[15px]'>
          <div className='flex-shrink-0 w-[60px] h-[60px] rounded-xl bg-[#ddaa04] flex items-center justify-center'>
            <ShoppingCart className='size-6' />
          </div>
          <div className='flex-1 space-y-0.5'>
            <h4 className='text-lg font-semibold'>{userWishlistLength}</h4>
            <p className='text-sm text-muted-foreground'>Yêu Thích</p>
          </div>
        </div>
        <div className='p-[15px] shadow rounded-md border border-border flex items-center gap-[15px]'>
          <div className='flex-shrink-0 w-[60px] h-[60px] rounded-xl bg-[#34c997] flex items-center justify-center'>
            <Coupon className='size-6' />
          </div>
          <div className='flex-1 space-y-0.5'>
            <h4 className='text-lg font-semibold'></h4>
            <p className='text-sm text-muted-foreground'>Chức năng đang được nâng cấp</p>
          </div>
        </div>
      </div>
      <div className='shadow rounded-md border border-border'>
        <div className='px-[15px] py-5 border-b border-border flex justify-between items-center'>
          <h2 className='capitalize text-lg font-semibold'>Đơn mua</h2>
          <button disabled={loading} className={cn(loading && 'animate-spin')} onClick={handleRefetch}>
            <RefreshCcw className='size-4' />
          </button>
        </div>
        <div className='p-[15px] h-[430px] overflow-y-auto'>
          <Table>
            <TableCaption>Danh sách các đơn hàng người dùng đã đặt.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>Mã đơn hàng</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead className='text-right'>Tổng tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userOrders.length ? (
                userOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className='font-medium'>
                      <Link to={`${path.orderDashBoard}/${order._id}`} className='hover:underline'>
                        {order.order_code}
                      </Link>
                    </TableCell>
                    <TableCell>{format(order.date_of_order, 'dd/MM/yyyy', { locale: vi })}</TableCell>
                    <TableCell>{order.order_status}</TableCell>
                    <TableCell>{order.products.length} sản phẩm</TableCell>
                    <TableCell className='text-right'>{formatCurrency(order.total_amount)}đ</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className='h-20 text-center'>
                    Người dùng chưa đặt đơn hàng nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Tổng cộng</TableCell>
                <TableCell className='text-right'>{formatCurrency(totalOrderAmount)}đ</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  )
}
