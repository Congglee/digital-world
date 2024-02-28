import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useRouteElements from './useRouteElements'

function App() {
  const routeElements = useRouteElements()

  return (
    <>
      {routeElements}
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
        className='text-[15px]'
      />
    </>
  )
}

export default App
