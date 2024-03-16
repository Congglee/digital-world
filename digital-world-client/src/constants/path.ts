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

  categoryDashboard: '/dashboard/categories',
  brandDashBoard: '/dashboard/brands',
  userDashBoard: '/dashboard/users',
  orderDashBoard: '/dashboard/orders'
} as const

export default path
