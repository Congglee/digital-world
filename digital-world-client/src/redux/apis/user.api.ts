import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import axiosBaseQuery from 'src/redux/helper'
import { User, UserList } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'

const USER_URL = 'users'
const CART_URL = 'cart'
const ADMIN_USER_URL = `admin/${USER_URL}`

// const URL_GET_USERS = `${ADMIN_USER_URL}/get-users`
const URL_GET_ALL_USERS = `${ADMIN_USER_URL}/get-all-users`
const URL_GET_USER = `${ADMIN_USER_URL}/get-user`
const URL_ADD_USER = `${ADMIN_USER_URL}/add-user`
const URL_UPDATE_USER = `${ADMIN_USER_URL}/update-user`
const URL_DELETE_USER = `${ADMIN_USER_URL}/delete-user`
const URL_DELETE_USERS = `${ADMIN_USER_URL}/delete-many-users`

const URL_GET_ME = `${USER_URL}/get-me`
const URL_UPDATE_PROFILE = `${USER_URL}/update-me`

const URL_ADD_TO_CART = `${CART_URL}/add-to-cart`
const URL_UPDATE_USER_CART = `${CART_URL}/update-cart`
const URL_DELETE_PRODUCTS_CART = `${CART_URL}/delete-products-cart`

const reducerPath = 'user/api' as const
const tagTypes = ['User'] as const

type BodyUpdateProfile = Omit<
  User,
  '_id' | 'wishlist' | 'cart' | 'roles' | 'email' | 'createdAt' | 'updatedAt' | 'verify'
> & {
  password?: string
  newPassword?: string
}

type BaseUserMutationFields = Pick<
  User,
  'name' | 'email' | 'address' | 'province' | 'district' | 'ward' | 'roles' | 'phone' | 'date_of_birth' | 'verify'
>

type BodyAddUser = BaseUserMutationFields & { password: string }
type BodyUpdateUser = BaseUserMutationFields | { password?: string }

export const userApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => {
    return {
      getAllUsers: build.query<SuccessResponse<UserList>, void>({
        query: () => ({ url: URL_GET_ALL_USERS, method: 'GET' }),
        transformResponse: (response: AxiosResponse<SuccessResponse<UserList>>) => response.data,
        providesTags: tagTypes
      }),
      getUser: build.query<AxiosResponse<SuccessResponse<User>>, string>({
        query: (id) => ({ url: `${URL_GET_USER}/${id}`, method: 'GET' }),
        providesTags: (result, _error, _args) =>
          result ? [{ type: 'User' as const, id: result?.data.data._id }] : tagTypes
      }),
      getMe: build.query<AxiosResponse<SuccessResponse<User>>, void>({
        query: () => ({ url: URL_GET_ME, method: 'GET' }),
        providesTags: (result, _error, _args) =>
          result ? [{ type: 'User' as const, id: result?.data.data._id }] : tagTypes
      }),
      updateProfile: build.mutation<SuccessResponse<User>, BodyUpdateProfile>({
        query: (payload) => ({ url: URL_UPDATE_PROFILE, method: 'PUT', data: payload }),
        transformResponse: (response: AxiosResponse<SuccessResponse<User>>) => response.data,
        invalidatesTags: (result, error, _args) => (error ? [] : [{ type: 'User', id: result?.data._id }])
      }),
      addUser: build.mutation<SuccessResponse<User>, BodyAddUser>({
        query: (payload) => ({ url: URL_ADD_USER, method: 'POST', data: payload }),
        transformResponse: (response: AxiosResponse<SuccessResponse<User>>) => response.data,
        invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
      }),
      updateUser: build.mutation<SuccessResponse<User>, { id: string; payload: BodyUpdateUser }>({
        query: ({ id, payload }) => ({ url: `${URL_UPDATE_USER}/${id}`, method: 'PUT', data: payload }),
        transformResponse: (response: AxiosResponse<SuccessResponse<User>>) => response.data,
        invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
      }),
      deleteUser: build.mutation<AxiosResponse<SuccessResponse<string>>, string>({
        query: (id) => ({ url: `${URL_DELETE_USER}/${id}`, method: 'DELETE' }),
        invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
      }),
      deleteManyUsers: build.mutation<AxiosResponse<SuccessResponse<{ deleted_count: number }>>, { list_id: string[] }>(
        {
          query: (payload) => ({ url: URL_DELETE_USERS, method: 'DELETE', data: payload }),
          invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
        }
      ),
      addToCart: build.mutation<SuccessResponse<User>, { product_id: string; buy_count: number }>({
        query: (payload) => ({ url: URL_ADD_TO_CART, method: 'POST', data: payload }),
        transformResponse: (response: AxiosResponse<SuccessResponse<User>>) => response.data,
        invalidatesTags: (result, error, _args) => (error ? [] : [{ type: 'User', id: result?.data._id }])
      }),
      updateUserCart: build.mutation<SuccessResponse<User>, { product_id: string; buy_count: number }>({
        query: (payload) => ({ url: URL_UPDATE_USER_CART, method: 'PUT', data: payload }),
        transformResponse: (response: AxiosResponse<SuccessResponse<User>>) => response.data,
        invalidatesTags: (result, error, _args) => (error ? [] : [{ type: 'User', id: result?.data._id }])
      }),
      deleteProductsCart: build.mutation<AxiosResponse<SuccessResponse<{ deleted_products_cart: number }>>, string[]>({
        query: (payload) => ({ url: URL_DELETE_PRODUCTS_CART, method: 'DELETE', data: payload }),
        invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
      })
    }
  }
})

export const {
  useGetAllUsersQuery,
  useGetUserQuery,
  useGetMeQuery,
  useUpdateProfileMutation,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useDeleteManyUsersMutation,
  useAddToCartMutation,
  useUpdateUserCartMutation,
  useDeleteProductsCartMutation
} = userApi
