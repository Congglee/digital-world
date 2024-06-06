import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { SuccessResponse } from 'src/types/utils.type'
import axiosBaseQuery from '../helper'
import { PaymentMethod, PaymentMethodList } from 'src/types/payment.type'
import { PaymentMethodSchema } from 'src/utils/rules'

export const PAYMENT_URL = 'payment'
export const ADMIN_PAYMENT_URL = `admin/${PAYMENT_URL}`

export const URL_GET_ALL_PAYMENT_METHODS = 'get-all-payment-methods'
export const URL_ADD_PAYMENT_METHOD = `${ADMIN_PAYMENT_URL}/add-payment-method`
export const URL_UPDATE_PAYMENT_METHOD = `${ADMIN_PAYMENT_URL}/update-payment-method`
export const URL_DELETE_PAYMENT_METHOD = `${ADMIN_PAYMENT_URL}/delete-payment-method`

const reducerPath = 'payment/api' as const
const tagTypes = ['Payment'] as const

export const paymentApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getAllPaymentMethods: build.query<SuccessResponse<PaymentMethodList>, void>({
      query: () => ({ url: `${PAYMENT_URL}/${URL_GET_ALL_PAYMENT_METHODS}`, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<PaymentMethodList>>) => response.data,
      providesTags: [{ type: 'Payment' as const, id: 'PAYMENT_METHOD_LIST' }, ...tagTypes]
    }),
    addPaymentMethod: build.mutation<
      AxiosResponse<SuccessResponse<PaymentMethod>>,
      Pick<PaymentMethodSchema, 'name' | 'image' | 'is_actived' | 'description'>
    >({
      query: (payload) => ({ url: URL_ADD_PAYMENT_METHOD, method: 'POST', data: payload }),
      invalidatesTags: [{ type: 'Payment', id: 'PAYMENT_METHOD_LIST' }, ...tagTypes]
    }),
    updatePaymentMethod: build.mutation<
      AxiosResponse<SuccessResponse<PaymentMethod>>,
      { id: string; payload: Pick<PaymentMethodSchema, 'name' | 'image' | 'is_actived' | 'description'> }
    >({
      query: ({ id, payload }) => ({ url: `${URL_UPDATE_PAYMENT_METHOD}/${id}`, method: 'PUT', data: payload }),
      invalidatesTags: tagTypes
    }),
    deletePaymentMethod: build.mutation<AxiosResponse<SuccessResponse<string>>, string>({
      query: (id) => ({ url: `${URL_DELETE_PAYMENT_METHOD}/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Payment', id: 'PAYMENT_METHOD_LIST' }, ...tagTypes]
    })
  })
})

export const {
  useGetAllPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation
} = paymentApi
