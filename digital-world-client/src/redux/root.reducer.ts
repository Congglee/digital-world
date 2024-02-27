import { combineReducers } from '@reduxjs/toolkit'
import { authApi } from './apis/auth.api'
import { authSlice } from './slices/auth.slice'

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [authApi.reducerPath]: authApi.reducer
})

export default rootReducer
