export const ORDER_STATUS = {
  IN_PROGRESS: 0,
  SUCCESS: 1,
  CANCELLED: 2,
};

export const DELIVERY_STATUS = {
  WAIT_FOR_CONFIRMATION: 0,
  IN_PROGRESS: 1,
  ON_DELIVERY: 2,
  DELIVERED: 3,
};

export const PAYMENT_STATUS = {
  UNPAID: 0,
  PAID: 1,
};

export const PAYMENT = {
  DIRECTLY: 0,
  BANKING: 1,
  STRIPE_GATE: 2,
};
