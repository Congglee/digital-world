const path = {
  home: '/',
  login: '/login',
  register: '/register',
  logout: '/logout',
  wishlist: '/wishlist',
  cart: '/cart',
  products: '/products',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  user: '/user',
  profile: '/user/profile',
  historyOrder: '/user/order',

  dashboard: '/dashboard',

  productsDashboard: '/dashboard/products',
  addProduct: '/dashboard/products/add',
  updateProduct: '/dashboard/products/update/:product_id',

  categoryDashboard: '/dashboard/categories',
  brandDashBoard: '/dashboard/brands',
  userDashBoard: '/dashboard/users',
  orderDashBoard: '/dashboard/orders',
  updateUserOrder: '/dashboard/orders/:order_id'
} as const

export default path
