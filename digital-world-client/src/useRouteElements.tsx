import { useRoutes } from 'react-router-dom'
import path from './constants/path'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Register from './pages/Register'

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: path.login,
          element: <Login />
        },
        {
          path: path.register,
          element: <Register />
        }
      ]
    }
  ])
  return routeElements
}
