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

  ratingDashboard: '/dashboard/ratings',
  detailRatingDashboard: '/dashboard/ratings/:product_id',

  orderDashBoard: '/dashboard/orders',
  updateUserOrder: '/dashboard/orders/:order_id',
  sendMailOrder: '/dashboard/orders/send-mail/:order_id',

  settingsDashboard: '/dashboard/settings',
  settingsSendMail: '/dashboard/settings/mail',
  settingsAppearance: '/dashboard/settings/appearance'
} as const

export default path
