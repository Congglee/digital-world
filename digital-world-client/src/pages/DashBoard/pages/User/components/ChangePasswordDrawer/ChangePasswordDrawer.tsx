import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from 'src/components/ui/sheet'
import { useUpdateUserMutation } from 'src/redux/apis/user.api'
import { User } from 'src/types/user.type'
import { UserSchema, userSchema } from 'src/utils/rules'
import omit from 'lodash/omit'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Loader } from 'lucide-react'

interface ChangePasswordDrawerProps {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  selectedUser: User | null
  onAfterUpdate: React.Dispatch<React.SetStateAction<User | null>>
}

type FormData = Pick<UserSchema, 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['new_password', 'confirm_password'])

export default function ChangePasswordDrawer({
  open,
  onOpenChange,
  selectedUser,
  onAfterUpdate
}: ChangePasswordDrawerProps) {
  const form = useForm<FormData>({
    resolver: yupResolver(passwordSchema),
    defaultValues: { confirm_password: '', new_password: '' }
  })
  const [updateUserMutation, { data, isLoading, isSuccess }] = useUpdateUserMutation()

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const payloadData = {
        password: data.new_password,
        ...omit(data, ['new_password', 'confirm_password'])
      }
      await updateUserMutation({ id: selectedUser?._id!, payload: payloadData })
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message, { position: 'top-center' })
      form.reset()
    }
  }, [isSuccess])

  return (
    <div className='flex flex-col gap-4'>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className='w-full sm:max-w-lg h-full text-foreground'>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <SheetHeader>
                <SheetTitle>Đổi mật khẩu tài khoản người dùng</SheetTitle>
              </SheetHeader>
              <div className='grid gap-4 mt-4'>
                <FormField
                  control={form.control}
                  name='new_password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='password'>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input
                          id='password'
                          type='password'
                          placeholder='Mật khẩu mới...'
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
                  name='confirm_password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='confirm_password'>Xác nhận mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input
                          id='confirm_password'
                          type='password'
                          placeholder='Xác nhận mật khẩu mới...'
                          {...field}
                          className='border-2 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:border-foreground'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type='submit' className='w-full mt-5' disabled={isLoading}>
                {isLoading && <Loader className='animate-spin w-4 h-4 mr-1' />}
                Lưu lại
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
