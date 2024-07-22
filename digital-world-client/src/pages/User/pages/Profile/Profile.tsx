import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { useHandleAddressData } from 'src/hooks/useHandleAddressData'
import DateSelect from 'src/pages/User/components/DateSelect'
import LocationSelect from 'src/pages/User/components/LocationSelect'
import { useUploadImagesMutation } from 'src/redux/apis/upload.api'
import { useGetMeQuery, useUpdateProfileMutation } from 'src/redux/apis/user.api'
import { useAppDispatch } from 'src/redux/hook'
import { setProfile } from 'src/redux/slices/auth.slice'
import { setProfileToLS } from 'src/utils/auth'
import { isEntityError } from 'src/utils/helper'
import { userSchema, UserSchema } from 'src/utils/rules'
import { getAvatarUrl, handleValidateFile } from 'src/utils/utils'

function Info() {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormData>()

  return (
    <Fragment>
      <div className='flex flex-col flex-wrap sm:flex-row space-y-1 sm:space-y-0'>
        <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Họ và tên</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Input
            classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
            register={register}
            name='name'
            placeholder='Họ và tên'
            errorMessage={errors.name?.message}
          />
        </div>
      </div>
      <div className='flex flex-col flex-wrap sm:flex-row space-y-1 sm:space-y-0'>
        <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Số điện thoại</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              <InputNumber
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                placeholder='Số điện thoại'
                errorMessage={errors.phone?.message}
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </Fragment>
  )
}

export type FormData = Pick<
  UserSchema,
  'name' | 'email' | 'phone' | 'address' | 'province' | 'district' | 'ward' | 'date_of_birth' | 'avatar'
>
const profileSchema = userSchema.pick([
  'name',
  'email',
  'phone',
  'address',
  'province',
  'district',
  'ward',
  'date_of_birth',
  'avatar'
])

const initialFormState = {
  name: '',
  email: '',
  address: '',
  province: '',
  district: '',
  ward: '',
  phone: '',
  date_of_birth: new Date(1990, 0, 1),
  avatar: ''
}

export default function Profile() {
  const form = useForm<FormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: initialFormState
  })
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    setError
  } = form
  const { data: profileData, refetch } = useGetMeQuery()
  const profile = profileData?.data.data
  const { provinceData, districtsData, wardsData, setProvinceId, setDistrictId } = useHandleAddressData({
    watch,
    provinceFieldName: 'province',
    districtFieldName: 'district'
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const avatarFileInputRef = useRef<HTMLInputElement>(null)
  const previewAvatarImage = useMemo(() => {
    return avatarFile ? URL.createObjectURL(avatarFile) : ''
  }, [avatarFile])
  const [uploadImages, uploadImagesResult] = useUploadImagesMutation()
  const [updateProfile, { data, isSuccess, isError, error, isLoading }] = useUpdateProfileMutation()
  const dispatch = useAppDispatch()

  const avatar = form.watch('avatar')

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('email', profile.email)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('province', profile.province)
      setValue('district', profile.district)
      setValue('ward', profile.ward)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : undefined)
      setValue('avatar', profile.avatar)
    }
  }, [profile, setValue])

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
      let avatarUrl = avatar
      if (avatarFile) {
        const formData = new FormData()
        formData.append('images', avatarFile)
        const uploadRes = await uploadImages(formData)
        if ('data' in uploadRes && uploadRes.data) {
          avatarUrl = uploadRes.data.data.data[0]?.url || ''
        }
      }
      const payloadData = {
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarUrl
      }
      await updateProfile(payloadData)
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message)
      refetch()
      dispatch(setProfile(data?.data))
      setProfileToLS(data?.data!)
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError && isEntityError(error)) {
      const formError = error.data.data
      if (formError) {
        Object.entries(formError).forEach(([key, value]) => {
          setError(key as keyof FormData, {
            message: value as string,
            type: 'Server'
          })
        })
      }
    }
  }, [isError])

  return (
    <div className='rounded-sm px-5 pb-10 md:px-7 md:pb-20 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ Của Tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <FormProvider {...form}>
        <form
          className='mt-8 flex flex-col-reverse lg:flex-row lg:items-start lg:gap-12 lg:divide-x lg:divide-gray-200'
          onSubmit={onSubmit}
        >
          <div className='mt-6 flex-grow lg:mt-0 space-y-2'>
            <div className='flex flex-col flex-wrap sm:flex-row mb-6'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Email</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <div className='sm:pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>
            <Info />
            <div className='flex flex-col flex-wrap sm:flex-row space-y-1 sm:space-y-0'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Địa chỉ</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  register={register}
                  name='address'
                  placeholder='Địa chỉ'
                  errorMessage={errors.address?.message}
                />
              </div>
            </div>
            <LocationSelect
              provinces={provinceData?.data.results || []}
              districts={districtsData?.data.results || []}
              wards={wardsData?.data.results || []}
              onSelectProvince={handleSelectProvince}
              onSelectDistrict={handleSelectDistrict}
              onSelectWard={handleSelectWard}
            />
            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => (
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            <div className='flex flex-col flex-wrap sm:flex-row'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize' />
              <div className='sm:w-[80%] sm:pl-5'>
                <Button
                  className='flex items-center gap-2 h-9 bg-purple px-10 text-center text-sm text-white hover:bg-purple/80 rounded-sm'
                  type='submit'
                  disabled={uploadImagesResult.isLoading || isLoading}
                  isLoading={uploadImagesResult.isLoading || isLoading}
                >
                  Lưu
                </Button>
              </div>
            </div>
          </div>
          <div className='flex justify-center lg:w-72'>
            <div className='flex flex-col items-center'>
              <div className='my-5 h-24 w-24'>
                <img src={previewAvatarImage || getAvatarUrl(avatar)} className='h-full w-full rounded-full' alt='' />
              </div>
              <Controller
                name='avatar'
                control={control}
                render={({ field }) => (
                  <input
                    type='file'
                    accept='.jpg,.jpeg,.png,.webp'
                    ref={avatarFileInputRef}
                    className='hidden'
                    onChange={(event) => handleValidateFile(event, field.onChange, setAvatarFile)}
                  />
                )}
              />
              <button
                className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
                type='button'
                onClick={() => avatarFileInputRef.current?.click()}
              >
                Chọn ảnh
              </button>
              <div className='mt-3 text-gray-400'>
                <div>Dung lượng file tối đa 5 MB</div>
                <div>Định dạng:.JPEG, .PNG</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
