import { yupResolver } from '@hookform/resolvers/yup'
import { ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from 'src/components/Button'
import ConfirmModal from 'src/components/ConfirmModal'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import CheckoutBreadcrumbs from 'src/pages/Checkout/components/CheckoutBreadcrumbs'
import {
  useGetAllVNProvincesQuery,
  useGetDistrictWardsQuery,
  useGetProvinceDistrictsQuery
} from 'src/redux/apis/location.api'
import { useGetMeQuery, useUpdateProfileMutation } from 'src/redux/apis/user.api'
import { useAppDispatch } from 'src/redux/hook'
import { setProfile } from 'src/redux/slices/auth.slice'
import { setProfileToLS } from 'src/utils/auth'
import { OrderSchema, orderSchema } from 'src/utils/rules'

type FormData = Pick<
  OrderSchema,
  'order_fullname' | 'order_phone' | 'delivery_at' | 'order_note' | 'province' | 'district' | 'ward'
>
const updateOrderProfileSchema = orderSchema.pick([
  'order_fullname',
  'order_phone',
  'delivery_at',
  'order_note',
  'province',
  'district',
  'ward'
])

export default function CheckoutProfile() {
  const form = useForm<FormData>({
    resolver: yupResolver(updateOrderProfileSchema),
    defaultValues: {
      order_fullname: '',
      order_phone: '',
      delivery_at: '',
      order_note: '',
      province: '',
      district: '',
      ward: ''
    }
  })
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset
  } = form
  const { data: profileData } = useGetMeQuery()
  const profile = profileData?.data.data
  const [provinceId, setProvinceId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const [open, setOpen] = useState<boolean>(false)
  const naivgate = useNavigate()
  const dispatch = useAppDispatch()

  const { data: provinceData } = useGetAllVNProvincesQuery()
  const { data: districtsData } = useGetProvinceDistrictsQuery(provinceId, {
    skip: provinceId ? false : true
  })
  const { data: wardsData } = useGetDistrictWardsQuery(districtId, {
    skip: districtId ? false : true
  })
  const [updateProfile, { data, isSuccess, isLoading }] = useUpdateProfileMutation()

  const closeModal = () => {
    setOpen(false)
    naivgate(path.checkoutPayment)
  }

  useEffect(() => {
    if (profile) {
      setValue('order_fullname', profile.name)
      setValue('order_phone', profile.phone as string)
      setValue('delivery_at', profile.address as string)
      setValue('province', profile.province as string)
      setValue('district', profile.district as string)
      setValue('ward', profile.ward as string)
      setValue('order_note', '')
    }
  }, [profile, setValue])

  useEffect(() => {
    if (provinceData) {
      const selectedProvince = provinceData.data.results.find(
        (province) => province.province_name === form.watch('province')
      )
      if (selectedProvince) {
        setProvinceId(selectedProvince.province_id.toString())
      }
    }
    if (districtsData) {
      const selectedDistrict = districtsData.data.results.find(
        (district) => district.district_name === form.watch('district')
      )
      if (selectedDistrict) {
        setDistrictId(selectedDistrict.district_id.toString())
      }
    }
  }, [provinceData, districtsData, form.watch('province'), form.watch('district')])

  const handleSelectProvince = (provinceId: string, provinceValue: string) => {
    setProvinceId(provinceId)
    setDistrictId('')
    setValue('province', provinceValue)
    setValue('district', '')
    setValue('ward', '')
  }

  const handleSelectDistrict = (districtId: string, districtValue: string) => {
    setDistrictId(districtId)
    setValue('district', districtValue)
    setValue('ward', '')
  }

  const handleSelectWard = (wardValue: string) => {
    setValue('ward', wardValue)
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (profile) {
        const fieldsToCompare = [
          { formValue: data.order_fullname, profileValue: profile.name, field: 'order_fullname' },
          { formValue: data.order_phone, profileValue: profile.phone, field: 'order_phone' },
          { formValue: data.delivery_at, profileValue: profile.address, field: 'delivery_at' },
          { formValue: data.province, profileValue: profile.province, field: 'province' },
          { formValue: data.district, profileValue: profile.district, field: 'district' },
          { formValue: data.ward, profileValue: profile.ward, field: 'ward' }
        ]
        const hasDifferences = fieldsToCompare.some(({ formValue, profileValue }) => formValue !== profileValue)
        if (hasDifferences) {
          setOpen(true)
        } else {
          naivgate(path.checkoutPayment)
        }
        localStorage.setItem('checkout-profile', JSON.stringify(data))
      }
    } catch (error) {
      console.log(error)
    }
  })

  const handleUpdateProfile = async () => {
    const data = form.getValues()
    const payload = {
      name: data.order_fullname,
      phone: data.order_phone,
      address: data.delivery_at,
      province: data.province,
      district: data.district,
      ward: data.ward
    }
    await updateProfile(payload)
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message)
      dispatch(setProfile(data?.data))
      setProfileToLS(data?.data)
      setOpen(false)
      const checkoutProfile = {
        order_fullname: data.data.name,
        order_phone: data.data.phone,
        delivery_at: data.data.address,
        province: data.data.province,
        district: data.data.district,
        ward: data.data.ward,
        order_note: form.getValues().order_note
      }
      localStorage.setItem('checkout-profile', JSON.stringify(checkoutProfile))
      naivgate(path.checkoutPayment)
    }
  }, [isSuccess])

  useEffect(() => {
    const savedFormState = localStorage.getItem('checkout-profile')
    if (savedFormState) {
      reset(JSON.parse(savedFormState))
    }
  }, [reset])

  if (!profile) return null

  return (
    <>
      <div className='mt-1'>
        <CheckoutBreadcrumbs />
        <div className='mt-1'>
          <div className='px-5 rounded border border-[#e1e3e5] divide-y'>
            <div className='grid xs:grid-cols-4 gap-1 py-[10px] border-[#e1e3e5]'>
              <div className='xs:col-span-1'>
                <span>Liên hệ</span>
              </div>
              <div className='xs:col-span-2'>
                <span>{profile.email}</span>
              </div>
              <div className='xs:col-span-1 flex justify-end' />
            </div>
          </div>
        </div>
        <div className='mt-[30px]'>
          <h4 className='mb-[10px] capitalize text-2xl'>Địa chỉ giao hàng</h4>
          <form className='space-y-5' onSubmit={onSubmit}>
            <div className='grid xs:grid-cols-2 gap-[10px]'>
              <div className='space-y-1'>
                <label htmlFor='order_fullname' className='text-[#6d7175]'>
                  Họ và tên
                </label>
                <Input
                  id='order_fullname'
                  name='order_fullname'
                  register={register}
                  type='text'
                  placeholder='Họ và tên'
                  classNameInput='py-[10px] px-3 border border-[#c9cccf] rounded transition-shadow focus:outline-none focus:shadow-[0_0_0_1.5px_#458fff] bg-transparent'
                  classNameError='min-h-0'
                  errorMessage={errors.order_fullname?.message}
                />
              </div>
              <div className='space-y-1'>
                <label htmlFor='order_phone' className='text-[#6d7175]'>
                  Số điện thoại
                </label>
                <Input
                  id='order_phone'
                  name='order_phone'
                  register={register}
                  type='text'
                  placeholder='Số điện thoại'
                  classNameInput='py-[10px] px-3 border border-[#c9cccf] rounded transition-shadow focus:outline-none focus:shadow-[0_0_0_1.5px_#458fff] bg-transparent'
                  classNameError='min-h-0'
                  errorMessage={errors.order_phone?.message}
                />
              </div>
            </div>
            <div className='space-y-1'>
              <label htmlFor='delivery_at' className='text-[#6d7175]'>
                Địa chỉ
              </label>
              <Input
                id='delivery_at'
                name='delivery_at'
                register={register}
                type='text'
                placeholder='Địa chỉ'
                classNameInput='py-[10px] px-3 border border-[#c9cccf] rounded transition-shadow focus:outline-none focus:shadow-[0_0_0_1.5px_#458fff] bg-transparent'
                classNameError='min-h-0'
                errorMessage={errors.delivery_at?.message}
              />
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-[10px]'>
              <div className='space-y-1'>
                <label htmlFor='province' className='text-[#6d7175]'>
                  Tỉnh
                </label>
                <div className='relative'>
                  <Controller
                    name='province'
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id='province'
                        className='w-full py-[10px] pl-3 pr-6 border border-[#c9cccf] rounded transition-shadow focus:outline-none focus:shadow-[0_0_0_1.5px_#458fff] appearance-none'
                        onChange={(e) => {
                          const selectedOption = e.target.options[e.target.selectedIndex]
                          const provinceId = selectedOption.getAttribute('data-id')!
                          handleSelectProvince(provinceId, selectedOption.text)
                          field.onChange(e)
                        }}
                        value={field.value}
                      >
                        <option value='' disabled>
                          Chọn một tỉnh thành
                        </option>
                        {provinceData?.data.results.map((province) => (
                          <option
                            key={province.province_id}
                            value={province.province_name}
                            data-id={province.province_id}
                          >
                            {province.province_name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <div className='absolute top-0 bottom-0 right-0 -ml-5 px-3 flex items-center justify-center'>
                    <ChevronsUpDown className='w-2.5 h-2.5' />
                  </div>
                </div>
                <div className='mt-0.5 text-red-600 text-sm'>{errors.province?.message}</div>
              </div>
              <div className='space-y-1'>
                <label htmlFor='district' className='text-[#6d7175]'>
                  Quận huyện
                </label>
                <div className='relative'>
                  <Controller
                    name='district'
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id='district'
                        className='w-full py-[10px] pl-3 pr-6 border border-[#c9cccf] rounded transition-shadow focus:outline-none focus:shadow-[0_0_0_1.5px_#458fff] appearance-none'
                        value={field.value}
                        onChange={(e) => {
                          const selectedOption = e.target.options[e.target.selectedIndex]
                          const districtId = selectedOption.getAttribute('data-id')!
                          handleSelectDistrict(districtId, selectedOption.text)
                          field.onChange(e)
                        }}
                      >
                        <option value='' disabled>
                          Chọn một quận/huyện
                        </option>
                        {districtsData?.data.results.map((district) => (
                          <option
                            key={district.district_id}
                            value={district.district_name}
                            data-id={district.district_id}
                          >
                            {district.district_name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <div className='absolute top-0 bottom-0 right-0 -ml-5 px-3 flex items-center justify-center'>
                    <ChevronsUpDown className='w-2.5 h-2.5' />
                  </div>
                </div>
                <div className='mt-0.5 text-red-600 text-sm'>{errors.district?.message}</div>
              </div>
              <div className='space-y-1'>
                <label htmlFor='ward' className='text-[#6d7175]'>
                  Phường
                </label>
                <div className='relative'>
                  <Controller
                    name='ward'
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id='ward'
                        className='w-full py-[10px] pl-3 pr-6 border border-[#c9cccf] rounded transition-shadow focus:outline-none focus:shadow-[0_0_0_1.5px_#458fff] appearance-none'
                        value={field.value}
                        onChange={(e) => {
                          const selectedOption = e.target.options[e.target.selectedIndex]
                          handleSelectWard(selectedOption.text)
                          field.onChange(e)
                        }}
                      >
                        <option value='' disabled>
                          Chọn một phường
                        </option>
                        {wardsData?.data.results.map((ward) => (
                          <option key={ward.ward_id} value={ward.ward_name}>
                            {ward.ward_name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <div className='absolute top-0 bottom-0 right-0 -ml-5 px-3 flex items-center justify-center'>
                    <ChevronsUpDown className='w-2.5 h-2.5' />
                  </div>
                </div>
                <div className='mt-0.5 text-red-600 text-sm'>{errors.ward?.message}</div>
              </div>
            </div>
            <div className='space-y-1'>
              <label htmlFor='order_note' className='text-[#6d7175]'>
                Ghi chú
              </label>
              <textarea
                {...register('order_note')}
                id='order_note'
                rows={5}
                className='min-h-20 w-full border border-[#c9cccf] rounded transition-shadow focus:outline-none focus:shadow-[0_0_0_1.5px_#458fff] px-3 py-2'
                placeholder='Ghi chú đơn hàng...'
              />
            </div>
            <div className='mt-[30px]'>
              <h4 className='mb-[10px] capitalize text-2xl'>Phương thức vận chuyển</h4>
              <div className='p-[10px] mb-5 rounded border border-[#e1e3e5]'>
                <div className='flex items-center py-1'>
                  <input
                    id='default-radio-1'
                    type='radio'
                    name='default-radio'
                    defaultChecked
                    className='w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                  />
                  <label htmlFor='default-radio-1' className='ms-2.5 text-[#6d7175]'>
                    Giao hàng tiêu chuẩn - 0.00₫
                  </label>
                </div>
              </div>
            </div>
            <div className='text-right'>
              <Button
                type='submit'
                className='p-5 text-white bg-[#3a3a3a] shadow-[0_1px_0_rgba(0,_0,_0,_.05),_inset_0_-1px_0_rgba(0,_0,_0,_0.2)] hover:bg-purple transition-colors'
              >
                Tiếp tục thanh toán
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmModal
        open={open}
        closeModal={closeModal}
        title='Bạn có muốn cập nhật thông tin trên vào hồ sơ của bạn không?'
        description='Nếu bạn không cập nhật, thông tin này sẽ không được lưu lại vào tài khoản của bạn.'
        confirmButtonClassName='bg-green-500 hover:bg-green-600/80'
        loading={isLoading}
        handleConfirm={() => {
          if (!isLoading) handleUpdateProfile()
        }}
      />
    </>
  )
}
