import { createSlice } from '@reduxjs/toolkit'

interface BrandSliceState {
  brandsOptions: { label: string; value: string }[]
}

const initialState: BrandSliceState = {
  brandsOptions: []
}

export const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setBrandsOptionsFilter: (state, action) => {
      state.brandsOptions = action.payload
    }
  }
})

export const { setBrandsOptionsFilter } = brandSlice.actions
