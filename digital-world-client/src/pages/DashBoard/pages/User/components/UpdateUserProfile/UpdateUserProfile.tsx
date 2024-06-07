import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowDownUp, CheckIcon, Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import DatePicker from 'src/components/AdminPanel/DatePicker'
import DistrictPicker from 'src/components/AdminPanel/DistrictPicker'
import ProvincePicker from 'src/components/AdminPanel/ProvincePicker'
import WardPicker from 'src/components/AdminPanel/WardPicker'
import { Button } from 'src/components/ui/button'
import { Command, CommandGroup, CommandItem } from 'src/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Switch } from 'src/components/ui/switch'
import {
  useGetAllVNProvincesQuery,
  useGetDistrictWardsQuery,
  useGetProvinceDistrictsQuery
} from 'src/redux/apis/location.api'
import { useUpdateUserMutation } from 'src/redux/apis/user.api'
import { rolesOptions } from 'src/static/options'
import { Role, User } from 'src/types/user.type'
import { UserSchema, userSchema } from 'src/utils/rules'
import { cn } from 'src/utils/utils'

interface UpdateUserProfileProps {
  userProfile: User
}

type FormData = Pick<
  UserSchema,
  | 'name'
  | 'email'
  | 'phone'
  | 'address'
  | 'province'
  | 'district'
  | 'ward'
  | 'date_of_birth'
  | 'roles'
  | 'is_blocked'
  | 'is_email_verified'
>
const updateUserSchema = userSchema.pick([
  'name',
  'email',
  'phone',
  'address',
  'province',
  'district',
  'ward',
  'date_of_birth',
  'roles',
  'is_blocked',
  'is_email_verified'
])

const initialFormState = {
  name: '',
  email: '',
  address: '',
  province: '',
  district: '',
  ward: '',
  phone: '',
  roles: [],
  date_of_birth: new Date(1990, 0, 1),
  is_blocked: false,
  is_email_verified: false
}

export default function UpdateUserProfile({ userProfile }: UpdateUserProfileProps) {
  const form = useForm<FormData>({
    resolver: yupResolver(updateUserSchema),
    defaultValues: initialFormState
  })

  const [provinceId, setProvinceId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const { data: provinceData } = useGetAllVNProvincesQuery()
  const { data: districtsData } = useGetProvinceDistrictsQuery(provinceId, {
    skip: provinceId ? false : true
  })
  const { data: wardsData } = useGetDistrictWardsQuery(districtId, {
    skip: districtId ? false : true
  })
  const [updateUser, { data, isLoading, isSuccess }] = useUpdateUserMutation()

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name,
        email: userProfile.email,
        address: userProfile.address || '',
        province: userProfile.province || '',
        district: userProfile.district || '',
        ward: userProfile.ward || '',
        phone: userProfile.phone || '',
        roles: userProfile.roles,
        date_of_birth: userProfile.date_of_birth ? new Date(userProfile.date_of_birth) : undefined,
        is_blocked: userProfile.is_blocked,
        is_email_verified: userProfile.is_email_verified
      })
    }
  }, [userProfile])

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

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const payloadData = {
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        roles: data.roles as Role[]
      }
      await updateUser({ id: userProfile._id, payload: payloadData })
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message)
      const updatedUser = {
        ...data?.data,
        date_of_birth: data?.data.date_of_birth ? new Date(data.data.date_of_birth as string) : undefined
      }
      form.reset(updatedUser)
    }
  }, [isSuccess])

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 sm:gap-5 mt-5 mb-6'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel htmlFor='name'>Họ và tên</FormLabel>
                <FormControl>
                  <Input id='name' placeholder='Họ và tên...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <FormControl>
                  <Input id='email' placeholder='Email...' {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel htmlFor='address'>Địa chỉ</FormLabel>
                <FormControl>
                  <Input id='address' placeholder='Địa chỉ...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3'>
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
              <FormItem className='col-span-2 sm:col-span-1'>
                <FormLabel htmlFor='date_of_birth'>Ngày sinh</FormLabel>
                <DatePicker value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem className='col-span-2 sm:col-span-1'>
                <FormLabel htmlFor='phone'>SĐT</FormLabel>
                <FormControl>
                  <Input id='phone' placeholder='SĐT...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='roles'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel htmlFor='roles'>Vai trò</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn(
                          'w-full justify-between overflow-hidden',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value && field.value.length > 0
                          ? field.value
                              .map((roleValue) => {
                                const roleLabel = rolesOptions.find((role) => role.value === roleValue)?.label
                                return roleLabel ? roleLabel : 'Phân quyền'
                              })
                              .join(', ')
                          : 'Phân quyền'}
                        <ArrowDownUp className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='xs:w-96 p-0'>
                    <Command>
                      <CommandGroup>
                        {rolesOptions.map((role) => (
                          <CommandItem
                            value={role.label}
                            key={role.value}
                            onSelect={() => {
                              form.setValue('roles', [role.value])
                            }}
                          >
                            {role.label}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                field.value?.includes(role.value) ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='is_blocked'
            render={({ field }) => (
              <FormItem className='col-span-2 sm:col-span-1 flex flex-row gap-3 space-y-0 items-center justify-between rounded-lg border p-3 shadow-sm'>
                <FormLabel>Khóa tài khoản?</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='is_email_verified'
            render={({ field }) => (
              <FormItem className='col-span-2 sm:col-span-1 flex flex-row gap-3 space-y-0 items-center justify-between rounded-lg border p-3 shadow-sm'>
                <FormLabel>Xác thực email?</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type='submit' disabled={isLoading} className='px-10'>
          {isLoading && <Loader className='animate-spin w-4 h-4 mr-1' />}
          Lưu lại
        </Button>
      </form>
    </Form>
  )
}
