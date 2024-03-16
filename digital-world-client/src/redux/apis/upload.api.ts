import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { UploadResponse } from 'src/types/utils.type'
import axiosBaseQuery from '../helper'

export const URL_UPLOAD_IMAGES = 'media/upload-images'

const reducerPath = 'upload/api' as const
const tagTypes = ['Upload'] as const

export const uploadApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => {
    return {
      uploadImages: build.mutation<AxiosResponse<UploadResponse>, FormData>({
        query: (payload) => ({
          url: URL_UPLOAD_IMAGES,
          method: 'POST',
          data: payload,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      })
    }
  }
})

export const { useUploadImagesMutation } = uploadApi
