import { combineReducers } from '@reduxjs/toolkit'
import { authApi } from './apis/auth.api'
import { categoryApi } from './apis/category.api'
import { productApi } from './apis/product.api'
import { uploadApi } from './apis/upload.api'
import { authSlice } from './slices/auth.slice'
import { productSlice } from './slices/product.slice'
import { brandApi } from './apis/brand.api'
import { brandSlice } from './slices/brand.slice'
import { categorySlice } from './slices/category.slice'
import { userApi } from './apis/user.api'
import { locationApi } from './apis/location.api'

const rootReducer = combineReducers({
  [uploadApi.reducerPath]: uploadApi.reducer,
  [authSlice.name]: authSlice.reducer,
  [authApi.reducerPath]: authApi.reducer,

  [userApi.reducerPath]: userApi.reducer,

  [categorySlice.name]: categorySlice.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,

  [brandSlice.name]: brandSlice.reducer,
  [brandApi.reducerPath]: brandApi.reducer,

  [productSlice.name]: productSlice.reducer,
  [productApi.reducerPath]: productApi.reducer,

  [locationApi.reducerPath]: locationApi.reducer
})

export default rootReducer
