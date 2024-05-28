import { combineReducers } from '@reduxjs/toolkit'
import { cartSlice } from 'src/redux/slices/cart.slice'
import { authApi } from './apis/auth.api'
import { brandApi } from './apis/brand.api'
import { categoryApi } from './apis/category.api'
import { locationApi } from './apis/location.api'
import { mailApi } from './apis/mail.api'
import { orderApi } from './apis/order.api'
import { productApi } from './apis/product.api'
import { uploadApi } from './apis/upload.api'
import { userApi } from './apis/user.api'
import { appSlice } from './slices/app.slice'
import { authSlice } from './slices/auth.slice'
import { brandSlice } from './slices/brand.slice'
import { categorySlice } from './slices/category.slice'
import { productSlice } from './slices/product.slice'

const rootReducer = combineReducers({
  [appSlice.name]: appSlice.reducer,

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

  [orderApi.reducerPath]: orderApi.reducer,

  [locationApi.reducerPath]: locationApi.reducer,

  [mailApi.reducerPath]: mailApi.reducer,

  [cartSlice.name]: cartSlice.reducer
})

export default rootReducer
