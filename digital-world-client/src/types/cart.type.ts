import { Product } from 'src/types/product.type'

export interface PurchaseCart {
  _id: string
  buy_count: number
  price: number
  price_before_discount: number
  product: Product
}

export interface ExtendedPurchaseCart extends PurchaseCart {
  disabled: boolean
  checked: boolean
}
