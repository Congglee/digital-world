import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Breadcrumbs from 'src/components/Breadcrumbs'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { useLoginMutation } from 'src/redux/apis/auth.api'
import { useAppDispatch } from 'src/redux/hook'
import { setAuthenticated, setProfile } from 'src/redux/slices/auth.slice'
import { Schema, schema } from 'src/utils/rules'
import { isEntityError } from 'src/utils/helper'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const [login, { isLoading, isSuccess, isError, data, error }] = useLoginMutation()
  const dispatch = useAppDispatch()

  const onSubmit = handleSubmit(async (data) => {
    await login(data)
  })

  useEffect(() => {
    if (isSuccess) {
      dispatch(setProfile(data?.data.data.user))
      dispatch(setAuthenticated(true))
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError && isEntityError(error)) {
      const formError = error.data.data
      if (formError) {
        Object.entries(formError).forEach(([key, value]) => {
          setError(key as keyof FormData, {
            message: value as string,
            type: 'Server'
          })
        })
      }
    }
  }, [isError])

  return (
    <>
      <Breadcrumbs currentPageName='Đăng nhập' />
      <div className='flex mt-5 mb-10 px-4 justify-center'>
        <div className='max-w-[495px] w-full'>
          <form className='pb-8 mb-4' onSubmit={onSubmit} noValidate>
            <Input
              name='email'
              register={register}
              type='email'
              placeholder='Email'
              errorMessage={errors.email?.message}
            />
            <Input
              name='password'
              register={register}
              type='password'
              classNameEye='top-3'
              placeholder='Mật khẩu'
              errorMessage={errors.password?.message}
              autoComplete='on'
            />
            <div className='mt-1'>
              <Button
                type='submit'
                className='w-full text-center uppercase bg-purple py-[11px] px-[15px] text-sm text-white hover:bg-[#333] hover:opacity-90 transition-colors flex items-center justify-center gap-2'
                disabled={isLoading}
                isLoading={isLoading}
              >
                Đăng nhập
              </Button>
            </div>
            <div className='mt-5 flex flex-col gap-2 items-center text-sm text-[#1c1d1d]'>
              <Link to={path.register} className='capitalize'>
                Tạo tài khoản
              </Link>
              <Link to={path.home}>Quay về cửa hàng</Link>
              <Link to={path.forgotPassword}>Quên mật khẩu?</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
