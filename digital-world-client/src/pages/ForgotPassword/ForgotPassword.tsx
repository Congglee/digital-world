import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Breadcrumbs from 'src/components/Breadcrumbs'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { useForgotPasswordMutation } from 'src/redux/apis/auth.api'
import { useSendCommonMailMutation } from 'src/redux/apis/mail.api'
import { generateResetPasswordEmail } from 'src/utils/mail'
import { Schema, schema } from 'src/utils/rules'

type FormData = Pick<Schema, 'email'>

const forgotPasswordSchema = schema.pick(['email'])

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<FormData>({
    resolver: yupResolver(forgotPasswordSchema)
  })

  const [forgotPasswordMutation, { isLoading, isSuccess, data }] = useForgotPasswordMutation()
  const [sendMailMutation, sendMailMutationResult] = useSendCommonMailMutation()

  const onSubmit = handleSubmit(async (data) => {
    await forgotPasswordMutation(data)
  })

  useEffect(() => {
    const handleSendMail = async (token: string) => {
      const htmlContent = generateResetPasswordEmail(token)
      await sendMailMutation({
        email: getValues('email'),
        subject: 'Quên mật khẩu - Digital World 2',
        content: htmlContent
      })
    }
    if (isSuccess) {
      handleSendMail(data?.data.data.reset_password_token)
    }
  }, [isSuccess])

  useEffect(() => {
    if (sendMailMutationResult.isSuccess) {
      toast.success(data?.data.message)
    }
  }, [sendMailMutationResult.isSuccess])

  return (
    <>
      <Breadcrumbs currentPageName='Quên mật khẩu' />
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
                disabled={sendMailMutationResult.isLoading || isLoading}
                isLoading={sendMailMutationResult.isLoading || isLoading}
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
