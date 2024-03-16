import { combineReducers } from '@reduxjs/toolkit'
import { authApi } from './apis/auth.api'
import { authSlice } from './slices/auth.slice'
import { categoryApi } from './apis/category.api'
import { productApi } from './apis/product.api'
import { uploadApi } from './apis/upload.api'

const rootReducer = combineReducers({
  [uploadApi.reducerPath]: uploadApi.reducer,
  [authSlice.name]: authSlice.reducer,
  [authApi.reducerPath]: authApi.reducer,

  [categoryApi.reducerPath]: categoryApi.reducer,
  [productApi.reducerPath]: productApi.reducer
})

export default rootReducer
