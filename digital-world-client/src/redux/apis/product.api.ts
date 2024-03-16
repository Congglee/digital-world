import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { SuccessResponse } from 'src/types/utils.type'
import axiosBaseQuery from '../helper'
import { Product, ProductList } from 'src/types/product.type'
import { ProductSchema } from 'src/utils/rules'

export const ADMIN_PRODUCT_URL = 'admin/products/'
export const URL_GET_PRODUCTS = `${ADMIN_PRODUCT_URL}/get-products`
export const URL_ADD_PRODUCT = `${ADMIN_PRODUCT_URL}/add-product`
export const URL_DELETE_PRODUCT = `${ADMIN_PRODUCT_URL}/delete-product`

const reducerPath = 'product/api' as const
const tagTypes = ['Product'] as const

export const productApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getProducts: build.query<SuccessResponse<ProductList>, void>({
      query: () => ({ url: URL_GET_PRODUCTS, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<ProductList>>) => response.data,
      providesTags: tagTypes
    }),
    addProduct: build.mutation<
      AxiosResponse<SuccessResponse<Product>>,
      Pick<
        ProductSchema,
        | 'name'
        | 'thumb'
        | 'images'
        | 'price'
        | 'price_before_discount'
        | 'quantity'
        | 'category'
        | 'brand'
        | 'is_featured'
        | 'is_published'
        | 'overview'
        | 'description'
      >
    >({
      query: (payload) => ({ url: URL_ADD_PRODUCT, method: 'POST', data: payload }),
      invalidatesTags: tagTypes
    }),
    deleteProduct: build.mutation<AxiosResponse<SuccessResponse<string>>, string>({
      query: (id) => ({ url: `${URL_DELETE_PRODUCT}/${id}`, method: 'DELETE' }),
      invalidatesTags: tagTypes
    })
  })
})

export const { useGetProductsQuery, useDeleteProductMutation, useAddProductMutation } = productApi
