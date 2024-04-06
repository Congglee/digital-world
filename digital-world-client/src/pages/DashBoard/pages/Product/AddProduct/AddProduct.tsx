import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowDownUp, CheckIcon, ImageUp, List, Loader } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import RichTextEditor from 'src/components/AdminPanel/RichTextEditor'
import { Button } from 'src/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from 'src/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Switch } from 'src/components/ui/switch'
import path from 'src/constants/path'
import { useGetAllCategoriesQuery } from 'src/redux/apis/category.api'
import { useAddProductMutation } from 'src/redux/apis/product.api'
import { useUploadImagesMutation } from 'src/redux/apis/upload.api'
import { isEntityError } from 'src/utils/helper'
import { ProductSchema, productSchema } from 'src/utils/rules'
import { cn, handleValidateFile, handleValidateMultiFile } from 'src/utils/utils'
import PreviewProductImages from '../components/PreviewProductImages'

type FormData = ProductSchema
const addProductSchema = productSchema

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
  const categoriesOptions = useMemo(() => {
    return categoriesData
      ? categoriesData.data.categories.map((category) => ({ label: category.name, value: category._id }))
      : []
  }, [categoriesData])
  const brandsOptions = useMemo(() => {
    return selectedCategory ? selectedCategory.brands.map((brand) => ({ label: brand.name, value: brand.name })) : []
  }, [selectedCategory])

  const [uploadImages, uploadImagesResult] = useUploadImagesMutation()
  const [addProduct, { data, isSuccess, isError, error, isLoading }] = useAddProductMutation()

  const handleRemoveImageFiles = (index: number) => {
    const updatedFiles = imageFiles.filter((_, idx) => idx !== index)
    setImageFiles(updatedFiles)
  }

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
          <Button variant='outline' className='w-full space-x-2 bg-blue-500'>
            <List />
            <span>Quản lý sản phẩm</span>
          </Button>
        </Link>
      </PageHeading>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 sm:gap-5 mb-6'>
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
                <FormItem className='col-span-2 sm:col-span-1'>
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
                <FormItem className='col-span-2 sm:col-span-1'>
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
                <FormItem className='col-span-2 sm:col-span-1'>
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
                        onChange={(event) => handleValidateFile(event, field.onChange, setThumbFile)}
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
                <FormItem className='col-span-2 sm:col-span-1'>
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
                        onChange={(event) => handleValidateMultiFile(event, field.onChange, setImageFiles)}
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
                    <PreviewProductImages
                      previewImages={previewImages}
                      handleRemoveImageFiles={handleRemoveImageFiles}
                    />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem className='flex flex-col col-span-2 md:col-span-1'>
                  <FormLabel>Danh mục sản phẩm</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn(
                            'w-full justify-between overflow-hidden',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? categoriesOptions.find((category) => category.value === field.value)?.label
                            : 'Hãy chọn một danh mục sản phẩm'}
                          <ArrowDownUp className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='xs:w-96 p-0'>
                      <Command>
                        <CommandInput placeholder='Tìm kiếm danh mục sản phẩm...' className='h-9' />
                        <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
                        <CommandGroup>
                          {categoriesOptions.map((category) => (
                            <CommandItem
                              value={category.label}
                              key={category.value}
                              onSelect={() => {
                                form.setValue('category', category.value)
                                form.setValue('brand', '')
                              }}
                            >
                              {category.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  category.value === field.value ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='brand'
              render={({ field }) => (
                <FormItem className='flex flex-col col-span-2 md:col-span-1'>
                  <FormLabel>Thương hiệu sản phẩm</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn(
                            'w-full justify-between overflow-hidden',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? brandsOptions.find((brand) => brand.value === field.value)?.label
                            : 'Hãy chọn một thương hiệu sản phẩm'}
                          <ArrowDownUp className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='xs:w-96 p-0'>
                      <Command>
                        <CommandInput placeholder='Tìm kiếm thương hiệu sản phẩm...' className='h-9' />
                        <CommandEmpty>Không tìm thấy thương hiệu.</CommandEmpty>
                        <CommandGroup>
                          {brandsOptions.map((brand) => (
                            <CommandItem
                              value={brand.label}
                              key={brand.value}
                              onSelect={() => {
                                form.setValue('brand', brand.value)
                              }}
                            >
                              {brand.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  brand.value === field.value ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='quantity'
              render={({ field }) => (
                <FormItem className='col-span-2 md:col-span-1'>
                  <FormLabel>Số lượng sản phẩm</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='Số lượng sản phẩm...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='col-span-2 md:col-span-1 flex flex-col xs:flex-row xs:items-center gap-5'>
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
                      <RichTextEditor onChange={field.onChange} />
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
                      <RichTextEditor onChange={field.onChange} editorHeight={500} />
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
              Lưu lại
            </Button>
            <Button
              type='button'
              variant='outline'
              className='px-10'
              onClick={() => {
                form.reset(), setThumbFile(null), setImageFiles([])
              }}
            >
              Hủy
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
