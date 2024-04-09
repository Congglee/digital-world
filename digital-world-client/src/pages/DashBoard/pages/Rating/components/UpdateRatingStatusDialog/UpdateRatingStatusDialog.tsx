import { yupResolver } from '@hookform/resolvers/yup'
import { Loader } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from 'src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from 'src/components/ui/form'
import { Switch } from 'src/components/ui/switch'
import { useUpdateRatingStatusMutation } from 'src/redux/apis/product.api'
import { Product, Rating } from 'src/types/product.type'
import { RatingSchema, ratingSchema } from 'src/utils/rules'

interface UpdateRatingStatusDialogProps {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  selectedRating: Rating | null
  onAfterUpdate: React.Dispatch<React.SetStateAction<string | Rating | null>>
  product: Product
}

type FormData = Pick<RatingSchema, 'publish'>
const updateRatingStatusSchema = ratingSchema.pick(['publish'])

export default function UpdateRatingStatusDialog({
  open,
  onOpenChange,
  selectedRating,
  onAfterUpdate,
  product
}: UpdateRatingStatusDialogProps) {
  const form = useForm<FormData>({
    resolver: yupResolver(updateRatingStatusSchema),
    defaultValues: { publish: false }
  })
  const [updateRatingStatusMutation, { isLoading, isSuccess, data }] = useUpdateRatingStatusMutation()

  useEffect(() => {
    if (selectedRating) {
      const { publish } = selectedRating
      form.reset({ publish })
    }
  }, [selectedRating])

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateRatingStatusMutation({ product_id: product._id, rating_id: selectedRating?._id!, payload: data })
    } catch (error) {
      console.log(error)
    }
  })

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
      <DialogContent className='sm:max-w-[425px] text-foreground'>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Cập nhật đánh giá</DialogTitle>
              <DialogDescription>Cập nhật trạng thái hiển thị của đánh giá</DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-5'>
              <FormField
                control={form.control}
                name='publish'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Hiển thị?</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
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
