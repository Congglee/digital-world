export const ORDER_STATUS = {
  IN_PROGRESS: "Đang xử lý",
  PROCESSED: "Đã xử lý",
  SUCCESS: "Thành công",
  CANCELLED: "Đã hủy",
};

export const DELIVERY_STATUS = {
  WAIT_FOR_CONFIRMATION: "Đợi xác nhận",
  DELIVERING: "Đang giao",
  DELIVERED_SUCCESSFULLY: "Đã giao thành công",
};

export const PAYMENT_STATUS = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
};

export const PAYMENT = {
  DIRECTLY: "Thanh toán trực tiếp khi nhận hàng",
  BANKING: "Thanh toán qua STK ngân hàng",
  STRIPE_GATE: "Thanh toán qua cổng Stripe",
};
