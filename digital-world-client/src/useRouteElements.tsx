import { useRoutes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import path from './constants/path'

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: path.login,
          element: <Login />
        }
      ]
    }
  ])
  return routeElements
}
