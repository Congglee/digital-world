import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { SuccessResponse } from 'src/types/utils.type'
import { CategoryList, Category } from 'src/types/category.type'
import { CategorySchema } from 'src/utils/rules'
import axiosBaseQuery from 'src/redux/helper'
import { setCategoriesOptionsFilter } from 'src/redux/slices/category.slice'
import { productApi } from 'src/redux/apis/product.api'

const CATEGORY_URL = 'categories'
const ADMIN_CATEGORY_URL = `admin/${CATEGORY_URL}`

const URL_GET_ALL_CATEGORIES = `get-all-categories`
const URL_ADD_CATEGORY = `${ADMIN_CATEGORY_URL}/add-category`
const URL_UPDATE_CATEGORY = `${ADMIN_CATEGORY_URL}/update-category`
const URL_DELETE_CATEGORY = `${ADMIN_CATEGORY_URL}/delete-category`
const URL_DELETE_CATEGORIES = `${ADMIN_CATEGORY_URL}/delete-many-categories`

const reducerPath = 'category/api' as const
const tagTypes = ['Category'] as const

export const categoryApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getAllCategories: build.query<SuccessResponse<CategoryList>, void>({
      query: () => ({ url: `${CATEGORY_URL}/${URL_GET_ALL_CATEGORIES}`, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<CategoryList>>) => response.data,
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(
            setCategoriesOptionsFilter(
              data.data.categories.map((category) => ({
                label: category.name,
                value: category._id
              }))
            )
          )
        } catch (error) {
          console.log(error)
        }
      },
      providesTags: tagTypes
    }),
    addCategory: build.mutation<
      AxiosResponse<SuccessResponse<Category>>,
      Pick<CategorySchema, 'name' | 'brands' | 'is_actived'>
    >({
      query: (payload) => ({ url: URL_ADD_CATEGORY, method: 'POST', data: payload }),
      invalidatesTags: tagTypes
    }),
    updateCategory: build.mutation<
      AxiosResponse<SuccessResponse<Category>>,
      { id: string; payload: Pick<CategorySchema, 'name' | 'brands' | 'is_actived'> }
    >({
      query: ({ id, payload }) => ({ url: `${URL_UPDATE_CATEGORY}/${id}`, method: 'PUT', data: payload }),
      invalidatesTags: tagTypes
    }),
    deleteCategory: build.mutation<AxiosResponse<SuccessResponse<string>>, string>({
      query: (id) => ({ url: `${URL_DELETE_CATEGORY}/${id}`, method: 'DELETE' }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        // `onStart` side-effect
        // anything you want to run when the query starts
        try {
          await queryFulfilled
          // dispatch(productApi.endpoints.getProducts.initiate({}, { forceRefetch: true }))
          dispatch(productApi.endpoints.getAllProducts.initiate(undefined, { forceRefetch: true }))
          // `onSuccess` side-effect
          // anything you want to run when the query succeeds
        } catch (error) {
          // `onError` side-effect
          // anything you want to run when the query fails
          console.log(error)
        }
      },
      invalidatesTags: tagTypes
    }),
    deleteManyCategories: build.mutation<
      AxiosResponse<SuccessResponse<{ deleted_count: number }>>,
      { list_id: string[] }
    >({
      query: (payload) => ({ url: URL_DELETE_CATEGORIES, method: 'DELETE', data: payload }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
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
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteManyCategoriesMutation
} = categoryApi
