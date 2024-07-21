import { ChevronsUpDown } from 'lucide-react'
import { Fragment } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import DistrictPicker from 'src/components/DistrictPicker'
import Input from 'src/components/Input'
import ProvincePicker from 'src/components/ProvincePicker'
import WardPicker from 'src/components/WardPicker'
import { FormData as BillingAddressFormData } from 'src/pages/Checkout/pages/CheckoutPayment/CheckoutPayment'
import { VietNamDistrict, VietNamProvince, VietNamWard } from 'src/types/location.type'

interface BillingAddressProps {
  provinces: VietNamProvince[]
  onSelectProvince: (provinceId: string, provinceValue: string) => void
  districts: VietNamDistrict[]
  onSelectDistrict: (districtId: string, districtValue: string) => void
  wards: VietNamWard[]
  onSelectWards: (wardValue: string) => void
}

export default function BillingAddress({
  provinces,
  onSelectProvince,
  districts,
  onSelectDistrict,
  wards,
  onSelectWards
}: BillingAddressProps) {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<BillingAddressFormData>()

  return (
    <Fragment>
      <div className='space-y-1'>
        <label htmlFor='billing_address' className='text-[#6d7175]'>
          Địa chỉ
        </label>
        <Input
          id='billing_address'
          name='billing_address'
          register={register}
          type='text'
          placeholder='Địa chỉ'
          classNameInput='py-[10px] px-3 border border-[#c9cccf] rounded transition-shadow focus:outline-none focus:shadow-[0_0_0_1.5px_#458fff] bg-transparent focus:border-transparent'
          classNameError='min-h-0'
          errorMessage={errors.billing_address?.message}
        />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-[10px]'>
        <div className='space-y-1'>
          <label htmlFor='billing_province' className='text-[#6d7175]'>
            Tỉnh
          </label>
          <div className='relative'>
            <Controller
              name='billing_province'
              control={control}
              render={({ field }) => (
                <ProvincePicker
                  value={field.value}
                  provinces={provinces}
                  onSelect={onSelectProvince}
                  onChange={field.onChange}
                />
              )}
            />
            <div className='absolute top-0 bottom-0 right-0 -ml-5 px-3 flex items-center justify-center'>
              <ChevronsUpDown className='w-2.5 h-2.5' />
            </div>
          </div>
          <div className='mt-0.5 text-red-600 text-sm'>{errors.billing_province?.message}</div>
        </div>
        <div className='space-y-1'>
          <label htmlFor='billing_district' className='text-[#6d7175]'>
            Quận huyện
          </label>
          <div className='relative'>
            <Controller
              name='billing_district'
              control={control}
              render={({ field }) => (
                <DistrictPicker
                  value={field.value}
                  districts={districts}
                  onSelect={onSelectDistrict}
                  onChange={field.onChange}
                />
              )}
            />
            <div className='absolute top-0 bottom-0 right-0 -ml-5 px-3 flex items-center justify-center'>
              <ChevronsUpDown className='w-2.5 h-2.5' />
            </div>
          </div>
          <div className='mt-0.5 text-red-600 text-sm'>{errors.billing_district?.message}</div>
        </div>
        <div className='space-y-1'>
          <label htmlFor='billing_ward' className='text-[#6d7175]'>
            Phường
          </label>
          <div className='relative'>
            <Controller
              name='billing_ward'
              control={control}
              render={({ field }) => (
                <WardPicker value={field.value} wards={wards} onSelect={onSelectWards} onChange={field.onChange} />
              )}
            />
            <div className='absolute top-0 bottom-0 right-0 -ml-5 px-3 flex items-center justify-center'>
              <ChevronsUpDown className='w-2.5 h-2.5' />
            </div>
          </div>
          <div className='mt-0.5 text-red-600 text-sm'>{errors.billing_ward?.message}</div>
        </div>
      </div>
    </Fragment>
  )
}