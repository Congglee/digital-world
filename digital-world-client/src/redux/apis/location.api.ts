import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { VietNamDistricList, VietNamProvinceList, VietNamWardList } from 'src/types/location.type'
import { SuccessResponse } from 'src/types/utils.type'
import axiosBaseQuery from '../helper'

export const LOCATION_URL = 'location'
export const URL_GET_ALL_VN_PROVINCES = `${LOCATION_URL}/get-provinces`
export const URL_GET_PROVINCE_DISTRICTS = `${LOCATION_URL}/get-province-districts`
export const URL_GET_DISTRICT_WARDS = `${LOCATION_URL}/get-district-wards`

const reducerPath = 'location/api' as const
const tagTypes = ['Location'] as const

export const locationApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getAllVNProvinces: build.query<SuccessResponse<VietNamProvinceList>, void>({
      query: () => ({
        url: URL_GET_ALL_VN_PROVINCES,
        method: 'GET'
      }),
      transformResponse: (response: AxiosResponse<SuccessResponse<VietNamProvinceList>>) => response.data
    }),
    getProvinceDistricts: build.query<SuccessResponse<VietNamDistricList>, string>({
      query: (id) => ({ url: `${URL_GET_PROVINCE_DISTRICTS}/${id}`, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<VietNamDistricList>>) => response.data
    }),
    getDistrictWards: build.query<SuccessResponse<VietNamWardList>, string>({
      query: (id) => ({ url: `${URL_GET_DISTRICT_WARDS}/${id}`, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<VietNamWardList>>) => response.data
    })
  })
})

export const { useGetAllVNProvincesQuery, useGetProvinceDistrictsQuery, useGetDistrictWardsQuery } = locationApi
