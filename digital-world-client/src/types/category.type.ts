export interface Category {
  _id: string
  name: string
  brands: {
    _id: string
    name: string
  }[]
}

export interface CategoryList {
  categories: Category[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}
