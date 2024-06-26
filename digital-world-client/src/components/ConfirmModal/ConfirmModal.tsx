import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Button from '../Button'
import { cn } from 'src/utils/utils'

interface ConfirmModalProps {
  open: boolean
  title: string
  description?: string
  closeModal: () => void
  confirmText?: string
  confirmButtonClassName?: string
  cancelText?: string
  cancelButtonClassName?: string
  handleConfirm: () => void
  isLoading?: boolean
}

export default function ConfirmModal({
  open,
  closeModal,
  title,
  description,
  confirmText,
  confirmButtonClassName,
  cancelText,
  cancelButtonClassName,
  handleConfirm,
  isLoading
}: ConfirmModalProps) {
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
          <div className='fixed inset-0 bg-black/50' />
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
              <Dialog.Panel className='w-full grid gap-4 max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <div className='space-y-1'>
                  <Dialog.Title as='h3' className='text-lg font-semibold leading-6 text-gray-900'>
                    {title}
                  </Dialog.Title>
                  <Dialog.Description as='p' className='text-sm text-[#71717a]'>
                    {description}
                  </Dialog.Description>
                </div>
                <div className='flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0'>
                  <Button
                    type='button'
                    className={cn(
                      'flex items-center justify-center space-x-2 rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-[#333] hover:opacity-90 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                      confirmButtonClassName
                    )}
                    disabled={isLoading}
                    isLoading={isLoading}
                    onClick={() => {
                      handleConfirm && handleConfirm()
                    }}
                  >
                    {confirmText || 'Xác nhận'}
                  </Button>
                  <Button
                    type='button'
                    className={cn(
                      'inline-flex justify-center rounded-md border border-transparent bg-gray-400 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 hover:opacity-90 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                      cancelButtonClassName
                    )}
                    onClick={closeModal}
                  >
                    {cancelText || 'Hủy'}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
