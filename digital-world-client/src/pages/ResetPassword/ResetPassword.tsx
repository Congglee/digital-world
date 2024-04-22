import { yupResolver } from '@hookform/resolvers/yup'
import omit from 'lodash/omit'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Breadcrumbs from 'src/components/Breadcrumbs'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { useResetPasswordMutation } from 'src/redux/apis/auth.api'
import { Schema, schema } from 'src/utils/rules'

type FormData = Pick<Schema, 'password' | 'confirm_password'>

const resetPasswordSchema = schema.pick(['password', 'confirm_password'])

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(resetPasswordSchema)
  })
  const { token } = useParams() as { token: string }
  const [resetPasswordMutation, { isLoading, isSuccess, data }] = useResetPasswordMutation()
  const navigate = useNavigate()

  const onSubmit = handleSubmit(async (data) => {
    const body = omit(data, ['confirm_password'])
    await resetPasswordMutation({ ...body, token })
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.data.message)
      navigate(path.login)
    }
  }, [isSuccess])

  return (
    <>
      <Breadcrumbs />
      <div className='flex mt-5 mb-10 px-4 justify-center'>
        <div className='max-w-[495px] w-full text-[#505050]'>
          <div className='text-center mb-[10px]'>
            <h2 className='text-xl font-semibold uppercase'>Đặt lại mật khẩu</h2>
          </div>
          <form onSubmit={onSubmit} noValidate>
            <Input
              name='password'
              register={register}
              type='password'
              classNameEye='top-3'
              placeholder='Mật khẩu'
              errorMessage={errors.password?.message}
              autoComplete='on'
            />
            <Input
              name='confirm_password'
              register={register}
              type='password'
              classNameEye='top-3'
              placeholder='Xác nhận mật khẩu'
              errorMessage={errors.confirm_password?.message}
              autoComplete='on'
            />
            <div className='mt-1'>
              <Button
                type='submit'
                className='w-full text-center uppercase bg-purple py-[11px] px-[15px] text-sm text-white hover:bg-[#333] hover:opacity-90 transition-colors flex items-center justify-center gap-2'
                disabled={isLoading}
                isLoading={isLoading}
              >
                Cập nhật
              </Button>
            </div>
            <div className='mt-5 flex flex-col gap-2 items-center text-sm text-[#1c1d1d]'>
              <Link to={path.home}>Hủy</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
