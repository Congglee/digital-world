export interface ListConfig {
  page?: number | string
  limit?: number | string
  sort_by?: 'createdAt' | 'view' | 'sold' | 'price'
  order?: 'asc' | 'desc'
  exclude?: string
  rating_filter?: number | string
  price_max?: number | string
  price_min?: number | string
  name?: string
  category?: string
  brand?: string
}

export interface UploadResponse {
  message: string
  data: { url: string }[]
}

export interface SuccessResponse<Data> {
  message: string
  data: Data
}

export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

export type NoUnderfinedField<T> = {
  [P in keyof T]-?: NoUnderfinedField<NonNullable<T[P]>>
}
