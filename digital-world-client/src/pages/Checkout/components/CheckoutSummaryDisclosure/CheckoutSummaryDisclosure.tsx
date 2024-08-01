import { Disclosure, Transition } from '@headlessui/react'
import { ChevronUp, ShoppingCart } from 'lucide-react'
import CheckoutSummary, { CheckoutPurchaseCart } from 'src/pages/Checkout/components/CheckoutSummary/CheckoutSummary'
import { cn } from 'src/utils/utils'

export default function CheckoutSummaryDisclosure({
  checkoutPurchasesCart
}: {
  checkoutPurchasesCart: CheckoutPurchaseCart[]
}) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className='flex md:hidden w-full justify-between rounded-lg bg-[#ebebeb] px-4 py-2 text-left text-sm font-medium text-[#2c6ecb]/80 hover:bg-[#ebebeb]/60 focus:outline-none focus-visible:ring focus-visible:ring-[#ebebeb]/75 mb-3'>
            <div className='flex items-center gap-2'>
              <ShoppingCart className='w-4 h-4' />
              <span>Hiển thị tóm tắt đơn hàng</span>
            </div>
            <ChevronUp
              className={cn('h-5 w-5 text-[#2c6ecb]/80 transition-transform', open && 'rotate-180 transform')}
            />
          </Disclosure.Button>
          <Transition
            show={open}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Disclosure.Panel
              as='div'
              className='px-4 pb-2 pt-4 text-sm text-gray-500 bg-[#fafafa] overflow-auto w-full'
            >
              <CheckoutSummary checkoutPurchasesCart={checkoutPurchasesCart} />
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}
