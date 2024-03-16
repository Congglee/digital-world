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
  total_ratings: number
  view: number
  brand: string
  is_featured: boolean
  is_published: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductList {
  products: Product[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}
