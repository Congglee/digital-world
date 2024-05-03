import { yupResolver } from '@hookform/resolvers/yup'
import omit from 'lodash/omit'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Breadcrumbs from 'src/components/Breadcrumbs'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { useRegisterMutation } from 'src/redux/apis/auth.api'
import { Schema, schema } from 'src/utils/rules'
import { isEntityError } from 'src/utils/helper'
import FinalRegisterModal from './components/FinalRegisterModal'

type FormData = Pick<Schema, 'name' | 'email' | 'password' | 'confirm_password'>

const registerSchema = schema.pick(['name', 'email', 'password', 'confirm_password'])

export default function Register() {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const [registerMutation, { isLoading, isSuccess, isError, data, error }] = useRegisterMutation()
  const [open, setOpen] = useState(false)

  const closeModal = () => {
    setOpen(false)
  }

  const openModal = () => {
    setOpen(true)
  }

  const onSubmit = handleSubmit(async (data) => {
    const body = omit(data, ['confirm_password'])
    await registerMutation(body)
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.data.message)
      openModal()
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError && isEntityError(error)) {
      const formError = error.data.data
      if (formError) {
        Object.entries(formError).forEach(([key, value]) => {
          setError(key as keyof Omit<FormData, 'confirm_password'>, {
            message: value as string,
            type: 'Server'
          })
        })
      }
    }
  }, [isError])

  return (
    <>
      <Breadcrumbs currentPageName='Đăng ký' />
      <div className='flex mt-5 mb-10 px-4 justify-center'>
        <div className='max-w-[495px] w-full'>
          <form onSubmit={onSubmit} noValidate>
            <Input
              name='name'
              register={register}
              type='text'
              placeholder='Họ và tên'
              errorMessage={errors.name?.message}
            />
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
                Đăng ký
              </Button>
            </div>
            <div className='mt-5 flex flex-col gap-2 items-center text-sm text-[#1c1d1d]'>
              <Link to={path.home}>Quay về cửa hàng</Link>
            </div>
          </form>
        </div>
      </div>
      <FinalRegisterModal open={open} closeModal={closeModal} />
    </>
  )
}
