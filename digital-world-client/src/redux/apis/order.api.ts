import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { SuccessResponse } from 'src/types/utils.type'
import axiosBaseQuery from '../helper'
import { Order, OrderList } from 'src/types/order.type'
import { OrderSchema } from 'src/utils/rules'

export const ORDER_URL = 'orders/'
export const ADMIN_ORDER_URL = `admin/${ORDER_URL}`

export const URL_GET_ORDERS = `${ADMIN_ORDER_URL}/get-orders`
export const URL_GET_ORDER = `${ORDER_URL}/get-order`
export const URL_UPDATE_USER_ORDER = `${ADMIN_ORDER_URL}/update-user-order`

const reducerPath = 'order/api' as const
const tagTypes = ['Order'] as const

export const orderApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getOrders: build.query<SuccessResponse<OrderList>, void>({
      query: () => ({ url: URL_GET_ORDERS, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<OrderList>>) => response.data,
      providesTags: tagTypes
    }),
    getOrder: build.query<AxiosResponse<SuccessResponse<Order>>, string>({
      query: (id) => ({ url: `${URL_GET_ORDER}/${id}`, method: 'GET' }),
      providesTags: (result, _error, _args) =>
        result ? [{ type: 'Order' as const, id: result?.data.data._id }] : tagTypes
    }),
    updateUserOrder: build.mutation<
      AxiosResponse<SuccessResponse<Order>>,
      { id: string; payload: Pick<OrderSchema, 'order_status' | 'delivery_status' | 'payment_status'> }
    >({
      query: ({ id, payload }) => ({ url: `${URL_UPDATE_USER_ORDER}/${id}`, method: 'PUT', data: payload }),
      invalidatesTags: (_result, error, args) => (error ? [] : [{ type: 'Order', id: args.id }, ...tagTypes])
    })
  })
})

export const { useGetOrdersQuery, useGetOrderQuery, useUpdateUserOrderMutation } = orderApi
