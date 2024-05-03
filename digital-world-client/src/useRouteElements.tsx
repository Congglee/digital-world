import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { allowedRoles } from './constants/data'
import path from './constants/path'
import DashboardLayout from './layouts/DashboardLayout'
import MainLayout from './layouts/MainLayout'
import BrandList from './pages/DashBoard/pages/Brand/BrandList'
import CategoryList from './pages/DashBoard/pages/Category/CategoryList'
import OrderList from './pages/DashBoard/pages/Order/OrderList'
import SendMailOrder from './pages/DashBoard/pages/Order/SendMailOrder'
import UpdateUserOrder from './pages/DashBoard/pages/Order/UpdateUserOrder'
import Overview from './pages/DashBoard/pages/Overview'
import AddProduct from './pages/DashBoard/pages/Product/AddProduct'
import ProductListDashboard from './pages/DashBoard/pages/Product/ProductList'
import UpdateProduct from './pages/DashBoard/pages/Product/UpdateProduct'
import RatingList from './pages/DashBoard/pages/Rating/RatingList'
import UserList from './pages/DashBoard/pages/User/UserList'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import { useAppSelector } from './redux/hook'
import RatingDetail from './pages/DashBoard/pages/Rating/RatingDetail'
import SettingsLayout from './pages/DashBoard/pages/Settings/layouts/SettingsLayout'
import SettingsProfile from './pages/DashBoard/pages/Settings/pages/SettingsProfile'
import SettingsSendMail from './pages/DashBoard/pages/Settings/pages/SettingsSendMail'
import SettingsAppearance from './pages/DashBoard/pages/Settings/pages/SettingsAppearance'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'

function ProtectedRoute() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function ProtectedDashboardRoute() {
  const { profile } = useAppSelector((state) => state.auth)
  const isAllowedRole = profile.roles.some((role: string) => allowedRoles.includes(role))

  return isAllowedRole ? <Outlet /> : <Navigate to={path.home} />
}

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
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: <ProtectedDashboardRoute />,
          children: [
            {
              path: path.dashboard,
              element: <DashboardLayout />,
              children: [
                {
                  index: true,
                  element: <Overview />
                },
                {
                  path: path.categoryDashboard,
                  element: <CategoryList />
                },
                {
                  path: path.brandDashBoard,
                  element: <BrandList />
                },
                {
                  path: path.userDashBoard,
                  element: <UserList />
                },
                {
                  path: path.productsDashboard,
                  element: <ProductListDashboard />
                },
                {
                  path: path.addProduct,
                  element: <AddProduct />
                },
                {
                  path: path.updateProduct,
                  element: <UpdateProduct />
                },
                {
                  path: path.ratingDashboard,
                  element: <RatingList />
                },
                {
                  path: path.detailRatingDashboard,
                  element: <RatingDetail />
                },
                {
                  path: path.orderDashBoard,
                  element: <OrderList />
                },
                {
                  path: path.updateUserOrder,
                  element: <UpdateUserOrder />
                },
                {
                  path: path.sendMailOrder,
                  element: <SendMailOrder />
                },
                {
                  path: path.settingsDashboard,
                  element: <SettingsLayout />,
                  children: [
                    {
                      index: true,
                      element: <SettingsProfile />
                    },
                    {
                      path: path.settingsSendMail,
                      element: <SettingsSendMail />
                    },
                    {
                      path: path.settingsAppearance,
                      element: <SettingsAppearance />
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: path.products,
          element: <ProductList />
        },
        {
          path: path.productDetail,
          element: <ProductDetail />
        }
      ]
    }
  ])
  return routeElements
}
