import { combineReducers } from '@reduxjs/toolkit'
import { authApi } from './apis/auth.api'
import { categoryApi } from './apis/category.api'
import { productApi } from './apis/product.api'
import { uploadApi } from './apis/upload.api'
import { authSlice } from './slices/auth.slice'
import { productSlice } from './slices/product.slice'

const rootReducer = combineReducers({
  [uploadApi.reducerPath]: uploadApi.reducer,
  [authSlice.name]: authSlice.reducer,
  [authApi.reducerPath]: authApi.reducer,

  [categoryApi.reducerPath]: categoryApi.reducer,

  [productApi.reducerPath]: productApi.reducer,
  [productSlice.name]: productSlice.reducer
})

export default rootReducer
