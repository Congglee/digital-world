import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowDownUp, CheckIcon, Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import mapApi from 'src/apis/map.api'
import { Button } from 'src/components/ui/button'
import { Card } from 'src/components/ui/card'
import { Command, CommandGroup, CommandItem } from 'src/components/ui/command'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { deliveryStatusOptions } from 'src/static/options'
import { useDebounce } from 'src/hooks/useDebounce'
import { useUpdateUserOrderMutation } from 'src/redux/apis/order.api'
import { AutoCompleteAddress } from 'src/types/location.type'
import { Order } from 'src/types/order.type'
import { OrderSchema, orderSchema } from 'src/utils/rules'
import { cn } from 'src/utils/utils'
import Map from '../Map'

interface ShippingStatusDialogProps {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  order: Order
}

type FormData = Pick<OrderSchema, 'delivery_status'>
const updateUserOrderSchema = orderSchema.pick(['delivery_status'])

function getAddressFromDeliveryStatus(deliveryStatus: string) {
  const keyword = 'Đang giao đến'
  const index = deliveryStatus.indexOf(keyword)
  if (index !== -1) {
    return deliveryStatus.substring(index + keyword.length).trim()
  }
  return ''
}

export default function ShippingStatusDialog({ open, onOpenChange, order }: ShippingStatusDialogProps) {
  const form = useForm<FormData>({
    resolver: yupResolver(updateUserOrderSchema),
    defaultValues: { delivery_status: '' }
  })
  const [deliveryStatusOpen, setDeliveryStatusOpen] = useState<boolean>(false)
  const [isInProgress, setIsInProgress] = useState(order.delivery_status.includes('Đang giao') ? true : false)

  const initialSearchTextValue = order.delivery_status.includes('Đang giao')
    ? getAddressFromDeliveryStatus(order.delivery_status)
    : ''
  const [address, setAddress] = useState({ place: initialSearchTextValue, latitude: 0, longitude: 0 })
  const [autoCompleteAddress, setAutoCompleteAddress] = useState<AutoCompleteAddress[]>([])
  const [searchTextValue, setSearchTextValue] = useState<string>(initialSearchTextValue)
  const [updateUserOrder, { data, isSuccess, isLoading }] = useUpdateUserOrderMutation()

  useEffect(() => {
    if (order) {
      form.setValue('delivery_status', order.delivery_status)
    }
  }, [order, form.setValue])

  useEffect(() => {
    if (!open) {
      form.reset({ delivery_status: order.delivery_status })
      setIsInProgress(order.delivery_status.includes('Đang giao') ? true : false)
      setAddress((prevAddress) => ({ ...prevAddress, place: initialSearchTextValue }))
      setAutoCompleteAddress([])
    }
  }, [open])

  const getAutoCompleteAddress = async (query: string) => {
    const { data } = await mapApi.getAddressAutoComplete(query)
    setAutoCompleteAddress(data.data.results)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, place: event.target.value })
    setSearchTextValue(event.target.value)
  }
  const debouncedSearchValue = useDebounce(searchTextValue, 800)

  useEffect(() => {
    if (debouncedSearchValue) {
      getAutoCompleteAddress(debouncedSearchValue)
    } else {
      setAutoCompleteAddress([])
    }
  }, [debouncedSearchValue])

  const handleAutoCompleteAddressClick = (autoCompleteAddress: AutoCompleteAddress) => {
    const { lat, lon, formatted } = autoCompleteAddress
    if (lat && lon && formatted) {
      const address = { place: formatted, latitude: lat, longitude: lon }
      setAddress(address)
    }
    setAutoCompleteAddress([])
  }

  const handleUpdateCoordinates = (latitude: number, longitude: number) => {
    setAddress({ ...address, latitude, longitude })
  }

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      let deliveryStatus = data.delivery_status
      if (data.delivery_status.includes('Đang giao')) {
        if (address.place) {
          deliveryStatus = `Đang giao đến ${address.place}`
        } else {
          deliveryStatus = 'Đang giao'
        }
      } else {
        deliveryStatus = data.delivery_status
      }
      const payloadData = {
        order_status: order.order_status,
        payment_status: order.payment_status,
        delivery_status: deliveryStatus
      }
      await updateUserOrder({ id: order._id, payload: payloadData })
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.data.message)
    }
  }, [isSuccess])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[525px] overflow-y-auto scroll max-h-[680px] text-foreground'>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Trạng thái vận chuyển</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-5'>
              <FormField
                control={form.control}
                name='delivery_status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='order_status'>Trạng thái vận chuyển</FormLabel>
                    <Popover open={deliveryStatusOpen} onOpenChange={setDeliveryStatusOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'w-full justify-between overflow-hidden',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? deliveryStatusOptions.find((option) => field.value.includes(option.value))?.label
                              : 'Hãy chọn trạng thái vận chuyển'}
                            <ArrowDownUp className='xs:block ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0'>
                        <Command>
                          <CommandGroup>
                            {deliveryStatusOptions.map((deliveryStatus) => (
                              <CommandItem
                                value={deliveryStatus.label}
                                key={deliveryStatus.value}
                                onSelect={() => {
                                  form.setValue('delivery_status', deliveryStatus.value)
                                  form.getValues('delivery_status').includes('Đang giao')
                                    ? setIsInProgress(true)
                                    : setIsInProgress(false)
                                  setDeliveryStatusOpen(false)
                                }}
                              >
                                {deliveryStatus.label}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    field.value.includes(deliveryStatus.value) ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isInProgress && (
                <div className='space-y-2'>
                  <Label htmlFor='delivery_at'>Địa chỉ đang giao hàng tới</Label>
                  <div className='relative'>
                    <span className='inline-block text-xs mb-2'>{`Đang giao đến ${address.place ? address.place : '...'}`}</span>
                    <Input
                      id='address'
                      type='text'
                      placeholder='Vui lòng nhập vào địa chỉ đơn hàng đang được giao tới...'
                      value={address.place}
                      onChange={handleChange}
                    />
                    <ul className='absolute top-20 bg-accent overflow-hidden rounded-md text-foreground z-50 p-0 w-full divide-y-2'>
                      {autoCompleteAddress.map((address, index) => (
                        <li
                          key={index}
                          onClick={() => handleAutoCompleteAddressClick(address)}
                          className='list-none px-4 py-2 hover:bg-accent-foreground hover:text-muted-foreground hover:cursor-pointer text-sm'
                        >
                          {address.formatted}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <Card className='h-[450px] mb-5'>
              <Map
                latitude={address.latitude}
                longitude={address.longitude}
                handleUpdateCoordinates={handleUpdateCoordinates}
              />
            </Card>
            <DialogFooter>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader className='animate-spin w-4 h-4 mr-1' />}
                Lưu lại
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
