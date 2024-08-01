import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { ListConfig, SuccessResponse } from 'src/types/utils.type'
import { Order, OrderList } from 'src/types/order.type'
import { OrderSchema } from 'src/utils/rules'
import axiosBaseQuery from 'src/redux/helper'
import { userApi } from 'src/redux/apis/user.api'

const ORDER_URL = 'orders'
const ADMIN_ORDER_URL = `admin/${ORDER_URL}`

//  const URL_GET_ORDERS = `${ADMIN_ORDER_URL}/get-orders`
const URL_GET_ALL_ORDERS = `${ADMIN_ORDER_URL}/get-all-orders`
const URL_GET_USER_ORDERS = `${ADMIN_ORDER_URL}/get-user-orders`
const URL_GET_MY_ORDERS = `${ORDER_URL}/get-my-orders`
const URL_ADD_ORDER = `${ORDER_URL}/add-order`
const URL_GET_ORDER = `${ADMIN_ORDER_URL}/get-order`
const URL_GET_ORDER_BY_ORDER_CODE = `${ORDER_URL}/get-order-by-order-code`
const URL_UPDATE_USER_ORDER = `${ADMIN_ORDER_URL}/update-user-order`

const reducerPath = 'order/api' as const
const tagTypes = ['Order'] as const

export type BodyAddOrder = Omit<OrderSchema, 'order_status' | 'delivery_status' | 'payment_status'> & {
  payment_method: string
}

export const orderApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getAllOrders: build.query<SuccessResponse<OrderList>, void>({
      query: () => ({ url: URL_GET_ALL_ORDERS, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<OrderList>>) => response.data,
      providesTags: tagTypes
    }),
    getUserOrders: build.query<SuccessResponse<OrderList>, string>({
      query: (user_id) => ({ url: `${URL_GET_USER_ORDERS}/${user_id}`, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<OrderList>>) => response.data,
      providesTags: [{ type: 'Order' as const, id: 'USER_ORDERS_LIST' }]
    }),
    getMyOrders: build.query<SuccessResponse<OrderList>, ListConfig>({
      query: (params) => ({ url: URL_GET_MY_ORDERS, method: 'GET', params }),
      transformResponse: (response: AxiosResponse<SuccessResponse<OrderList>>) => response.data,
      providesTags: [{ type: 'Order' as const, id: 'MY_ORDERS_LIST' }]
    }),
    addOrder: build.mutation<AxiosResponse<SuccessResponse<Order>>, BodyAddOrder>({
      query: (payload) => ({ url: URL_ADD_ORDER, method: 'POST', data: payload }),
      invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          dispatch(userApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }))
        } catch (error) {
          console.log(error)
        }
      }
    }),
    getOrder: build.query<AxiosResponse<SuccessResponse<Order>>, string>({
      query: (id) => ({ url: `${URL_GET_ORDER}/${id}`, method: 'GET' }),
      providesTags: (result, _error, _args) =>
        result ? [{ type: 'Order' as const, id: result?.data.data._id }] : tagTypes
    }),
    getOrderByOrderCode: build.query<AxiosResponse<SuccessResponse<Order>>, string>({
      query: (order_code) => ({ url: `${URL_GET_ORDER_BY_ORDER_CODE}/${order_code}`, method: 'GET' }),
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

export const {
  useGetAllOrdersQuery,
  useGetOrderQuery,
  useUpdateUserOrderMutation,
  useGetUserOrdersQuery,
  useGetMyOrdersQuery,
  useAddOrderMutation,
  useGetOrderByOrderCodeQuery
} = orderApi
