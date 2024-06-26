import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from 'src/constants/path'
import DashboardLayout from 'src/layouts/DashboardLayout'
import MainLayout from 'src/layouts/MainLayout'
import Cart from 'src/pages/Cart'
import CheckoutLayout from 'src/pages/Checkout/layout/CheckoutLayout'
import CheckoutPayment from 'src/pages/Checkout/pages/CheckoutPayment'
import CheckoutProfile from 'src/pages/Checkout/pages/CheckoutProfile'
import CheckoutSuccess from 'src/pages/Checkout/pages/CheckoutSuccess'
import BrandList from 'src/pages/DashBoard/pages/Brand/BrandList'
import CategoryList from 'src/pages/DashBoard/pages/Category/CategoryList'
import OrderList from 'src/pages/DashBoard/pages/Order/OrderList'
import SendMailOrder from 'src/pages/DashBoard/pages/Order/SendMailOrder'
import UpdateUserOrder from 'src/pages/DashBoard/pages/Order/UpdateUserOrder'
import Overview from 'src/pages/DashBoard/pages/Overview/components/OverviewChart/OverviewChart'
import AddProduct from 'src/pages/DashBoard/pages/Product/AddProduct'
import UpdateProduct from 'src/pages/DashBoard/pages/Product/UpdateProduct'
import RatingDetail from 'src/pages/DashBoard/pages/Rating/RatingDetail'
import RatingList from 'src/pages/DashBoard/pages/Rating/RatingList'
import SettingsLayout from 'src/pages/DashBoard/pages/Settings/layouts/SettingsLayout'
import SettingsAppearance from 'src/pages/DashBoard/pages/Settings/pages/SettingsAppearance'
import SettingsPayment from 'src/pages/DashBoard/pages/Settings/pages/SettingsPayment'
import SettingsProfile from 'src/pages/DashBoard/pages/Settings/pages/SettingsProfile'
import SettingsSendMail from 'src/pages/DashBoard/pages/Settings/pages/SettingsSendMail'
import SettingsStore from 'src/pages/DashBoard/pages/Settings/pages/SettingsStore'
import UserList from 'src/pages/DashBoard/pages/User/UserList'
import UserProfile from 'src/pages/DashBoard/pages/User/UserProfile'
import ForgotPassword from 'src/pages/ForgotPassword'
import Home from 'src/pages/Home'
import Login from 'src/pages/Login'
import ProductDetail from 'src/pages/ProductDetail'
import ProductList from 'src/pages/ProductList'
import ProductListDashboard from 'src/pages/DashBoard/pages/Product/ProductList'
import Register from 'src/pages/Register'
import ResetPassword from 'src/pages/ResetPassword'
import { useAppSelector } from 'src/redux/hook'
import { allowedRoles } from 'src/static/data'

function ProtectedRoute() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function ProtectedDashboardRoute() {
  const { profile } = useAppSelector((state) => state.auth)
  const isAllowedRole = profile?.roles.some((role: string) => allowedRoles.includes(role))

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
                  path: path.userProfileDashboard,
                  element: <UserProfile />
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
                      element: <SettingsStore />
                    },
                    {
                      path: path.settingsStore,
                      element: <SettingsStore />
                    },
                    {
                      path: path.settingsPayment,
                      element: <SettingsPayment />
                    },
                    {
                      path: path.settingsProfile,
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
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: <MainLayout />,
          children: [{ path: path.cart, element: <Cart /> }]
        },
        {
          path: path.checkout,
          element: <CheckoutLayout />,
          children: [
            { index: true, element: <CheckoutProfile /> },
            { path: path.checkoutProfile, element: <CheckoutProfile /> },
            { path: path.checkoutPayment, element: <CheckoutPayment /> },
            { path: path.checkoutSuccess, element: <CheckoutSuccess /> }
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
