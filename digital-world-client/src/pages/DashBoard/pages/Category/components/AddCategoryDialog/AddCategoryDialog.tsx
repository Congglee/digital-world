import { yupResolver } from '@hookform/resolvers/yup'
import { Loader } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Switch } from 'src/components/ui/switch'
import { useAddCategoryMutation } from 'src/redux/apis/category.api'
import { Brand } from 'src/types/brand.type'
import { CategorySchema, categorySchema } from 'src/utils/rules'

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  brands: Brand[]
}

type FormData = Pick<CategorySchema, 'name' | 'brands' | 'is_actived'>
const addCategorySchema = categorySchema.pick(['name', 'brands', 'is_actived'])

export default function AddCategoryDialog({ open, onOpenChange, brands }: AddCategoryDialogProps) {
  const unbranded = brands.find((brand) => brand.name === 'Unbranded')
  const form = useForm<FormData>({
    resolver: yupResolver(addCategorySchema),
    defaultValues: { name: '', brands: [], is_actived: true }
  })

  useEffect(() => {
    if (unbranded) {
      form.reset({ name: '', brands: [unbranded._id], is_actived: true })
    }
  }, [unbranded])

  const [addCategoryMutation, { isLoading, isSuccess, data }] = useAddCategoryMutation()

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await addCategoryMutation(data)
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
              <DialogTitle>Thêm mới danh mục</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-5'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='name'>Tên danh mục</FormLabel>
                    <FormControl>
                      <Input id='name' placeholder='Tên danh mục...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='brands'
                render={() => (
                  <FormItem>
                    <FormLabel htmlFor='name'>Thương hiệu</FormLabel>
                    <div className='w-full text-[13px] font-medium border rounded-lg grid grid-cols-2 sm:grid-cols-3 gap-4 p-4'>
                      {brands.map((brand) => (
                        <FormField
                          key={brand._id}
                          control={form.control}
                          name='brands'
                          render={({ field }) => {
                            return (
                              <FormItem key={brand._id} className='space-y-0 w-full flex items-center gap-2'>
                                <FormControl>
                                  <Checkbox
                                    id={brand._id}
                                    checked={brand.name === 'Unbranded' || field.value?.includes(brand._id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, brand._id])
                                        : field.onChange(field.value?.filter((value) => value !== brand._id))
                                    }}
                                    disabled={brand.name === 'Unbranded'}
                                  />
                                </FormControl>
                                <label
                                  htmlFor={brand._id}
                                  className='w-full peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
                                >
                                  {brand.name}
                                </label>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
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
              <Button type='submit' disabled={isLoading} className='px-10'>
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
