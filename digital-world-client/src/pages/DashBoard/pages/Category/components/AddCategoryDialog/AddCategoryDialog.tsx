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
import { brands } from 'src/constants/data'
import { useAddCategoryMutation } from 'src/redux/apis/category.api'
import { CategorySchema, categorySchema } from 'src/utils/rules'

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

type FormData = Pick<CategorySchema, 'name' | 'brands'>
const createCategorySchema = categorySchema.pick(['name', 'brands'])

export default function AddCategoryDialog({ open, onOpenChange }: AddCategoryDialogProps) {
  const form = useForm<FormData>({
    resolver: yupResolver(createCategorySchema),
    defaultValues: { name: '', brands: [] }
  })
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
      <DialogContent className='sm:max-w-[425px] text-white'>
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
                  <FormItem className='col-span-3'>
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
                  <FormItem className='col-span-3'>
                    <FormLabel htmlFor='name'>Thương hiệu</FormLabel>
                    <div className='w-full text-sm font-medium border rounded-lg grid grid-cols-2 sm:grid-cols-3 gap-4 text-white p-4'>
                      {brands.map((brand) => (
                        <FormField
                          key={brand.name}
                          control={form.control}
                          name='brands'
                          render={({ field }) => {
                            return (
                              <FormItem key={brand.name} className='space-y-0 w-full flex items-center gap-2'>
                                <FormControl>
                                  <Checkbox
                                    id={brand.name}
                                    checked={field.value?.includes(brand.name)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, brand.name])
                                        : field.onChange(field.value?.filter((value) => value !== brand.name))
                                    }}
                                  />
                                </FormControl>
                                <label
                                  htmlFor={brand.name}
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
            </div>
            <DialogFooter>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader className='animate-spin w-4 h-4 mr-1' />}
                Thêm mới
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
