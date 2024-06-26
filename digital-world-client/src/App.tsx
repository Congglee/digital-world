import { useAppDispatch } from 'src/redux/hook'
import { setAuthenticated, setProfile } from 'src/redux/slices/auth.slice'
import { setExtendedPurchasesCart } from 'src/redux/slices/cart.slice'
import { useEffect } from 'react'
import { LocalStorageEventTarget } from 'src/utils/auth'
import useRouteElements from 'src/useRouteElements'

function App() {
  const routeElements = useRouteElements()
  const dispatch = useAppDispatch()

  const reset = () => {
    dispatch(setAuthenticated(false))
    dispatch(setExtendedPurchasesCart([]))
    dispatch(setProfile(null))
  }

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)

    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return <>{routeElements}</>
}

export default App
