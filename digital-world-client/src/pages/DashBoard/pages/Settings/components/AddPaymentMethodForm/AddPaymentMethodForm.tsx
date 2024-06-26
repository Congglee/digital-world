import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUploadImagesMutation } from 'src/redux/apis/upload.api'
import { PaymentMethodSchema, paymentMethodSchema } from 'src/utils/rules'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { CardContent, CardFooter } from 'src/components/ui/card'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import { ImageUp, Loader } from 'lucide-react'
import { Switch } from 'src/components/ui/switch'
import { handleValidateFile } from 'src/utils/utils'
import { useAddPaymentMethodMutation } from 'src/redux/apis/payment.api'
import { toast } from 'react-toastify'
import { Textarea } from 'src/components/ui/textarea'

type FormData = Pick<PaymentMethodSchema, 'name' | 'image' | 'is_actived' | 'description'>
const addPaymentMethodSchema = paymentMethodSchema.pick(['name', 'image', 'is_actived', 'description'])

export default function AddPaymentMethodForm() {
  const form = useForm<FormData>({
    resolver: yupResolver(addPaymentMethodSchema),
    defaultValues: { name: '', image: '', is_actived: true, description: '' }
  })
  const paymentMethodImageFileRef = useRef<HTMLInputElement>(null)
  const [paymentMethodImageFile, setPaymentMethodImageFile] = useState<File | null>(null)
  const previewPaymentMethodImage = useMemo(() => {
    return paymentMethodImageFile ? URL.createObjectURL(paymentMethodImageFile) : ''
  }, [paymentMethodImageFile])

  const [uploadImages, uploadImagesResult] = useUploadImagesMutation()
  const [addPaymentMethod, { isLoading, isSuccess, data }] = useAddPaymentMethodMutation()

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
      await addPaymentMethod({ ...data, image: paymentMethodImageUrl })
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.data.message)
      form.reset()
      setPaymentMethodImageFile(null)
    }
  }, [isSuccess])

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <CardContent>
          <div className='grid w-full items-center gap-4'>
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
                  <FormLabel>Ảnh thương hiệu</FormLabel>
                  <div className='flex flex-col gap-4 w-1/2'>
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
                  </div>
                  {previewPaymentMethodImage && (
                    <div className='w-full max-w-[50%] h-40'>
                      <img src={previewPaymentMethodImage} alt='brand-image' className='aspect-square w-full h-full' />
                    </div>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='is_actived'
              render={({ field }) => (
                <FormItem className='flex flex-row gap-3 space-y-0 items-center'>
                  <FormLabel>Trạng thái?</FormLabel>
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
        </CardContent>
        <CardFooter className='flex justify-end'>
          <Button className='px-10' disabled={uploadImagesResult.isLoading || isLoading}>
            {uploadImagesResult.isLoading || isLoading ? <Loader className='animate-spin w-4 h-4 mr-1' /> : null}
            Lưu lại
          </Button>
        </CardFooter>
      </form>
    </Form>
  )
}
