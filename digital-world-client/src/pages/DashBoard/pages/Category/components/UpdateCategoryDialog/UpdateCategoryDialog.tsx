import { yupResolver } from '@hookform/resolvers/yup'
import { Loader } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Category } from 'src/types/category.type'
import { CategorySchema, categorySchema } from 'src/utils/rules'
import { useEffect } from 'react'
import { Input } from 'src/components/ui/input'
import { useUpdateCategoryMutation } from 'src/redux/apis/category.api'
import { toast } from 'react-toastify'
import { Brand } from 'src/types/brand.type'

interface UpdateCategoryDialogProps {
  open: boolean
  selectedCategory: Category | null
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  onAfterUpdate: React.Dispatch<React.SetStateAction<Category | null>>
  brands: Brand[]
}

type FormData = Pick<CategorySchema, 'name' | 'brands'>
const updateCategorySchema = categorySchema.pick(['name', 'brands'])

export default function UpdateCategoryDialog({
  open,
  onOpenChange,
  onAfterUpdate,
  selectedCategory,
  brands
}: UpdateCategoryDialogProps) {
  const form = useForm<FormData>({
    resolver: yupResolver(updateCategorySchema),
    defaultValues: { name: '', brands: [] }
  })
  const [updateCategoryMutation, { isLoading, isSuccess, data }] = useUpdateCategoryMutation()

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateCategoryMutation({ id: selectedCategory?._id as string, payload: data })
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

  useEffect(() => {
    if (selectedCategory) {
      const { name, brands } = selectedCategory
      form.reset({ name, brands: brands.map((brand) => brand._id) })
    }
  }, [selectedCategory])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] text-white'>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Cập nhật danh mục</DialogTitle>
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
                    <FormLabel htmlFor='brands'>Thương hiệu</FormLabel>
                    <div className='w-full text-[13px] font-medium border rounded-lg grid grid-cols-2 sm:grid-cols-3 gap-4 text-white p-4'>
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
            </div>
            <DialogFooter>
              <Button type='submit'>
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
