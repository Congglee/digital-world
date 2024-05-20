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
import { useAddBrandMutation } from 'src/redux/apis/brand.api'
import { useUploadImagesMutation } from 'src/redux/apis/upload.api'
import { BrandSchema, brandSchema } from 'src/utils/rules'
import { handleValidateFile } from 'src/utils/utils'

interface AddBrandDialogProps {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

type FormData = Pick<BrandSchema, 'name' | 'image' | 'is_actived'>
const addBrandSchema = brandSchema.pick(['name', 'image', 'is_actived'])

export default function AddBrandDialog({ open, onOpenChange }: AddBrandDialogProps) {
  const form = useForm<FormData>({
    resolver: yupResolver(addBrandSchema),
    defaultValues: { name: '', image: '', is_actived: true }
  })
  const brandImageFileRef = useRef<HTMLInputElement>(null)
  const [brandImageFile, setBrandImageFile] = useState<File | null>(null)
  const previewBrandImage = useMemo(() => {
    return brandImageFile ? URL.createObjectURL(brandImageFile) : ''
  }, [brandImageFile])

  const [uploadImages, uploadImagesResult] = useUploadImagesMutation()
  const [addBrandMutation, { isLoading, isSuccess, data }] = useAddBrandMutation()

  const brandImage = form.watch('image')

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      let brandImageUrl = brandImage
      if (brandImageFile) {
        const formData = new FormData()
        formData.append('images', brandImageFile)
        const uploadRes = await uploadImages(formData)
        if ('data' in uploadRes && uploadRes.data) {
          brandImageUrl = uploadRes.data.data.data[0]?.url || ''
        }
      }
      await addBrandMutation({ ...data, image: brandImageUrl })
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setBrandImageFile(null)
    }
  }, [open])

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.data.message)
      form.reset()
      onOpenChange(!open)
    }
  }, [isSuccess])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] text-foreground'>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Thêm mới thương hiệu</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-5'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='name'>Tên thương hiệu</FormLabel>
                    <FormControl>
                      <Input id='name' placeholder='Tên thương hiệu...' {...field} />
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
                    <div className='flex flex-col gap-4 w-full'>
                      <FormControl>
                        <Input
                          {...form.register('image')}
                          accept='.jpg,.jpeg,.png,.webp'
                          className='hidden'
                          placeholder='Avatar...'
                          type='file'
                          ref={brandImageFileRef}
                          onChange={(event) => handleValidateFile(event, field.onChange, setBrandImageFile)}
                        />
                      </FormControl>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => {
                          brandImageFileRef.current?.click()
                        }}
                        className='max-w-full text-sm text-gray-600 shadow-sm space-x-2'
                      >
                        <ImageUp className='size-5' />
                        <span>Chọn ảnh</span>
                      </Button>
                      <FormMessage />
                      <div className='w-full h-64 border border-border rounded-md'>
                        {previewBrandImage !== '' ? (
                          <img src={previewBrandImage} alt='brand-image' className='w-full h-full object-contain' />
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
                    <FormLabel>Trạng thái?</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
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
