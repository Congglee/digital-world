import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ExtendedPurchaseCart } from 'src/types/cart.type'

interface CartSliceState {
  extendedPurchasesCart: ExtendedPurchaseCart[]
}

const initialState: CartSliceState = {
  extendedPurchasesCart: []
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setExtendedPurchasesCart: (state, action: PayloadAction<ExtendedPurchaseCart[]>) => {
      state.extendedPurchasesCart = action.payload
    }
  }
})

export const { setExtendedPurchasesCart } = cartSlice.actions
