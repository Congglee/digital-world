import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { SuccessResponse } from 'src/types/utils.type'
import axiosBaseQuery from '../helper'
import { CategoryList, Category } from 'src/types/category.type'
import { CategorySchema } from 'src/utils/rules'

export const ADMIN_CATEGORY_URL = 'admin/categories/'
export const URL_GET_ALL_CATEGORIES = `${ADMIN_CATEGORY_URL}/get-categories`
export const URL_ADD_CATEGORY = `${ADMIN_CATEGORY_URL}/add-category`
export const URL_UPDATE_CATEGORY = `${ADMIN_CATEGORY_URL}/update-category`
export const URL_DELETE_CATEGORY = `${ADMIN_CATEGORY_URL}/delete-category`

const reducerPath = 'category/api' as const
const tagTypes = ['Category'] as const

export const categoryApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getAllCategories: build.query<SuccessResponse<CategoryList>, void>({
      query: () => ({ url: URL_GET_ALL_CATEGORIES, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<CategoryList>>) => response.data,
      providesTags: tagTypes
    }),
    addCategory: build.mutation<AxiosResponse<SuccessResponse<Category>>, Pick<CategorySchema, 'name' | 'brands'>>({
      query: (payload) => ({ url: URL_ADD_CATEGORY, method: 'POST', data: payload }),
      invalidatesTags: tagTypes
    }),
    updateCategory: build.mutation<
      AxiosResponse<SuccessResponse<Category>>,
      { id: string; payload: Pick<CategorySchema, 'name' | 'brands'> }
    >({
      query: ({ id, payload }) => ({ url: `${URL_UPDATE_CATEGORY}/${id}`, method: 'PUT', data: payload }),
      invalidatesTags: tagTypes
    }),
    deleteCategory: build.mutation<AxiosResponse<SuccessResponse<string>>, string>({
      query: (id) => ({ url: `${URL_DELETE_CATEGORY}/${id}`, method: 'DELETE' }),
      invalidatesTags: tagTypes
    })
  })
})

export const {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation
} = categoryApi
