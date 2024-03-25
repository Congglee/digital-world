import { createSlice } from '@reduxjs/toolkit'

interface CategorySliceState {
  categoriesOptions: { label: string; value: string }[]
}

const initialState: CategorySliceState = {
  categoriesOptions: []
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategoriesOptionsFilter: (state, action) => {
      state.categoriesOptions = action.payload
    }
  }
})

export const { setCategoriesOptionsFilter } = categorySlice.actions
