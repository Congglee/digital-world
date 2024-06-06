import { Separator } from 'src/components/ui/separator'
import SettingsHeading from '../../components/SettingsHeading/SettingsHeading'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import { UserSchema, userSchema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useGetMeQuery, useUpdateProfileMutation } from 'src/redux/apis/user.api'
import { useEffect, useMemo, useRef, useState } from 'react'
import ProvincePicker from 'src/components/AdminPanel/ProvincePicker'
import {
  useGetAllVNProvincesQuery,
  useGetDistrictWardsQuery,
  useGetProvinceDistrictsQuery
} from 'src/redux/apis/location.api'
import DistrictPicker from 'src/components/AdminPanel/DistrictPicker'
import WardPicker from 'src/components/AdminPanel/WardPicker'
import DatePicker from 'src/components/AdminPanel/DatePicker'
import { ImageUp, Loader } from 'lucide-react'
import { getAvatarUrl, handleValidateFile } from 'src/utils/utils'
import { useUploadImagesMutation } from 'src/redux/apis/upload.api'
import { toast } from 'react-toastify'
import { isEntityError } from 'src/utils/helper'
import { useAppDispatch } from 'src/redux/hook'
import { setProfile } from 'src/redux/slices/auth.slice'
import { setProfileToLS } from 'src/utils/auth'

type FormData = Pick<
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

export default function SettingsProfile() {
  const form = useForm<FormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: initialFormState
  })
  const { data: profileData, refetch } = useGetMeQuery()
  const profile = profileData?.data.data
  const [provinceId, setProvinceId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const avatarFileInputRef = useRef<HTMLInputElement>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const previewAvatarImage = useMemo(() => {
    return avatarFile ? URL.createObjectURL(avatarFile) : ''
  }, [avatarFile])
  const dispatch = useAppDispatch()

  const { data: provinceData } = useGetAllVNProvincesQuery()
  const { data: districtsData } = useGetProvinceDistrictsQuery(provinceId, {
    skip: provinceId ? false : true
  })
  const { data: wardsData } = useGetDistrictWardsQuery(districtId, {
    skip: districtId ? false : true
  })
  const [uploadImages, uploadImagesResult] = useUploadImagesMutation()
  const [updateProfile, { data, isSuccess, isError, error, isLoading }] = useUpdateProfileMutation()

  const avatar = form.watch('avatar')

  useEffect(() => {
    if (profile) {
      form.setValue('name', profile.name)
      form.setValue('email', profile.email)
      form.setValue('phone', profile.phone)
      form.setValue('address', profile.address)
      form.setValue('province', profile.province)
      form.setValue('district', profile.district)
      form.setValue('ward', profile.ward)
      form.setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : undefined)
      form.setValue('avatar', profile.avatar)
    }
  }, [profile, form.setValue])

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

  const onSubmit = form.handleSubmit(async (data) => {
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
          form.setError(key as keyof FormData, {
            message: value as string,
            type: 'Server'
          })
        })
      }
    }
  }, [isError])

  const handleSelectProvince = (provinceId: string, provinceValue: string) => {
    setProvinceId(provinceId)
    setDistrictId('')
    form.setValue('province', provinceValue)
    form.setValue('district', '')
    form.setValue('ward', '')
  }

  const handleSelectDistrict = (districtId: string, districtValue: string) => {
    setDistrictId(districtId)
    form.setValue('district', districtValue)
    form.setValue('ward', '')
  }

  const handleSelectWard = (wardValue: string) => {
    form.setValue('ward', wardValue)
  }

  return (
    <div className='space-y-6'>
      <SettingsHeading heading='Hồ sơ cá nhân' description='Chỉnh sửa thông tin tài khoản' />
      <Separator />
      <Form {...form}>
        <form onSubmit={onSubmit} className='space-y-6'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input placeholder='Họ và tên...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Email...' {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder='SĐT...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder='Địa chỉ...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
            <FormField
              control={form.control}
              name='province'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='province'>Tỉnh</FormLabel>
                  <ProvincePicker
                    value={field.value}
                    provinces={provinceData?.data.results || []}
                    onSelect={handleSelectProvince}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='district'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='district'>Quận huyện</FormLabel>
                  <DistrictPicker
                    value={field.value}
                    districts={districtsData?.data.results || []}
                    provinceId={provinceId}
                    onSelect={handleSelectDistrict}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ward'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='ward'>Phường</FormLabel>
                  <WardPicker
                    value={field.value}
                    wards={wardsData?.data.results || []}
                    districtId={districtId}
                    onSelect={handleSelectWard}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='date_of_birth'
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel htmlFor='date_of_birth'>Ngày sinh</FormLabel>
                <DatePicker value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='avatar'
            render={({ field }) => (
              <FormItem className='col-span-2 sm:col-span-1'>
                <FormLabel>Avatar</FormLabel>
                <div className='flex flex-col gap-4'>
                  <FormControl>
                    <Input
                      {...form.register('avatar')}
                      accept='.jpg,.jpeg,.png,.webp'
                      className='hidden'
                      placeholder='Avatar...'
                      type='file'
                      ref={avatarFileInputRef}
                      onChange={(event) => handleValidateFile(event, field.onChange, setAvatarFile)}
                    />
                  </FormControl>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      avatarFileInputRef.current?.click()
                    }}
                    className='max-w-xs text-sm text-gray-600 shadow-sm space-x-2'
                  >
                    <ImageUp className='size-5' />
                    <span>Chọn ảnh</span>
                  </Button>
                  <FormMessage />
                  <div className='size-24 rounded-full overflow-hidden'>
                    <img
                      src={previewAvatarImage || getAvatarUrl(avatar)}
                      alt='user-avatar'
                      className='aspect-square w-full h-full'
                    />
                  </div>
                </div>
              </FormItem>
            )}
          />
          <div className='space-x-4'>
            <Button type='submit' className='px-10' disabled={uploadImagesResult.isLoading || isLoading}>
              {uploadImagesResult.isLoading || isLoading ? <Loader className='animate-spin w-4 h-4 mr-1' /> : null}
              Lưu lại
            </Button>
            <Button
              type='button'
              variant='outline'
              className='px-10'
              onClick={() => {
                form.reset({
                  ...profile,
                  date_of_birth: profile?.date_of_birth ? new Date(profile.date_of_birth) : undefined
                })
                setAvatarFile(null)
              }}
            >
              Hủy
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
