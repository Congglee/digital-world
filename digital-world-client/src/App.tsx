import { ToastContainer } from 'react-toastify'
import useRouteElements from './useRouteElements'

function App() {
  const routeElements = useRouteElements()

  return (
    <>
      {routeElements}
      <ToastContainer />
    </>
  )
}

export default App
