import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import rootReducer from 'src/redux/root.reducer'
import { store } from 'src/redux/store'

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type DispatchFunc = () => AppDispatch

export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
