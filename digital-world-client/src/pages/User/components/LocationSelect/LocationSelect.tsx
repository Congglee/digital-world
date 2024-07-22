import { Controller, useFormContext } from 'react-hook-form'
import { VietNamDistrict, VietNamProvince, VietNamWard } from 'src/types/location.type'
import { FormData as ProfileFormData } from 'src/pages/User/pages/Profile/Profile'
import ProvincePicker from 'src/components/ProvincePicker'
import DistrictPicker from 'src/components/DistrictPicker'
import WardPicker from 'src/components/WardPicker'

interface LocationSelectProps {
  provinces: VietNamProvince[]
  districts: VietNamDistrict[]
  wards: VietNamWard[]
  onSelectProvince: (provinceId: string, provinceValue: string) => void
  onSelectDistrict: (districtId: string, districtValue: string) => void
  onSelectWard: (wardValue: string) => void
  errorMessage?: string
}

export default function LocationSelect({
  provinces,
  districts,
  wards,
  onSelectProvince,
  onSelectDistrict,
  onSelectWard
}: LocationSelectProps) {
  const {
    control,
    formState: { errors }
  } = useFormContext<ProfileFormData>()

  return (
    <div className='flex flex-col flex-wrap sm:flex-row'>
      <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize' />
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex flex-col xs:flex-row justify-between'>
          <div className='xs:w-[32%] h-16 flex flex-col'>
            <Controller
              name='province'
              control={control}
              render={({ field }) => (
                <ProvincePicker
                  value={field.value}
                  provinces={provinces}
                  onSelect={onSelectProvince}
                  onChange={field.onChange}
                  className='w-full h-full rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
                  labelId='province'
                />
              )}
            />
            <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errors.province?.message}</div>
          </div>
          <div className='xs:w-[32%] h-16 flex flex-col'>
            <Controller
              name='district'
              control={control}
              render={({ field }) => (
                <DistrictPicker
                  value={field.value}
                  districts={districts}
                  onSelect={onSelectDistrict}
                  onChange={field.onChange}
                  className='w-full h-full rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
                  labelId='district'
                />
              )}
            />
            <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errors.district?.message}</div>
          </div>
          <div className='xs:w-[32%] h-16 flex flex-col'>
            <Controller
              name='ward'
              control={control}
              render={({ field }) => (
                <WardPicker
                  value={field.value}
                  wards={wards}
                  onSelect={onSelectWard}
                  onChange={field.onChange}
                  className='w-full h-full rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
                  labelId='ward'
                />
              )}
            />
            <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errors.district?.message}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
