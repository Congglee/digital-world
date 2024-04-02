export type OrderStatus = 'Đang xử lý' | 'Đã xử lý' | 'Thành công' | 'Đã hủy'
export type DeliveryStatus = 'Đợi xác nhận' | 'Đang giao' | 'Đã giao thành công'
export type PaymentStatus = 'Chưa thanh toán' | 'Đã thanh toán'
export type PaymentMethod =
  | 'Thanh toán trực tiếp khi nhận hàng'
  | 'Thanh toán qua STK ngân hàng'
  | 'Thanh toán qua cổng Stripe'

export interface Order {
  _id: string
  order_code: string
  order_by: {
    user_name: string
    user_email: string
    user_phone: string
    user_avatar: string
    user_id: string
  }
  products: {
    _id: string
    product_id: string
    product_name: string
    product_price: number
    product_thumb: string
    buy_count: number
  }[]
  order_status: OrderStatus
  delivery_status: DeliveryStatus
  payment_status: PaymentStatus
  total_amount: number
  delivery_at: string
  date_of_order: string
  order_phone: string
  order_note: string
  payment_method: PaymentMethod
  createdAt: string
  updatedAt: string
}

export interface OrderList {
  orders: Order[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}
