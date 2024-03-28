import { yupResolver } from '@hookform/resolvers/yup'
import { Loader } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { useAddBrandMutation } from 'src/redux/apis/brand.api'
import { BrandSchema, brandSchema } from 'src/utils/rules'

interface AddBrandDialogProps {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

type FormData = Pick<BrandSchema, 'name'>
const addBrandSchema = brandSchema.pick(['name'])

export default function AddBrandDialog({ open, onOpenChange }: AddBrandDialogProps) {
  const form = useForm<FormData>({
    resolver: yupResolver(addBrandSchema),
    defaultValues: { name: '' }
  })

  const [addBrandMutation, { isLoading, isSuccess, data }] = useAddBrandMutation()

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await addBrandMutation(data)
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
