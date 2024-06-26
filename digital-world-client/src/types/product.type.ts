export interface Rating {
  _id: string
  star: number
  posted_by: string
  user_name: string
  user_avatar: string
  comment: string
  date: string
  publish: boolean
}

export interface Product {
  _id: string
  name: string
  thumb: string
  images: string[]
  overview: string
  description: string
  category: {
    _id: string
    name: string
  }
  price: number
  price_before_discount: number
  quantity: number
  sold: number
  ratings: Rating[]
  total_ratings: number
  view: number
  brand: string
  is_featured: boolean
  is_actived: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductList {
  products: Product[]
  total_products: number
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}
