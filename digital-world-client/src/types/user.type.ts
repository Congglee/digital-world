export type Role = 'User' | 'Admin' | 'Guest' | 'Writer'

interface CartProductItem {
  _id: string
  name: string
  thumb: string
  category: {
    _id: string
    name: string
  }
  price: number
  price_before_discount: number
  quantity: number
}
interface CartItem {
  _id: string
  product: CartProductItem
  buy_count: number
  price: number
  price_before_discount: number
}

export interface User {
  _id: string
  name: string
  email: string
  roles: Role[]
  date_of_birth?: string // ISO8601
  avatar?: string
  address?: string
  province?: string
  district?: string
  ward?: string
  phone?: string
  wishlist: {
    _id: string
    name: string
  }[]
  cart: CartItem[]
  verify: number
  createdAt: string
  updatedAt: string
}

export interface UserList {
  users: User[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}
