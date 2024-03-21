import { createSlice } from '@reduxjs/toolkit'

interface ProductSliceState {
  selectedProducts: string[]
}

const initialState: ProductSliceState = {
  selectedProducts: []
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSelectedProducts: (state, action) => {
      state.selectedProducts = action.payload
    }
  }
})

export const { setSelectedProducts } = productSlice.actions
