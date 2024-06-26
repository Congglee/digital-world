import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { SuccessResponse } from 'src/types/utils.type'
import { PayPalPayment, PaymentMethod, PaymentMethodList } from 'src/types/payment.type'
import { PaymentMethodSchema } from 'src/utils/rules'
import { BodyAddOrder } from 'src/redux/apis/order.api'
import axiosBaseQuery from 'src/redux/helper'

const PAYMENT_URL = 'payment'
const ADMIN_PAYMENT_URL = `admin/${PAYMENT_URL}`

const URL_GET_ALL_PAYMENT_METHODS = 'get-all-payment-methods'
const URL_ADD_PAYMENT_METHOD = `${ADMIN_PAYMENT_URL}/add-payment-method`
const URL_UPDATE_PAYMENT_METHOD = `${ADMIN_PAYMENT_URL}/update-payment-method`
const URL_DELETE_PAYMENT_METHOD = `${ADMIN_PAYMENT_URL}/delete-payment-method`

const URL_CREATE_STRIPE_PAYMENT = `${PAYMENT_URL}/create-stripe-checkout-session`
const URL_CREATE_PAYPAL_PAYMENT = `${PAYMENT_URL}/create-paypal-payment`

const reducerPath = 'payment/api' as const
const tagTypes = ['Payment', 'PaymentMethod'] as const

export const paymentApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getAllPaymentMethods: build.query<SuccessResponse<PaymentMethodList>, void>({
      query: () => ({ url: `${PAYMENT_URL}/${URL_GET_ALL_PAYMENT_METHODS}`, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<PaymentMethodList>>) => response.data,
      providesTags: [{ type: 'PaymentMethod' as const, id: 'PAYMENT_METHOD_LIST' }, ...tagTypes]
    }),
    addPaymentMethod: build.mutation<
      AxiosResponse<SuccessResponse<PaymentMethod>>,
      Pick<PaymentMethodSchema, 'name' | 'image' | 'is_actived' | 'description'>
    >({
      query: (payload) => ({ url: URL_ADD_PAYMENT_METHOD, method: 'POST', data: payload }),
      invalidatesTags: [{ type: 'PaymentMethod', id: 'PAYMENT_METHOD_LIST' }, ...tagTypes]
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
      invalidatesTags: [{ type: 'PaymentMethod', id: 'PAYMENT_METHOD_LIST' }, ...tagTypes]
    }),
    createStripePayment: build.mutation<AxiosResponse<SuccessResponse<{ url: string }>>, BodyAddOrder>({
      query: (payload) => ({ url: URL_CREATE_STRIPE_PAYMENT, method: 'POST', data: payload })
    }),
    createPayPalPayment: build.mutation<
      AxiosResponse<SuccessResponse<PayPalPayment>>,
      { order_id: string; order_code: string; total_amount: number }
    >({
      query: (payload) => ({ url: URL_CREATE_PAYPAL_PAYMENT, method: 'POST', data: payload })
    })
  })
})

export const {
  useGetAllPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useCreateStripePaymentMutation,
  useCreatePayPalPaymentMutation
} = paymentApi
