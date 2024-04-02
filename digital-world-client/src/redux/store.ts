import { ConfigureStoreOptions, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './root.reducer'
import { authApi } from './apis/auth.api'
import { categoryApi } from './apis/category.api'
import { productApi } from './apis/product.api'
import { uploadApi } from './apis/upload.api'
import { brandApi } from './apis/brand.api'
import { userApi } from './apis/user.api'
import { locationApi } from './apis/location.api'
import { orderApi } from './apis/order.api'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['']
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      uploadApi.middleware,
      authApi.middleware,
      userApi.middleware,
      categoryApi.middleware,
      brandApi.middleware,
      productApi.middleware,
      orderApi.middleware,
      locationApi.middleware
    ])
} as ConfigureStoreOptions)

const persistor = persistStore(store)

export { persistor, store }
