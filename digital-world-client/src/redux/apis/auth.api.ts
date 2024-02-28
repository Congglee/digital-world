import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { AuthResponse } from 'src/types/auth.type'
import { SuccessResponse } from 'src/types/utils.type'
import { Schema } from 'src/utils/rules'
import axiosBaseQuery from '../helper'

export const URL_LOGIN = 'login'
export const URL_REGISTER = 'register'
export const URL_FINAL_REGISTER = 'final-register'
export const URL_LOGOUT = 'logout'
export const URL_REFRESH_TOKEN = 'refresh-access-token'

const reducerPath = 'auth/api' as const
const tagTypes = ['Auth'] as const

export const authApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints(build) {
    return {
      login: build.mutation<AxiosResponse<AuthResponse>, Pick<Schema, 'email' | 'password'>>({
        query: (payload) => ({ url: URL_LOGIN, method: 'POST', data: payload })
      }),
      register: build.mutation<AxiosResponse<SuccessResponse<string>>, Pick<Schema, 'name' | 'email' | 'password'>>({
        query: (payload) => ({ url: URL_REGISTER, method: 'POST', data: payload })
      }),
      finalRegister: build.mutation<AxiosResponse<AuthResponse>, { token: string }>({
        query: (payload) => ({ url: `${URL_FINAL_REGISTER}/${payload.token}`, method: 'PUT', data: payload })
      })
    }
  }
})

export const { useLoginMutation, useRegisterMutation, useFinalRegisterMutation } = authApi
