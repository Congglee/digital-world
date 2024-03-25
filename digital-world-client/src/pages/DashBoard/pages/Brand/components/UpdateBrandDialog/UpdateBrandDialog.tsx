import { yupResolver } from '@hookform/resolvers/yup'
import { Loader } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { useUpdateBrandMutation } from 'src/redux/apis/brand.api'
import { Brand } from 'src/types/brand.type'
import { BrandSchema, brandSchema } from 'src/utils/rules'

interface UpdateBrandDialogProps {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  onAfterUpdate: React.Dispatch<React.SetStateAction<Brand | null>>
  selectedBrand: Brand | null
}

type FormData = Pick<BrandSchema, 'name'>
const updateBrandSchema = brandSchema.pick(['name'])

export default function UpdateBrandDialog({
  open,
  onOpenChange,
  selectedBrand,
  onAfterUpdate
}: UpdateBrandDialogProps) {
  const form = useForm<FormData>({
    resolver: yupResolver(updateBrandSchema),
    defaultValues: { name: '' }
  })

  useEffect(() => {
    if (selectedBrand) {
      const { name } = selectedBrand
      form.reset({ name })
    }
  }, [selectedBrand])

  const [updateBrandMutation, { isLoading, isSuccess, data }] = useUpdateBrandMutation()

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateBrandMutation({ id: selectedBrand?._id as string, payload: data })
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (!open) {
      form.reset()
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
      <DialogContent className='sm:max-w-[425px] text-white'>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Cập nhật thương hiệu</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-5'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='col-span-3'>
                    <FormLabel htmlFor='name'>Tên thương hiệu</FormLabel>
                    <FormControl>
                      <Input id='name' placeholder='Tên thương hiệu...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
