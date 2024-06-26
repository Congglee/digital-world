import { combineReducers } from '@reduxjs/toolkit'
import { authApi } from 'src/redux/apis/auth.api'
import { brandApi } from 'src/redux/apis/brand.api'
import { categoryApi } from 'src/redux/apis/category.api'
import { locationApi } from 'src/redux/apis/location.api'
import { mailApi } from 'src/redux/apis/mail.api'
import { orderApi } from 'src/redux/apis/order.api'
import { paymentApi } from 'src/redux/apis/payment.api'
import { productApi } from 'src/redux/apis/product.api'
import { uploadApi } from 'src/redux/apis/upload.api'
import { userApi } from 'src/redux/apis/user.api'
import { appSlice } from 'src/redux/slices/app.slice'
import { authSlice } from 'src/redux/slices/auth.slice'
import { brandSlice } from 'src/redux/slices/brand.slice'
import { cartSlice } from 'src/redux/slices/cart.slice'
import { categorySlice } from 'src/redux/slices/category.slice'
import { productSlice } from 'src/redux/slices/product.slice'

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

  [cartSlice.name]: cartSlice.reducer,

  [paymentApi.reducerPath]: paymentApi.reducer
})

export default rootReducer
