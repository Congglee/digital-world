import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { AuthResponse } from 'src/types/auth.type'
import { SuccessResponse } from 'src/types/utils.type'
import { Schema } from 'src/utils/rules'
import { userApi } from 'src/redux/apis/user.api'
import axiosBaseQuery from 'src/redux/helper'

export const URL_LOGIN = 'login'
export const URL_REGISTER = 'register'
export const URL_FINAL_REGISTER = 'final-register'
export const URL_LOGOUT = 'logout'
export const URL_REFRESH_TOKEN = 'refresh-access-token'
export const URL_FORGOT_PASSWORD = 'forgot-password'
export const URL_RESET_PASSWORD = 'reset-password'

const reducerPath = 'auth/api' as const
const tagTypes = ['Auth'] as const

export const authApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => {
    return {
      login: build.mutation<AxiosResponse<AuthResponse>, Pick<Schema, 'email' | 'password'>>({
        query: (payload) => ({ url: URL_LOGIN, method: 'POST', data: payload }),
        onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
          try {
            await queryFulfilled
            dispatch(userApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }))
          } catch (error) {
            console.log(error)
          }
        }
      }),
      register: build.mutation<
        AxiosResponse<SuccessResponse<{ otp_code: string }>>,
        Pick<Schema, 'name' | 'email' | 'password'>
      >({
        query: (payload) => ({ url: URL_REGISTER, method: 'POST', data: payload })
      }),
      finalRegister: build.mutation<AxiosResponse<AuthResponse>, { token: string }>({
        query: (payload) => ({ url: `${URL_FINAL_REGISTER}/${payload.token}`, method: 'PUT', data: payload })
      }),
      forgotPassword: build.mutation<
        AxiosResponse<SuccessResponse<{ reset_password_token: string }>>,
        Pick<Schema, 'email'>
      >({
        query: (payload) => ({ url: URL_FORGOT_PASSWORD, method: 'POST', data: payload })
      }),
      resetPassword: build.mutation<AxiosResponse<SuccessResponse<string>>, { token: string; password: string }>({
        query: (payload) => ({ url: URL_RESET_PASSWORD, method: 'PUT', data: payload })
      }),
      logout: build.mutation<AxiosResponse<SuccessResponse<string>>, void>({
        query: () => ({ url: URL_LOGOUT, method: 'POST' })
      })
    }
  }
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useFinalRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation
} = authApi
