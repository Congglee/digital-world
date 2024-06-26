import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { SuccessResponse } from 'src/types/utils.type'
import { Brand, BrandList } from 'src/types/brand.type'
import { BrandSchema } from 'src/utils/rules'
import axiosBaseQuery from 'src/redux/helper'
import { setBrandsOptionsFilter } from 'src/redux/slices/brand.slice'
import { categoryApi } from 'src/redux/apis/category.api'
import { productApi } from 'src/redux/apis/product.api'

const BRAND_URL = 'brands'
const ADMIN_BRAND_URL = `admin/${BRAND_URL}`

const URL_GET_ALL_BRANDS = 'get-all-brands'
const URL_ADD_BRAND = `${ADMIN_BRAND_URL}/add-brand`
const URL_UPDATE_BRAND = `${ADMIN_BRAND_URL}/update-brand`
const URL_DELETE_BRAND = `${ADMIN_BRAND_URL}/delete-brand`
const URL_DELETE_BRANDS = `${ADMIN_BRAND_URL}/delete-many-brands`

const reducerPath = 'brand/api' as const
const tagTypes = ['Brand'] as const

export const brandApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getAllBrands: build.query<SuccessResponse<BrandList>, void>({
      query: () => ({ url: `${BRAND_URL}/${URL_GET_ALL_BRANDS}`, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<BrandList>>) => response.data,
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
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
    addBrand: build.mutation<AxiosResponse<SuccessResponse<Brand>>, Pick<BrandSchema, 'name' | 'image' | 'is_actived'>>(
      {
        query: (payload) => ({ url: URL_ADD_BRAND, method: 'POST', data: payload }),
        invalidatesTags: tagTypes
      }
    ),
    updateBrand: build.mutation<
      AxiosResponse<SuccessResponse<Brand>>,
      { id: string; payload: Pick<BrandSchema, 'name' | 'image' | 'is_actived'> }
    >({
      query: ({ id, payload }) => ({ url: `${URL_UPDATE_BRAND}/${id}`, method: 'PUT', data: payload }),
      invalidatesTags: tagTypes
    }),
    deleteBrand: build.mutation<AxiosResponse<SuccessResponse<string>>, string>({
      query: (id) => ({ url: `${URL_DELETE_BRAND}/${id}`, method: 'DELETE' }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          dispatch(categoryApi.endpoints.getAllCategories.initiate(undefined, { forceRefetch: true }))
          // dispatch(productApi.endpoints.getProducts.initiate({}, { forceRefetch: true }))
          dispatch(productApi.endpoints.getAllProducts.initiate(undefined, { forceRefetch: true }))
        } catch (error) {
          console.log(error)
        }
      },
      invalidatesTags: tagTypes
    }),
    deleteManyBrands: build.mutation<AxiosResponse<SuccessResponse<{ deleted_count: number }>>, { list_id: string[] }>({
      query: (payload) => ({ url: URL_DELETE_BRANDS, method: 'DELETE', data: payload }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          dispatch(categoryApi.endpoints.getAllCategories.initiate(undefined, { forceRefetch: true }))
          // dispatch(productApi.endpoints.getProducts.initiate({}, { forceRefetch: true }))
          dispatch(productApi.endpoints.getAllProducts.initiate(undefined, { forceRefetch: true }))
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
