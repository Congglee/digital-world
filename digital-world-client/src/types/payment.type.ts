export interface PaymentMethod {
  _id: string
  name: string
  image: string
  is_actived: boolean
  description: string
  createdAt: string
  updatedAt: string
}

export interface PaymentMethodList {
  payment_methods: PaymentMethod[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}
