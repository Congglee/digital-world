import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from 'src/components/Button'
import ConfirmModal from 'src/components/ConfirmModal'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { useHandleAddressData } from 'src/hooks/useHandleAddressData'
import CheckoutBreadcrumbs from 'src/pages/Checkout/components/CheckoutBreadcrumbs'
import ShippingAddress from 'src/pages/Checkout/components/ShippingAddress'
import { useUpdateProfileMutation } from 'src/redux/apis/user.api'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { setProfile } from 'src/redux/slices/auth.slice'
import { ExtendedPurchaseCart } from 'src/types/cart.type'
import { setProfileToLS } from 'src/utils/auth'
import { OrderSchema, orderSchema } from 'src/utils/rules'

export type FormData = Pick<
  OrderSchema,
  | 'user_fullname'
  | 'user_phone'
  | 'shipping_address'
  | 'shipping_province'
  | 'shipping_district'
  | 'shipping_ward'
  | 'order_note'
>
const updateOrderProfileSchema = orderSchema.pick([
  'user_fullname',
  'user_phone',
  'shipping_address',
  'shipping_province',
  'shipping_district',
  'shipping_ward',
  'order_note'
])

export default function CheckoutProfile() {
  const form = useForm<FormData>({
    resolver: yupResolver(updateOrderProfileSchema),
    defaultValues: {
      user_fullname: '',
      user_phone: '',
      shipping_address: '',
      shipping_province: '',
      shipping_district: '',
      shipping_ward: '',
      order_note: ''
    }
  })
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch
  } = form
  const { profile } = useAppSelector((state) => state.auth)
  const [open, setOpen] = useState<boolean>(false)
  const naivgate = useNavigate()
  const dispatch = useAppDispatch()
  const checkoutPurchasesCart = JSON.parse(
    localStorage.getItem('checkout-purchases-cart') || '[]'
  ) as ExtendedPurchaseCart[]
  const { provinceData, districtsData, wardsData, setProvinceId, setDistrictId } = useHandleAddressData({
    watch,
    provinceFieldName: 'shipping_province',
    districtFieldName: 'shipping_district'
  })
  const [updateProfile, { data, isSuccess, isLoading }] = useUpdateProfileMutation()

  const closeModal = () => {
    setOpen(false)
    naivgate(path.checkoutPayment)
  }

  useEffect(() => {
    const savedFormState = localStorage.getItem('checkout-profile')
    if (profile) {
      setValue('user_fullname', profile.name)
      setValue('user_phone', profile.phone as string)
      setValue('shipping_address', profile.address as string)
      setValue('shipping_province', profile.province as string)
      setValue('shipping_district', profile.district as string)
      setValue('shipping_ward', profile.ward as string)
      setValue('order_note', '')
      if (savedFormState) {
        reset(JSON.parse(savedFormState))
      }
    }
  }, [profile, setValue, reset])

  const handleSelectProvince = (provinceId: string, provinceValue: string) => {
    setProvinceId(provinceId)
    setDistrictId('')
    setValue('shipping_province', provinceValue)
    setValue('shipping_district', '')
    setValue('shipping_ward', '')
  }

  const handleSelectDistrict = (districtId: string, districtValue: string) => {
    setDistrictId(districtId)
    setValue('shipping_district', districtValue)
    setValue('shipping_ward', '')
  }

  const handleSelectWard = (wardValue: string) => {
    setValue('shipping_ward', wardValue)
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (profile) {
        const fieldsToCompare = [
          { formValue: data.user_fullname, profileValue: profile.name, field: 'user_fullname' },
          { formValue: data.user_phone, profileValue: profile.phone, field: 'user_phone' },
          { formValue: data.shipping_address, profileValue: profile.address, field: 'address' },
          { formValue: data.shipping_province, profileValue: profile.province, field: 'province' },
          { formValue: data.shipping_district, profileValue: profile.district, field: 'district' },
          { formValue: data.shipping_ward, profileValue: profile.ward, field: 'ward' }
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
      name: data.user_fullname,
      phone: data.user_phone,
      address: data.shipping_address,
      province: data.shipping_province,
      district: data.shipping_district,
      ward: data.shipping_ward
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
        user_fullname: data.data.name,
        user_phone: data.data.phone,
        shipping_address: data.data.address,
        shipping_province: data.data.province,
        shipping_district: data.data.district,
        shipping_ward: data.data.ward,
        order_note: form.getValues().order_note
      }
      localStorage.setItem('checkout-profile', JSON.stringify(checkoutProfile))
      naivgate(path.checkoutPayment)
    }
  }, [isSuccess])

  if (!profile) return null

  if (!checkoutPurchasesCart.length) {
    naivgate(path.cart)
    return null
  }

  return (
    <>
      <div className='mt-1'>
        <CheckoutBreadcrumbs active='contact-information' />
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
          <FormProvider {...form}>
            <form className='space-y-5' onSubmit={onSubmit}>
              <h4 className='mb-[10px] capitalize text-2xl'>Thông tin cá nhân</h4>
              <div className='grid xs:grid-cols-2 gap-[10px]'>
                <div className='space-y-1'>
                  <label htmlFor='user_fullname' className='text-[#6d7175]'>
                    Họ và tên
                  </label>
                  <Input
                    id='user_fullname'
                    name='user_fullname'
                    register={register}
                    type='text'
                    placeholder='Họ và tên'
                    classNameInput='py-[10px] px-3 border border-[#c9cccf] rounded transition-shadow focus:outline-none focus:shadow-[0_0_0_1.5px_#458fff] bg-transparent focus:border-transparent'
                    classNameError='min-h-0'
                    errorMessage={errors.user_fullname?.message}
                  />
                </div>
                <div className='space-y-1'>
                  <label htmlFor='user_phone' className='text-[#6d7175]'>
                    Số điện thoại
                  </label>
                  <Input
                    id='user_phone'
                    name='user_phone'
                    register={register}
                    type='text'
                    placeholder='Số điện thoại'
                    classNameInput='py-[10px] px-3 border border-[#c9cccf] rounded transition-shadow focus:outline-none focus:shadow-[0_0_0_1.5px_#458fff] bg-transparent focus:border-transparent'
                    classNameError='min-h-0'
                    errorMessage={errors.user_phone?.message}
                  />
                </div>
              </div>
              <h4 className='mb-[10px] capitalize text-2xl'>Địa chỉ giao hàng</h4>
              <ShippingAddress
                provinces={provinceData?.data.results || []}
                onSelectProvince={handleSelectProvince}
                districts={districtsData?.data.results || []}
                onSelectDistrict={handleSelectDistrict}
                wards={wardsData?.data.results || []}
                onSelectWards={handleSelectWard}
              />
              <div className='space-y-1'>
                <label htmlFor='order_note' className='text-[#6d7175]'>
                  Ghi chú
                </label>
                <textarea
                  {...register('order_note')}
                  id='order_note'
                  rows={5}
                  className='min-h-20 w-full border border-[#c9cccf] rounded transition-shadow focus:outline-none focus:shadow-[0_0_0_1.5px_#458fff] px-3 py-2 focus:border-transparent'
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
          </FormProvider>
        </div>
      </div>
      <ConfirmModal
        open={open}
        closeModal={closeModal}
        title='Bạn có muốn cập nhật thông tin trên vào hồ sơ của bạn không?'
        description='Nếu bạn không cập nhật, thông tin này sẽ không được lưu lại vào tài khoản của bạn.'
        confirmButtonClassName='bg-green-500 hover:bg-green-600/80'
        isLoading={isLoading}
        handleConfirm={() => {
          if (!isLoading) {
            handleUpdateProfile()
          }
        }}
      />
    </>
  )
}
