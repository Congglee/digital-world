import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowDownUp, CheckIcon, Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import DatePicker from 'src/components/AdminPanel/DatePicker'
import { Button } from 'src/components/ui/button'
import { Command, CommandGroup, CommandItem } from 'src/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { ScrollArea } from 'src/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from 'src/components/ui/sheet'
import { Switch } from 'src/components/ui/switch'
import { rolesOptions } from 'src/constants/options'
import { useGetDistrictWardsQuery, useGetProvinceDistrictsQuery } from 'src/redux/apis/location.api'
import { useUpdateUserMutation } from 'src/redux/apis/user.api'
import { VietNamProvince } from 'src/types/location.type'
import { Role, User } from 'src/types/user.type'
import { UserSchema, userSchema } from 'src/utils/rules'
import { cn } from 'src/utils/utils'
import ProvincePicker from 'src/components/AdminPanel/ProvincePicker'
import DistrictPicker from 'src/components/AdminPanel/DistrictPicker'
import WardPicker from 'src/components/AdminPanel/WardPicker'

interface UpdateUserDrawerProps {
  open: boolean
  selectedUser: User | null
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  onAfterUpdate: React.Dispatch<React.SetStateAction<User | null>>
  provinces: VietNamProvince[]
}

type FormData = Pick<
  UserSchema,
  'name' | 'email' | 'phone' | 'address' | 'province' | 'district' | 'ward' | 'date_of_birth' | 'roles' | 'is_blocked'
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
  'is_blocked'
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
  is_blocked: false
}

export default function UpdateUserDrawer({ open, onOpenChange, selectedUser, provinces }: UpdateUserDrawerProps) {
  const form = useForm<FormData>({
    resolver: yupResolver(updateUserSchema),
    defaultValues: initialFormState
  })

  const [provinceId, setProvinceId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const { data: districtsData } = useGetProvinceDistrictsQuery(provinceId, {
    skip: provinceId && provinceId !== '' ? false : true
  })
  const { data: wardsData } = useGetDistrictWardsQuery(districtId, {
    skip: districtId && districtId !== '' ? false : true
  })
  const [updateUserMutation, { data, isLoading, isSuccess }] = useUpdateUserMutation()

  useEffect(() => {
    if (selectedUser) {
      const selectedProvince = provinces.find((province) => province.province_name === selectedUser.province)
      setProvinceId(selectedProvince?.province_id.toString()!)

      const selectedDistrict = districtsData?.data.results.find(
        (district) => district.district_name === selectedUser.district
      )
      setDistrictId(selectedDistrict?.district_id.toString()!)

      form.reset({
        name: selectedUser.name,
        email: selectedUser.email,
        address: selectedUser.address || '',
        province: selectedUser.province || '',
        district: selectedUser.district || '',
        ward: selectedUser.ward || '',
        phone: selectedUser.phone || '',
        roles: selectedUser.roles,
        date_of_birth: selectedUser.date_of_birth ? new Date(selectedUser.date_of_birth) : undefined,
        is_blocked: selectedUser.is_blocked
      })
    }
  }, [selectedUser])

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const payloadData = {
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        roles: data.roles as Role[]
      }
      await updateUserMutation({ id: selectedUser?._id!, payload: payloadData })
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message, { position: 'top-center' })
      const updatedUser = {
        ...data?.data,
        date_of_birth: data?.data.date_of_birth ? new Date(data.data.date_of_birth as string) : undefined
      }
      form.reset(updatedUser)
    }
  }, [isSuccess])

  return (
    <div className='flex flex-col gap-4'>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className='w-full sm:max-w-xl h-full text-foreground'>
          <ScrollArea className='w-full h-full rounded-md pr-5'>
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <SheetHeader>
                  <SheetTitle>Cập nhật tài khoản người dùng</SheetTitle>
                </SheetHeader>
                <div className='grid gap-4 mt-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='name'>Họ và tên</FormLabel>
                        <FormControl>
                          <Input
                            id='name'
                            placeholder='Họ và tên...'
                            {...field}
                            className='border-2 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:border-foreground'
                          />
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
                        <FormLabel htmlFor='email'>Email</FormLabel>
                        <FormControl>
                          <Input
                            id='email'
                            placeholder='Email...'
                            {...field}
                            className='border-2 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:border-foreground'
                            disabled
                          />
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
                        <FormLabel htmlFor='address'>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input
                            id='address'
                            placeholder='Địa chỉ...'
                            className='border-2 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:border-foreground'
                            {...field}
                          />
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
                            provinces={provinces}
                            setValue={form.setValue}
                            handleSetProvinceId={setProvinceId}
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
                            setValue={form.setValue}
                            provinceId={provinceId}
                            handleSetDistrictId={setDistrictId}
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
                            setValue={form.setValue}
                            wards={wardsData?.data.results || []}
                            districtId={districtId}
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
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='phone'>SĐT</FormLabel>
                        <FormControl>
                          <Input
                            id='phone'
                            placeholder='SĐT...'
                            {...field}
                            className='border-2 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:border-foreground'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='roles'
                    render={({ field }) => (
                      <FormItem>
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
                      <FormItem className='flex items-center gap-4'>
                        <FormLabel>Khóa tài khoản?</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} style={{ marginTop: 0 }} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type='submit' disabled={isLoading} className='w-full mt-5'>
                  {isLoading && <Loader className='animate-spin w-4 h-4 mr-1' />}
                  Lưu lại
                </Button>
              </form>
            </Form>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
