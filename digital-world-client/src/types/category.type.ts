export interface Category {
  _id: string
  name: string
  brands: {
    _id: string
    name: string
  }[]
  is_actived: boolean
  createdAt: string
  updatedAt: string
}

export interface CategoryList {
  categories: Category[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}
