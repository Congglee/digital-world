import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { SuccessResponse } from 'src/types/utils.type'
import axiosBaseQuery from '../helper'
import { Brand, BrandList } from 'src/types/brand.type'
import { setBrandsOptionsFilter } from '../slices/brand.slice'
import { BrandSchema } from 'src/utils/rules'
import { categoryApi } from './category.api'
import { productApi } from './product.api'

export const ADMIN_BRAND_URL = 'admin/brands/'
export const URL_GET_ALL_BRANDS = `${ADMIN_BRAND_URL}/get-brands`
export const URL_ADD_BRAND = `${ADMIN_BRAND_URL}/add-brand`
export const URL_UPDATE_BRAND = `${ADMIN_BRAND_URL}/update-brand`
export const URL_DELETE_BRAND = `${ADMIN_BRAND_URL}/delete-brand`
export const URL_DELETE_BRANDS = `${ADMIN_BRAND_URL}/delete-many-brands`

const reducerPath = 'brand/api' as const
const tagTypes = ['Brand'] as const

export const brandApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getAllBrands: build.query<SuccessResponse<BrandList>, void>({
      query: () => ({ url: URL_GET_ALL_BRANDS, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<BrandList>>) => response.data,
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(
            setBrandsOptionsFilter(
              data.data.brands.map((brand) => ({
                label: brand.name,
                value: brand.name
              }))
            )
          )
        } catch (error) {
          console.log(error)
        }
      },
      providesTags: tagTypes
    }),
    addBrand: build.mutation<AxiosResponse<SuccessResponse<Brand>>, Pick<BrandSchema, 'name'>>({
      query: (payload) => ({ url: URL_ADD_BRAND, method: 'POST', data: payload }),
      invalidatesTags: tagTypes
    }),
    updateBrand: build.mutation<
      AxiosResponse<SuccessResponse<Brand>>,
      { id: string; payload: Pick<BrandSchema, 'name'> }
    >({
      query: ({ id, payload }) => ({ url: `${URL_UPDATE_BRAND}/${id}`, method: 'PUT', data: payload }),
      invalidatesTags: tagTypes
    }),
    deleteBrand: build.mutation<AxiosResponse<SuccessResponse<string>>, string>({
      query: (id) => ({ url: `${URL_DELETE_BRAND}/${id}`, method: 'DELETE' }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          dispatch(categoryApi.endpoints.getAllCategories.initiate(undefined, { forceRefetch: true }))
          dispatch(productApi.endpoints.getProducts.initiate(undefined, { forceRefetch: true }))
        } catch (error) {
          console.log(error)
        }
      },
      invalidatesTags: tagTypes
    }),
    deleteManyBrands: build.mutation<AxiosResponse<SuccessResponse<{ deleted_cound: number }>>, { list_id: string[] }>({
      query: (payload) => ({ url: URL_DELETE_BRANDS, method: 'DELETE', data: payload }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          dispatch(categoryApi.endpoints.getAllCategories.initiate(undefined, { forceRefetch: true }))
          dispatch(productApi.endpoints.getProducts.initiate(undefined, { forceRefetch: true }))
        } catch (error) {
          console.log(error)
        }
      },
      invalidatesTags: tagTypes
    })
  })
})

export const {
  useGetAllBrandsQuery,
  useAddBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
  useDeleteManyBrandsMutation
} = brandApi
