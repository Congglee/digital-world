import { yupResolver } from '@hookform/resolvers/yup'
import { ImageUp, List, Loader, Trash } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import RichTextEditor from 'src/components/AdminPanel/RichTextEditor'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { Switch } from 'src/components/ui/switch'
import config from 'src/constants/config'
import path from 'src/constants/path'
import { useGetAllCategoriesQuery } from 'src/redux/apis/category.api'
import { useAddProductMutation } from 'src/redux/apis/product.api'
import { useUploadImagesMutation } from 'src/redux/apis/upload.api'
import { ProductSchema, productSchema } from 'src/utils/rules'
import { isEntityError } from 'src/utils/utils'

type FormData = Pick<
  ProductSchema,
  | 'name'
  | 'thumb'
  | 'images'
  | 'price'
  | 'price_before_discount'
  | 'quantity'
  | 'category'
  | 'brand'
  | 'is_featured'
  | 'is_published'
  | 'overview'
  | 'description'
>
const addProductSchema = productSchema.pick([
  'name',
  'thumb',
  'images',
  'price',
  'price_before_discount',
  'quantity',
  'category',
  'brand',
  'is_featured',
  'is_published',
  'overview',
  'description'
])

const initialFormState = {
  name: '',
  thumb: '',
  images: [],
  overview: '',
  is_featured: false,
  is_published: true,
  price: 0,
  price_before_discount: 0,
  category: '',
  brand: '',
  quantity: 0,
  description: ''
}

