import { combineReducers } from '@reduxjs/toolkit'
import { authApi } from './apis/auth.api'
import { authSlice } from './slices/auth.slice'
import { categoryApi } from './apis/category.api'

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [authApi.reducerPath]: authApi.reducer,

  [categoryApi.reducerPath]: categoryApi.reducer
})

export default rootReducer
