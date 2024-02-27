import type { AxiosError, AxiosRequestConfig } from 'axios'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import http from 'src/utils/http'

declare type AxiosBaseQueryConfig = {
  url: AxiosRequestConfig['url']
  method: AxiosRequestConfig['method']
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
  headers?: AxiosRequestConfig['headers']
}

const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryConfig, unknown, unknown> =>
  async ({ url, method, data, params, headers }) => {
    try {
      const response = await http.request({
        url,
        method,
        data,
        params,
        headers
      })
      return { data: response }
    } catch (axiosError) {
      const error = axiosError as AxiosError
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message
        }
      }
    }
  }

export default axiosBaseQuery
