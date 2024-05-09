import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Separator } from 'src/components/ui/separator'
import { Textarea } from 'src/components/ui/textarea'
import { storeConfig } from 'src/constants/config'
import SettingsHeading from 'src/pages/DashBoard/pages/Settings/components/SettingsHeading'
import { StoreSchema, storeSchema } from 'src/utils/rules'

type FormData = Pick<StoreSchema, 'name' | 'email' | 'address' | 'phoneNumber' | 'description'>
const settingsStoreSchema = storeSchema.pick(['name', 'email', 'phoneNumber', 'address', 'description'])

export default function SettingsStore() {
  const form = useForm<FormData>({
    resolver: yupResolver(settingsStoreSchema),
    defaultValues: {
      name: storeConfig.name,
      email: storeConfig.email,
      phoneNumber: storeConfig.phoneNumber,
      address: storeConfig.address,
      description: storeConfig.description
    }
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  })

  return (
    <>
      <SettingsHeading heading='Cửa hàng' description='Chỉnh sửa cấu hình thông tin cửa hàng của bạn' />
      <Separator className='my-6' />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className='bg-background shadow rounded-sm divide-y divide-[#e1e3e5]'>
            <div className='pb-5 space-y-2'>
              <h3 className='mb-2 font-semibold uppercase'>Thông tin cửa hàng</h3>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên cửa hàng</FormLabel>
                    <FormControl>
                      <Input placeholder='Tên cửa hàng...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả cửa hàng</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Nội dung mô tả cửa hàng...' className='h-20' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='py-5 space-y-2'>
              <h3 className='mb-2 font-semibold uppercase'>Thông tin liên hệ</h3>
              <div className='grid sm:grid-cols-2 gap-5'>
                <FormField
                  control={form.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SĐT cửa hàng</FormLabel>
                      <FormControl>
                        <Input placeholder='SĐT...' {...field} />
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
                      <FormLabel>Email cửa hàng</FormLabel>
                      <FormControl>
                        <Input placeholder='Email cửa hàng...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className='py-5 space-y-2'>
              <h3 className='mb-2 font-semibold uppercase'>Địa chỉ</h3>
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder='Địa chỉ cửa hàng...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit' className='mt-4'>
              Lưu lại
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
