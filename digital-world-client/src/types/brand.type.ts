export interface Brand {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface BrandList {
  brands: Brand[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}
