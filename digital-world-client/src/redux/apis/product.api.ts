import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { SuccessResponse } from 'src/types/utils.type'
import axiosBaseQuery from '../helper'
import { Product, ProductList } from 'src/types/product.type'
import { ProductSchema, RatingSchema } from 'src/utils/rules'

export const PRODUCT_URL = 'products/'
export const ADMIN_PRODUCT_URL = `admin/${PRODUCT_URL}`

export const URL_GET_PRODUCTS = 'get-products'
export const URL_GET_PRODUCT = 'get-product'
export const URL_ADD_PRODUCT = `${ADMIN_PRODUCT_URL}/add-product`
export const URL_UPDATE_PRODUCT = `${ADMIN_PRODUCT_URL}/update-product`
export const URL_DELETE_PRODUCT = `${ADMIN_PRODUCT_URL}/delete-product`
export const URL_DELETE_PRODUCTS = `${ADMIN_PRODUCT_URL}/delete-many-products`
export const URL_DELETE_RATING = `${ADMIN_PRODUCT_URL}/delete-rating`
export const URL_DELETE_RATINGS = `${ADMIN_PRODUCT_URL}/delete-many-ratings`
export const URL_UPDATE_RATING_STATUS = `${ADMIN_PRODUCT_URL}/update-rating-status`

const reducerPath = 'product/api' as const
const tagTypes = ['Product'] as const

export const productApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getProducts: build.query<SuccessResponse<ProductList>, void>({
      query: () => ({ url: `${PRODUCT_URL}${URL_GET_PRODUCTS}`, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<ProductList>>) => response.data,
      providesTags: tagTypes
    }),
    addProduct: build.mutation<AxiosResponse<SuccessResponse<Product>>, ProductSchema>({
      query: (payload) => ({ url: URL_ADD_PRODUCT, method: 'POST', data: payload }),
      invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
    }),
    getProductDetail: build.query<AxiosResponse<SuccessResponse<Product>>, string>({
      query: (id) => ({ url: `${PRODUCT_URL}${URL_GET_PRODUCT}/${id}`, method: 'GET' }),
      providesTags: (result, _error, _args) =>
        result ? [{ type: 'Product' as const, id: result?.data.data._id }] : tagTypes
    }),
    updateProduct: build.mutation<AxiosResponse<SuccessResponse<Product>>, { id: string; payload: ProductSchema }>({
      query: ({ id, payload }) => ({ url: `${URL_UPDATE_PRODUCT}/${id}`, method: 'PUT', data: payload }),
      invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
    }),
    deleteProduct: build.mutation<AxiosResponse<SuccessResponse<string>>, string>({
      query: (id) => ({ url: `${URL_DELETE_PRODUCT}/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
    }),
    deleteManyProducts: build.mutation<
      AxiosResponse<SuccessResponse<{ deleted_count: number }>>,
      { list_id: string[] }
    >({
      query: (payload) => ({ url: URL_DELETE_PRODUCTS, method: 'DELETE', data: payload }),
      invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
    }),
    deleteRating: build.mutation<AxiosResponse<SuccessResponse<string>>, { product_id: string; rating_id: string }>({
      query: ({ product_id, rating_id }) => ({
        url: `${URL_DELETE_RATING}/${product_id}/${rating_id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
    }),
    deleteManyRatings: build.mutation<
      AxiosResponse<SuccessResponse<{ deleted_count: number }>>,
      { product_id: string; payload: { list_id: string[] } }
    >({
      query: ({ product_id, payload }) => ({
        url: `${URL_DELETE_RATINGS}/${product_id}`,
        method: 'DELETE',
        data: payload
      }),
      invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
    }),
    updateRatingStatus: build.mutation<
      AxiosResponse<SuccessResponse<string>>,
      { product_id: string; rating_id: string; payload: Pick<RatingSchema, 'publish'> }
    >({
      query: ({ product_id, rating_id, payload }) => ({
        url: `${URL_UPDATE_RATING_STATUS}/${product_id}/${rating_id}`,
        method: 'PUT',
        data: payload
      }),
      invalidatesTags: (_result, error, args) => (error ? [] : [{ type: 'Product', id: args.product_id }])
    })
  })
})

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useGetProductDetailQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteManyProductsMutation,
  useDeleteRatingMutation,
  useDeleteManyRatingsMutation,
  useUpdateRatingStatusMutation
} = productApi
