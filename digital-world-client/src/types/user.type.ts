export type Role = 'User' | 'Admin' | 'Guest' | 'Writer'

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
  cart: {
    product: {
      _id: string
      name: string
    }
    buy_count: number
    price: number
    price_before_discount: number
  }[]
  is_blocked: boolean
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
