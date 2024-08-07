import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import axiosBaseQuery from 'src/redux/helper'
import { VietNamDistrict, VietNamLocationList, VietNamProvince, VietNamWard } from 'src/types/location.type'
import { SuccessResponse } from 'src/types/utils.type'

const LOCATION_URL = 'location'
const URL_GET_ALL_VIET_NAM_PROVINCES = `${LOCATION_URL}/get-provinces`
const URL_GET_PROVINCE_DISTRICTS = `${LOCATION_URL}/get-province-districts`
const URL_GET_DISTRICT_WARDS = `${LOCATION_URL}/get-district-wards`

const reducerPath = 'location/api' as const
const tagTypes = ['Location'] as const

export const locationApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getAllVietNamProvinces: build.query<SuccessResponse<VietNamLocationList<VietNamProvince[]>>, void>({
      query: () => ({
        url: URL_GET_ALL_VIET_NAM_PROVINCES,
        method: 'GET'
      }),
      transformResponse: (response: AxiosResponse<SuccessResponse<VietNamLocationList<VietNamProvince[]>>>) =>
        response.data
    }),
    getProvinceDistricts: build.query<SuccessResponse<VietNamLocationList<VietNamDistrict[]>>, string>({
      query: (id) => ({ url: `${URL_GET_PROVINCE_DISTRICTS}/${id}`, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<VietNamLocationList<VietNamDistrict[]>>>) =>
        response.data
    }),
    getDistrictWards: build.query<SuccessResponse<VietNamLocationList<VietNamWard[]>>, string>({
      query: (id) => ({ url: `${URL_GET_DISTRICT_WARDS}/${id}`, method: 'GET' }),
      transformResponse: (response: AxiosResponse<SuccessResponse<VietNamLocationList<VietNamWard[]>>>) => response.data
    })
  })
})

export const { useGetAllVietNamProvincesQuery, useGetProvinceDistrictsQuery, useGetDistrictWardsQuery } = locationApi
