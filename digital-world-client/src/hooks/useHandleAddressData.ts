import { useEffect, useState } from 'react'
import {
  useGetAllVietNamProvincesQuery,
  useGetDistrictWardsQuery,
  useGetProvinceDistrictsQuery
} from 'src/redux/apis/location.api'
import { UseFormWatch } from 'react-hook-form'

export function useHandleAddressData({
  watch,
  provinceFieldName,
  districtFieldName
}: {
  watch: UseFormWatch<any>
  provinceFieldName: string
  districtFieldName: string
}) {
  const [provinceId, setProvinceId] = useState<string>('')
  const [districtId, setDistrictId] = useState<string>('')

  const { data: provinceData } = useGetAllVietNamProvincesQuery()
  const { data: districtsData } = useGetProvinceDistrictsQuery(provinceId, {
    skip: !provinceId
  })
  const { data: wardsData } = useGetDistrictWardsQuery(districtId, {
    skip: !districtId
  })

  useEffect(() => {
    if (provinceData) {
      const selectedProvince = provinceData.data.results.find(
        (province) => province.province_name === watch(provinceFieldName)
      )
      if (selectedProvince) {
        setProvinceId(selectedProvince.province_id.toString())
      }
    }
    if (districtsData) {
      const selectedDistrict = districtsData.data.results.find(
        (district) => district.district_name === watch(districtFieldName)
      )
      if (selectedDistrict) {
        setDistrictId(selectedDistrict.district_id.toString())
      }
    }
  }, [provinceData, districtsData, watch])

  return { provinceData, districtsData, wardsData, setProvinceId, setDistrictId, provinceId, districtId }
}
