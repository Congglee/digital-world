import { Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Input from 'src/components/Input'
import Button from 'src/components/Button'
import { Schema, schema } from 'src/utils/rules'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useFinalRegisterMutation } from 'src/redux/apis/auth.api'
import { useAppDispatch } from 'src/redux/hook'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated, setProfile } from 'src/redux/slices/auth.slice'
import { isEntityError } from 'src/utils/helper'

interface FinalRegisterModalProps {
  open: boolean
  closeModal: () => void
}

type FormData = Pick<Schema, 'register_token'>

const finalRegisterSchema = schema.pick(['register_token'])

export default function FinalRegisterModal(props: FinalRegisterModalProps) {
  const { open, closeModal } = props
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(finalRegisterSchema)
  })

  const [finalRegister, { isLoading, isSuccess, isError, data, error }] = useFinalRegisterMutation()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onSubmit = handleSubmit(async (data) => {
    await finalRegister(data)
  })

  useEffect(() => {
    if (isSuccess) {
      dispatch(setProfile(data?.data.data.user))
      dispatch(setAuthenticated(true))
      closeModal()
      navigate('/')
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
    <Transition appear show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10 font-Inter' onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                  Đăng ký tài khoản thành công
                </Dialog.Title>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>
                    Bạn đã đăng ký tài khoản thành công. Chúng tôi đã gửi cho bạn một email với mã OTP, vui lòng kiểm
                    tra email và sử dụng mã OTP đó để hoàn tất việc tạo tài khoản.
                  </p>
                </div>

                <div className='mt-4'>
                  <form onSubmit={onSubmit} noValidate>
                    <Input
                      name='register_token'
                      register={register}
                      type='text'
                      placeholder='Mã OTP'
                      errorMessage={errors.register_token?.message}
                    />
                    <div className='mt-1 flex gap-2'>
                      <Button
                        type='submit'
                        className='flex items-center justify-center space-x-2 rounded-md border border-transparent bg-purple px-4 py-2 text-sm font-medium text-white hover:bg-[#333] hover:opacity-90 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                        disabled={isLoading}
                        isLoading={isLoading}
                      >
                        Đăng ký
                      </Button>
                      <Button
                        type='button'
                        className='inline-flex justify-center rounded-md border border-transparent bg-gray-400 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 hover:opacity-90 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                        onClick={closeModal}
                      >
                        Hủy
                      </Button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
