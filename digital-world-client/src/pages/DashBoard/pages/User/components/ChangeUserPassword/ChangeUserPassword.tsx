import { yupResolver } from '@hookform/resolvers/yup'
import omit from 'lodash/omit'
import { Loader } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { useUpdateUserMutation } from 'src/redux/apis/user.api'
import { User } from 'src/types/user.type'
import { UserSchema, userSchema } from 'src/utils/rules'

interface ChangeUserPasswordProps {
  userProfile: User
}

type FormData = Pick<UserSchema, 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['new_password', 'confirm_password'])

export default function ChangeUserPassword({ userProfile }: ChangeUserPasswordProps) {
  const form = useForm<FormData>({
    resolver: yupResolver(passwordSchema),
    defaultValues: { confirm_password: '', new_password: '' }
  })
  const [updateUser, { data, isLoading, isSuccess }] = useUpdateUserMutation()

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const payloadData = {
        password: data.new_password,
        ...omit(data, ['new_password', 'confirm_password'])
      }
      await updateUser({ id: userProfile._id, payload: payloadData })
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message)
      form.reset()
    }
  }, [isSuccess])

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className='grid gap-4 sm:gap-5 mt-5 mb-6'>
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
        <Button type='submit' className='px-10' disabled={isLoading}>
          {isLoading && <Loader className='animate-spin w-4 h-4 mr-1' />}
          Lưu lại
        </Button>
      </form>
    </Form>
  )
}