export default function AddProduct() {
  const { data: categoriesData } = useGetAllCategoriesQuery()
  const form = useForm<FormData>({
    resolver: yupResolver(addProductSchema),
    defaultValues: initialFormState
  })
  const thumbFileInputRef = useRef<HTMLInputElement>(null)
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const previewThumbImage = useMemo(() => {
    return thumbFile ? URL.createObjectURL(thumbFile) : ''
  }, [thumbFile])

  const imagesFilesInputRef = useRef<HTMLInputElement>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const previewImages = useMemo(() => {
    return imageFiles.length > 0 ? imageFiles.map((file) => URL.createObjectURL(file)) : []
  }, [imageFiles])

  const selectedCategory = useMemo(() => {
    return categoriesData?.data.categories.find((category) => category._id === form.watch('category'))
  }, [categoriesData, form.watch('category')])
  const brandsOptions = useMemo(() => {
    return selectedCategory ? selectedCategory.brands.map((brand) => ({ label: brand, value: brand })) : []
  }, [selectedCategory])

  const [uploadImages, uploadImagesResult] = useUploadImagesMutation()
  const [addProduct, { data, isSuccess, isError, error, isLoading }] = useAddProductMutation()

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      let thumbUrl = ''
      let imagesUrls = []
      if (thumbFile) {
        const formData = new FormData()
        formData.append('images', thumbFile)
        const uploadRes = await uploadImages(formData)
        if ('data' in uploadRes && uploadRes.data) {
          thumbUrl = uploadRes.data.data.data[0]?.url || ''
        }
      }
      if (imageFiles.length > 0) {
        const formData = new FormData()
        for (const imageFile of imageFiles) {
          formData.append('images', imageFile)
        }
        const uploadRes = await uploadImages(formData)
        if ('data' in uploadRes && uploadRes.data) {
          for (const image of uploadRes.data.data.data) {
            imagesUrls.push(image.url)
          }
        }
      }
      await addProduct({ ...data, thumb: thumbUrl, images: imagesUrls })
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.data.message)
      form.reset()
      setThumbFile(null)
      setImageFiles([])
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError && isEntityError(error)) {
      const formError = error.data.data
      if (formError) {
        Object.entries(formError).forEach(([key, value]) => {
          form.setError(key as keyof FormData, {
            message: value as string,
            type: 'Server'
          })
        })
      }
    }
  }, [isError])

  return (
    <>
      <PageHeading heading='Thêm mới sản phẩm' isDownload={false}>
        <Link to={path.productsDashboard}>
          <Button variant='outline' className='space-x-2 bg-blue-500'>
            <List />
            <span>Quản lý sản phẩm</span>
          </Button>
        </Link>
      </PageHeading>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className='grid gap-4 sm:grid-cols-2 sm:gap-5 mb-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>Tên sản phẩm</FormLabel>
                  <FormControl>
                    <Input placeholder='Tên sản phẩm...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá sản phẩm</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='Giá sản phẩm...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price_before_discount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá gốc sản phẩm</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='Giá gốc sản phẩm...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='thumb'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh đại diện sản phẩm</FormLabel>
                  <div className='flex flex-col gap-4'>
                    <FormControl>
                      <Input
                        {...form.register('thumb')}
                        accept='.jpg,.jpeg,.png,.webp'
                        className='hidden'
                        placeholder='Ảnh đại diện sản phẩm...'
                        type='file'
                        ref={thumbFileInputRef}
                        onChange={(e) => {
                          const fileFromLocal = e.target.files?.[0]
                          if (
                            fileFromLocal &&
                            (fileFromLocal?.size >= config.maxSizeUpload || !fileFromLocal.type.includes('image'))
                          ) {
                            toast.error(`Dung lượng file tối đa 5 MB, Định dạng:.JPG, .JPEG, .PNG, .WEBP`, {
                              position: 'top-center'
                            })
                          } else {
                            setThumbFile(fileFromLocal as File)
                            field.onChange(fileFromLocal)
                          }
                        }}
                      />
                    </FormControl>
                    <Button
                      type='button'
                      onClick={() => {
                        thumbFileInputRef.current?.click()
                      }}
                      className='text-sm text-gray-600 shadow-sm space-x-2'
                    >
                      <ImageUp className='size-5' />
                      <span>Chọn ảnh</span>
                    </Button>
                    <FormMessage />
                    {previewThumbImage !== '' && (
                      <img src={previewThumbImage} alt='product-thumb' className='w-full object-cover' />
                    )}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='images'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh chi tiết sản phẩm</FormLabel>
                  <div className='flex flex-col gap-4'>
                    <FormControl>
                      <Input
                        {...form.register('images')}
                        type='file'
                        accept='.jpg,.jpeg,.png,.webp'
                        className='hidden'
                        placeholder='Ảnh chi tiết sản phẩm...'
                        multiple
                        ref={imagesFilesInputRef}
                        onChange={(e) => {
                          const filesFromLocal = e.target.files
                          if (filesFromLocal) {
                            const validFiles = Array.from(filesFromLocal).filter(
                              (file) => file.size < config.maxSizeUpload && file.type.includes('image')
                            )
                            if (validFiles.length === 0) {
                              toast.error(
                                `Không có file hình ảnh hợp lệ nào được chọn. Kích thước file tối đa 5 MB, Định dạng: .JPG, .JPEG, .PNG, .WEBP`,
                                { position: 'top-center' }
                              )
                            } else {
                              setImageFiles(validFiles)
                              field.onChange(validFiles)
                            }
                          }
                        }}
                      />
                    </FormControl>
                    <Button
                      type='button'
                      onClick={() => {
                        imagesFilesInputRef.current?.click()
                      }}
                      className='text-sm text-gray-600 shadow-sm space-x-2'
                    >
                      <ImageUp className='size-5' />
                      <span>Chọn ảnh</span>
                    </Button>
                    <FormMessage />
                    <div className='grid grid-cols-4 gap-4'>
                      {previewImages.map((imageUrl, index) => (
                        <div className='relative' key={index}>
                          <img src={imageUrl} alt={`product-image-${index}`} className='w-full h-44 object-cover' />
                          <button
                            onClick={() => {
                              const updatedFiles = [...imageFiles]
                              updatedFiles.splice(index, 1)
                              setImageFiles(updatedFiles)
                              form.setValue('images', updatedFiles)
                            }}
                          >
                            <Trash className='absolute top-2 right-2 cursor-pointer w-5 h-5 rounded-full text-red-500 hover:fill-red-400' />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục sản phẩm</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue placeholder='Hãy chọn một danh mục sản phẩm' />
                        ) : (
                          'Hãy chọn một danh mục sản phẩm'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesData?.data.categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='brand'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thương hiệu sản phẩm</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue placeholder='Hãy chọn một thương hiệu sản phẩm' />
                        ) : (
                          'Hãy chọn một thương hiệu sản phẩm'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    {brandsOptions.length > 0 && (
                      <SelectContent>
                        {brandsOptions.map((brand) => (
                          <SelectItem key={brand.value} value={brand.value}>
                            {brand.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    )}
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='quantity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng sản phẩm</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='Số lượng sản phẩm...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-5'>
              <FormField
                control={form.control}
                name='is_published'
                render={({ field }) => (
                  <FormItem className='flex flex-row gap-3 space-y-0 items-center justify-between rounded-lg border p-3 shadow-sm'>
                    <FormLabel>Hiển thị</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='is_featured'
                render={({ field }) => (
                  <FormItem className='flex flex-row gap-3 space-y-0 items-center justify-between rounded-lg border p-3 shadow-sm'>
                    <FormLabel>Sản phẩm nổi bật?</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} style={{ marginTop: 0 }} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className='col-span-2'>
              <FormField
                control={form.control}
                name='overview'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thông số kỹ thuật</FormLabel>
                    <FormControl>
                      <RichTextEditor value={field.value as string} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='col-span-2'>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả sản phẩm</FormLabel>
                    <FormControl>
                      <RichTextEditor value={field.value as string} onChange={field.onChange} editorHeight={500} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='space-x-4'>
            <Button type='submit' disabled={uploadImagesResult.isLoading || isLoading}>
              {uploadImagesResult.isLoading || isLoading ? <Loader className='animate-spin w-4 h-4 mr-1' /> : null}
              Thêm mới
            </Button>
            <Button type='button' variant='outline' className='px-10'>
              Hủy
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
