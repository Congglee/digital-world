import { yupResolver } from '@hookform/resolvers/yup'
import { Image, ImageUp, Loader } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Switch } from 'src/components/ui/switch'
import { Textarea } from 'src/components/ui/textarea'
import { useUpdatePaymentMethodMutation } from 'src/redux/apis/payment-method.api'
import { useUploadImagesMutation } from 'src/redux/apis/upload.api'
import { PaymentMethod } from 'src/types/payment.type'
import { PaymentMethodSchema, paymentMethodSchema } from 'src/utils/rules'
import { handleValidateFile } from 'src/utils/utils'

interface UpdatePaymentMethodDialogProps {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  selectedPaymentMethod: PaymentMethod | null
  onAfterUpdate: React.Dispatch<React.SetStateAction<PaymentMethod | null>>
}

type FormData = Pick<PaymentMethodSchema, 'name' | 'image' | 'is_actived' | 'description'>
const updatePaymentMethodSchema = paymentMethodSchema.pick(['name', 'image', 'is_actived', 'description'])

export default function UpdatePaymentMethodDialog({
  open,
  onOpenChange,
  selectedPaymentMethod,
  onAfterUpdate
}: UpdatePaymentMethodDialogProps) {
  const form = useForm<FormData>({
    resolver: yupResolver(updatePaymentMethodSchema),
    defaultValues: { name: '', image: '', is_actived: true, description: '' }
  })
  const paymentMethodImageFileRef = useRef<HTMLInputElement>(null)
  const [paymentMethodImageFile, setPaymentMethodImageFile] = useState<File | null>(null)
  const previewPaymentMethodImage = useMemo(() => {
    return paymentMethodImageFile ? URL.createObjectURL(paymentMethodImageFile) : ''
  }, [paymentMethodImageFile])

  useEffect(() => {
    if (selectedPaymentMethod) {
      const { name, image, is_actived, description } = selectedPaymentMethod
      form.reset({ name, image, is_actived, description })
    }
  }, [selectedPaymentMethod])

  const [uploadImages, uploadImagesResult] = useUploadImagesMutation()
  const [updatePaymentMethodMutation, { isLoading, isSuccess, data }] = useUpdatePaymentMethodMutation()

  const paymentMethodImage = form.watch('image')

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      let paymentMethodImageUrl = paymentMethodImage
      if (paymentMethodImageFile) {
        const formData = new FormData()
        formData.append('images', paymentMethodImageFile)
        const uploadRes = await uploadImages(formData)
        if ('data' in uploadRes && uploadRes.data) {
          paymentMethodImageUrl = uploadRes.data.data.data[0]?.url || ''
        }
      }
      await updatePaymentMethodMutation({
        id: selectedPaymentMethod?._id as string,
        payload: { ...data, image: paymentMethodImageUrl }
      })
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setPaymentMethodImageFile(null)
    }
  }, [open])

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.data.message)
      form.reset()
      onOpenChange(!open)
      onAfterUpdate(null)
    }
  }, [isSuccess])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] text-foreground overflow-y-auto scroll max-h-[600px]'>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Cập nhật phương thức thanh toán</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-5'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='name'>Tên phương thức thanh toán</FormLabel>
                    <FormControl>
                      <Input id='name' placeholder='Tên phương thức thanh toán...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ảnh</FormLabel>
                    <div className='flex flex-col gap-4 w-full'>
                      <FormControl>
                        <Input
                          {...form.register('image')}
                          accept='.jpg,.jpeg,.png,.webp'
                          className='hidden'
                          placeholder='Avatar...'
                          type='file'
                          ref={paymentMethodImageFileRef}
                          onChange={(event) => handleValidateFile(event, field.onChange, setPaymentMethodImageFile)}
                        />
                      </FormControl>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => {
                          paymentMethodImageFileRef.current?.click()
                        }}
                        className='max-w-full text-sm text-gray-600 shadow-sm space-x-2'
                      >
                        <ImageUp className='size-5' />
                        <span>Chọn ảnh</span>
                      </Button>
                      <FormMessage />
                      <div className='w-full h-40 border border-border rounded-md'>
                        {previewPaymentMethodImage || (selectedPaymentMethod && selectedPaymentMethod.image) ? (
                          <img
                            src={previewPaymentMethodImage || selectedPaymentMethod?.image}
                            alt='brand-image'
                            className='aspect-square w-full h-full'
                          />
                        ) : (
                          <Image className='size-full opacity-60' strokeWidth={0.8} />
                        )}
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='is_actived'
                render={({ field }) => (
                  <FormItem className='flex flex-row gap-3 space-y-0 items-center justify-between rounded-lg border p-3 shadow-sm'>
                    <FormLabel>Kích hoạt?</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú thêm</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Ghi chú thêm...' className='h-40' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type='submit' disabled={uploadImagesResult.isLoading || isLoading} className='px-10'>
                {uploadImagesResult.isLoading || isLoading ? <Loader className='animate-spin w-4 h-4 mr-1' /> : null}
                Lưu lại
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
