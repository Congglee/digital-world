import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from './constants/path'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { useAppSelector } from './redux/hook'
import Home from './pages/Home'
import Overview from './pages/DashBoard/pages/Overview'
import DashboardLayout from './layouts/DashboardLayout'
import CategoryList from './pages/DashBoard/pages/Category/CategoryList'
import ProductList from './pages/DashBoard/pages/Product/ProductList'
import AddProduct from './pages/DashBoard/pages/Product/AddProduct'
import UpdateProduct from './pages/DashBoard/pages/Product/UpdateProduct'

// function ProtectedRoute() {
//   const { isAuthenticated } = useAppSelector((state) => state.auth)
//   return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
// }

function RejectedRoute() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
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
            },
            {
              path: path.forgotPassword,
              element: <ForgotPassword />
            },
            {
              path: path.resetPassword,
              element: <ResetPassword />
            }
          ]
        }
      ]
    },
    {
      path: path.dashboard,
      element: <DashboardLayout />,
      children: [
        {
          path: path.dashboard,
          element: <Overview />
        },
        {
          path: path.categoryDashboard,
          element: <CategoryList />
        },
        {
          path: path.productsDashboard,
          element: <ProductList />
        },
        {
          path: path.addProduct,
          element: <AddProduct />
        },
        {
          path: path.updateProduct,
          element: <UpdateProduct />
        }
      ]
    },
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: '',
          index: true,
          element: <Home />
        }
      ]
    }
  ])
  return routeElements
}
