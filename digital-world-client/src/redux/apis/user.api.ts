import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { User, UserList } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import axiosBaseQuery from '../helper'

export const ADMIN_USER_URL = 'admin/users'
export const URL_GET_USERS = `${ADMIN_USER_URL}/get-users`
export const URL_GET_USER = `${ADMIN_USER_URL}/get-user`
export const URL_ADD_USER = `${ADMIN_USER_URL}/add-user`
export const URL_UPDATE_USER = `${ADMIN_USER_URL}/update-user`
export const URL_DELETE_USER = `${ADMIN_USER_URL}/delete-user`

const reducerPath = 'user/api' as const
const tagTypes = ['User'] as const

type BodyUpdateUser = Omit<User, '_id' | 'createdAt' | 'updatedAt' | 'email'> | { password?: string }
type BodyAddUser = Pick<
  User,
  'name' | 'email' | 'address' | 'province' | 'district' | 'ward' | 'is_blocked' | 'roles' | 'phone' | 'date_of_birth'
> & { password: string }

export const userApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => {
    return {
      getUsers: build.query<SuccessResponse<UserList>, void>({
        query: () => ({ url: URL_GET_USERS, method: 'GET' }),
        transformResponse: (response: AxiosResponse<SuccessResponse<UserList>>) => response.data,
        providesTags: tagTypes
      }),
      getUser: build.query<AxiosResponse<SuccessResponse<User>>, string>({
        query: (id) => ({ url: `${URL_GET_USER}/${id}`, method: 'GET' }),
        providesTags: (result, _error, _args) =>
          result ? [{ type: 'User' as const, id: result?.data.data._id }] : tagTypes
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
      })
    }
  }
})

export const { useGetUsersQuery, useGetUserQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation } =
  userApi
