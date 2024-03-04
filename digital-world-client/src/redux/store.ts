import { ConfigureStoreOptions, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './root.reducer'
import { authApi } from './apis/auth.api'
import { categoryApi } from './apis/category.api'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['']
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([authApi.middleware, categoryApi.middleware])
} as ConfigureStoreOptions)

const persistor = persistStore(store)

export { persistor, store }
