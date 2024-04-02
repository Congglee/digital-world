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
import { useAddUserMutation } from 'src/redux/apis/user.api'
import { VietNamProvince } from 'src/types/location.type'
import { Role } from 'src/types/user.type'
import { isEntityError } from 'src/utils/helper'
import { UserSchema, userSchema } from 'src/utils/rules'
import { cn } from 'src/utils/utils'
import DistrictPicker from 'src/components/AdminPanel/DistrictPicker'
import ProvincePicker from 'src/components/AdminPanel/ProvincePicker'
import WardPicker from 'src/components/AdminPanel/WardPicker'

interface AddUserDrawerProps {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  provinces: VietNamProvince[]
}

export type FormData = Pick<
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
  | 'password'
>
const addUserSchema = userSchema.pick([
  'name',
  'email',
  'password',
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
  password: '',
  address: '',
  province: '',
  district: '',
  ward: '',
  phone: '',
  roles: [],
  date_of_birth: new Date(1990, 0, 1),
  is_blocked: false
}

export default function AddUserDrawer({ open, onOpenChange, provinces }: AddUserDrawerProps) {
  const form = useForm<FormData>({
    resolver: yupResolver(addUserSchema),
    defaultValues: initialFormState
  })
  const [provinceId, setProvinceId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const { data: districtsData } = useGetProvinceDistrictsQuery(provinceId, { skip: provinceId ? false : true })
  const { data: wardsData } = useGetDistrictWardsQuery(districtId, { skip: districtId ? false : true })
  const [addUserMutaton, { data, isLoading, isSuccess, isError, error }] = useAddUserMutation()

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const payloadData = {
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        roles: data.roles as Role[],
        password: data.password as string
      }
      await addUserMutaton(payloadData)
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setProvinceId('')
      setDistrictId('')
    }
  }, [open])

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message)
      form.reset()
      onOpenChange(!open)
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

  return (
    <div className='flex flex-col gap-4'>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className='w-full sm:max-w-xl h-full text-foreground'>
          <ScrollArea className='w-full h-full rounded-md pr-5'>
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <SheetHeader>
                  <SheetTitle>Thêm mới tài khoản người dùng</SheetTitle>
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='password'>Mật khẩu</FormLabel>
                        <FormControl>
                          <Input
                            id='password'
                            type='password'
                            placeholder='Mật khẩu...'
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
