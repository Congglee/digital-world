import { ConfigureStoreOptions, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
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
import rootReducer from 'src/redux/root.reducer'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: []
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
      locationApi.middleware,
      mailApi.middleware,
      paymentApi.middleware
    ])
} as ConfigureStoreOptions)

const persistor = persistStore(store)

export { persistor, store }
