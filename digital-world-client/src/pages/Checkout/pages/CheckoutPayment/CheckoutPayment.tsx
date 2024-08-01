import { yupResolver } from '@hookform/resolvers/yup'
import { ChevronUpIcon, Circle } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from 'src/components/Button'
import { CircleCheckBig } from 'src/components/Icons/Icons'
import { Checkbox } from 'src/components/ui/checkbox'
import path from 'src/constants/path'
import { paymentMethodOptions } from 'src/constants/payment'
import { useHandleAddressData } from 'src/hooks/useHandleAddressData'
import BillingAddress from 'src/pages/Checkout/components/BillingAddress'
import CheckoutBreadcrumbs from 'src/pages/Checkout/components/CheckoutBreadcrumbs'
import CheckoutSummary from 'src/pages/Checkout/components/CheckoutSummary'
import CheckoutSummaryDisclosure from 'src/pages/Checkout/components/CheckoutSummaryDisclosure'
import { type FormData as CheckoutProfileType } from 'src/pages/Checkout/pages/CheckoutProfile/CheckoutProfile'
import { useAddOrderMutation } from 'src/redux/apis/order.api'
import {
  useCreatePayPalPaymentMutation,
  useCreateStripePaymentMutation,
  useGetAllPaymentMethodsQuery
} from 'src/redux/apis/payment.api'
import { useAppSelector } from 'src/redux/hook'
import { ExtendedPurchaseCart } from 'src/types/cart.type'
import { orderSchema, OrderSchema } from 'src/utils/rules'
import { cn } from 'src/utils/utils'

export type FormData = Pick<OrderSchema, 'billing_address' | 'billing_province' | 'billing_district' | 'billing_ward'>
const updateOrderProfileSchema = orderSchema.pick([
  'billing_address',
  'billing_province',
  'billing_district',
  'billing_ward'
])

