import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Breadcrumbs from 'src/components/Breadcrumbs'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { useForgotPasswordMutation } from 'src/redux/apis/auth.api'
import { Schema, schema } from 'src/utils/rules'

type FormData = Pick<Schema, 'email'>

const forgotPasswordSchema = schema.pick(['email'])

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(forgotPasswordSchema)
  })

  const [forgotPasswordMutation, { isLoading, isSuccess, data }] = useForgotPasswordMutation()

  const onSubmit = handleSubmit(async (data) => {
    await forgotPasswordMutation(data)
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.data.message)
    }
  }, [isSuccess])

  return (
    <>
      <Breadcrumbs />
      <div className='flex mt-5 mb-10 px-4 justify-center'>
        <div className='max-w-[495px] w-full text-[#505050]'>
          <div className='text-center mb-[10px]'>
            <h2 className='text-xl font-semibold uppercase'>Quên mật khẩu</h2>
            <p className='text-sm'>Chúng tôi sẽ gửi cho bạn một email để đặt lại mật khẩu của bạn.</p>
          </div>
          <form onSubmit={onSubmit} noValidate>
            <Input
              name='email'
              register={register}
              type='email'
              placeholder='Email'
              errorMessage={errors.email?.message}
            />
            <div className='mt-1'>
              <Button
                type='submit'
                className='w-full text-center uppercase bg-purple py-[11px] px-[15px] text-sm text-white hover:bg-[#333] hover:opacity-90 transition-colors flex items-center justify-center gap-2'
                disabled={isLoading}
                isLoading={isLoading}
              >
                Xác nhận
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
