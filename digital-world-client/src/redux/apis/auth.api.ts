import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../helper'
import { Schema } from 'src/utils/rules'
import { AuthResponse } from 'src/types/auth.type'

const reducerPath = 'auth/api' as const
const tagTypes = ['Auth'] as const

export const authApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints(build) {
    return {
      login: build.mutation<AuthResponse, Pick<Schema, 'email' | 'password'>>({
        query: (payload) => ({ url: '/login', method: 'POST', data: payload })
      })
    }
  }
})

export const { useLoginMutation } = authApi
