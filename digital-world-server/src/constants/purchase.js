export const ORDER_STATUS = {
  IN_PROGRESS: "Đang xử lý",
  PROCESSED: "Đã xử lý",
  SUCCESS: "Thành công",
  CANCELLED: "Đã hủy",
};

export const DELIVERY_STATUS = {
  WAIT_FOR_CONFIRMATION: "Đợi xác nhận",
  CONFIRMED: "Đã xác nhận",
  PRODUCT_DISPATCHED: "Đã chuyển hàng",
  DELIVERING: "Đang giao",
  DELIVERED_SUCCESSFULLY: "Đã giao thành công",
};

export const PAYMENT_STATUS = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
};

export const PAYMENT = {
  DIRECTLY: "Thanh toán trực tiếp khi nhận hàng",
  BANKING: "Thanh toán qua tài khoản ngân hàng",
  STRIPE_GATE_WAY: "Thanh toán qua cổng Stripe",
  PAYPAL_GATE_WAY: "Thanh toán qua cổng PayPal",
};