export default function CheckoutPayment() {
  const form = useForm<FormData>({
    resolver: yupResolver(updateOrderProfileSchema),
    defaultValues: {
      billing_address: '',
      billing_province: '',
      billing_district: '',
      billing_ward: ''
    }
  })
  const { handleSubmit, setValue, reset, watch } = form

  const { data: paymentMethodData } = useGetAllPaymentMethodsQuery()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [open, setOpen] = useState<boolean>(true)
  const { provinceData, districtsData, wardsData, setProvinceId, setDistrictId } = useHandleAddressData({
    watch,
    provinceFieldName: 'billing_province',
    districtFieldName: 'billing_district'
  })
  const { profile } = useAppSelector((state) => state.auth)
  const checkoutProfile: CheckoutProfileType = JSON.parse(localStorage.getItem('checkout-profile')!)
  const checkoutPurchasesCart = JSON.parse(
    localStorage.getItem('checkout-purchases-cart') || '[]'
  ) as ExtendedPurchaseCart[]

  useEffect(() => {
    if (checkoutProfile) {
      reset({
        billing_address: checkoutProfile.shipping_address,
        billing_province: checkoutProfile.shipping_province,
        billing_district: checkoutProfile.shipping_district,
        billing_ward: checkoutProfile.shipping_ward
      })
    }
  }, [reset])

  useEffect(() => {
    if (paymentMethodData && paymentMethodData.data.payment_methods.length > 0) {
      const initialPaymentMethod = paymentMethodData.data.payment_methods
        .filter((item) => item.is_actived)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0]
      setPaymentMethod(initialPaymentMethod.name)
    }
  }, [paymentMethodData])

  const [addOrder, { data, isSuccess, isLoading }] = useAddOrderMutation()
  const [createStripePayment, createStripePaymentResult] = useCreateStripePaymentMutation()
  const [createPayPalPayment, createPayPalPaymentResult] = useCreatePayPalPaymentMutation()

  const orderDeliveryAt = checkoutProfile
    ? `${checkoutProfile.shipping_address}, ${checkoutProfile.shipping_ward && `${checkoutProfile.shipping_ward}, `} ${checkoutProfile.shipping_district}, ${checkoutProfile.shipping_province}`
    : ''

  const handleSelectProvince = (provinceId: string, provinceValue: string) => {
    setProvinceId(provinceId)
    setDistrictId('')
    setValue('billing_province', provinceValue)
    setValue('billing_district', '')
    setValue('billing_ward', '')
  }

  const handleSelectDistrict = (districtId: string, districtValue: string) => {
    setDistrictId(districtId)
    setValue('billing_district', districtValue)
    setValue('billing_ward', '')
  }

  const handleSelectWard = (wardValue: string) => {
    setValue('billing_ward', wardValue)
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payloadData = {
        ...checkoutProfile,
        ...data,
        payment_method: paymentMethod
      }
      if (paymentMethod === paymentMethodOptions.stripeGateWay) {
        await createStripePayment(payloadData)
      } else {
        await addOrder(payloadData)
      }
    } catch (error) {
      console.log(error)
    }
  })

  const handleCreatePayPalPayment = useCallback(async (order_id: string, order_code: string, total_amount: number) => {
    await createPayPalPayment({
      order_id,
      order_code,
      total_amount
    })
  }, [])

  useEffect(() => {
    if (isSuccess) {
      if (paymentMethod === paymentMethodOptions.paypalGateWay) {
        handleCreatePayPalPayment(data?.data.data._id, data?.data.data.order_code, data?.data.data.total_amount)
      } else {
        toast.success(data?.data.message)
        navigate(path.checkoutSuccess.replace(':order_code', data?.data.data.order_code as string))
        localStorage.removeItem('checkout-profile')
        localStorage.removeItem('checkout-purchases-cart')
      }
    }
  }, [isSuccess])

  useEffect(() => {
    if (createStripePaymentResult.isSuccess) {
      const { data: createStripePaymentData } = createStripePaymentResult
      window.location.href = createStripePaymentData?.data.data.url
      localStorage.removeItem('checkout-profile')
      localStorage.removeItem('checkout-purchases-cart')
    }
  }, [createStripePaymentResult.isSuccess])

  useEffect(() => {
    if (createPayPalPaymentResult.isSuccess) {
      const { data: createPayPalPaymentData } = createPayPalPaymentResult
      const { links } = createPayPalPaymentData?.data.data
      const payerActionUrl = links.find((link) => link.rel === 'payer-action')!
      window.location.href = payerActionUrl.href
      localStorage.removeItem('checkout-profile')
      localStorage.removeItem('checkout-purchases-cart')
    }
  }, [createPayPalPaymentResult.isSuccess])

  if (!profile) return null

  if (!checkoutProfile) {
    navigate(path.checkoutProfile)
    return null
  }

  return (
    <>
      <CheckoutSummaryDisclosure checkoutPurchasesCart={checkoutPurchasesCart} />
      <div className='grid md:grid-cols-2 gap-[30px]'>
        <div className='mt-1 mb-5'>
          <CheckoutBreadcrumbs active='payment' />
          <FormProvider {...form}>
            <form onSubmit={onSubmit}>
              <div className='mt-1'>
                <div className='px-5 border border-[#e1e3e5] rounded-sm divide-y'>
                  <div className='grid gap-1 xs:grid-cols-4 py-[10px]'>
                    <div className='col-span-1'>
                      <span>Liên hệ</span>
                    </div>
                    <div className='col-span-2'>
                      <span>{profile.email}</span>
                    </div>
                    <div className='col-span-1 flex justify-end'></div>
                  </div>
                  <div className='grid gap-1 xs:grid-cols-4 py-[10px]'>
                    <div className='col-span-1'>
                      <span>Giao tới</span>
                    </div>
                    <div className='col-span-2'>{orderDeliveryAt}</div>
                    <div className='col-span-1 xs:flex xs:justify-end'>
                      <Link to={path.checkoutProfile} className='text-[#2c6ecb] hover:underline'>
                        Sửa
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-[30px]'>
                <h4 className='mb-[10px] capitalize text-2xl'>Địa chỉ thanh toán</h4>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='address'
                    className='w-4 h-4 data-[state=checked]:border-[#2c6ecb] data-[state=checked]:bg-[#2c6ecb]'
                    onCheckedChange={(checked) => {
                      reset()
                      setOpen(checked as boolean)
                    }}
                    checked={open}
                  />
                  <label htmlFor='address' className='text-[#6d7175] cursor-pointer'>
                    Địa chỉ thanh toán giống với địa chỉ giao hàng
                  </label>
                </div>
                {!open && (
                  <div className='space-y-3 mt-2'>
                    <BillingAddress
                      provinces={provinceData?.data.results || []}
                      onSelectProvince={handleSelectProvince}
                      districts={districtsData?.data.results || []}
                      onSelectDistrict={handleSelectDistrict}
                      wards={wardsData?.data.results || []}
                      onSelectWard={handleSelectWard}
                    />
                  </div>
                )}
              </div>
              <div className='mt-[30px]'>
                <h4 className='mb-[10px] capitalize text-2xl'>Phương thức thanh toán</h4>
                <div className='w-full border border-[#e1e3e5] divide-y'>
                  {paymentMethodData &&
                    paymentMethodData.data.payment_methods
                      .filter((paymentMethod) => paymentMethod.is_actived)
                      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                      .map((item) => {
                        const isOpen = paymentMethod === item.name
                        return (
                          <div className='border-[#e1e3e5]' key={item._id}>
                            <button
                              type='button'
                              className={cn(
                                'flex items-center justify-between w-full px-5 py-4 focus:outline-none focus-visible:ring focus-visible:ring-[#2c6ecb]/75',
                                isOpen && 'bg-[#2c6ecb]/20'
                              )}
                              onClick={() => {
                                setPaymentMethod(item.name)
                              }}
                            >
                              <div className='flex items-center gap-4'>
                                {isOpen ? (
                                  <CircleCheckBig className='w-5 h-5 text-[#2c6ecb]' />
                                ) : (
                                  <Circle className='w-5 h-5 text-gray-500' />
                                )}
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className='w-28 h-12 hidden xs:block object-contain'
                                  />
                                )}
                                <span className='text-sm font-medium text-[#3a3a3a]'>{item.name}</span>
                              </div>
                              {item.description && (
                                <ChevronUpIcon className={cn('h-5 w-5', isOpen && 'rotate-180 transform')} />
                              )}
                            </button>
                            {isOpen && item.description && (
                              <div className='p-5 pt-0 text-sm text-gray-500 bg-[#2c6ecb]/20'>
                                <div className='border border-gray-400 rounded p-3'>{item.description}</div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                </div>
                <div className='flex justify-end mt-5'>
                  <Button
                    type='submit'
                    className='flex items-center justify-center gap-2 p-5 text-white bg-[#3a3a3a] shadow-[0_1px_0_rgba(0,_0,_0,_.05),_inset_0_-1px_0_rgba(0,_0,_0,_0.2)] hover:bg-purple transition-colors'
                    disabled={createStripePaymentResult.isLoading || createPayPalPaymentResult.isLoading || isLoading}
                    isLoading={createStripePaymentResult.isLoading || createPayPalPaymentResult.isLoading || isLoading}
                  >
                    Đặt Đơn
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
        <div className='hidden md:block pl-5 pt-[30px] pb-5 relative after:content-[""] after:absolute after:top-0 after:left-0 after:block after:w-[400%] after:bottom-0 after:bg-[#fafafa] after:-z-10 border-l border-[#e1e3e5]'>
          <CheckoutSummary checkoutPurchasesCart={checkoutPurchasesCart} />
        </div>
      </div>
    </>
  )
}
