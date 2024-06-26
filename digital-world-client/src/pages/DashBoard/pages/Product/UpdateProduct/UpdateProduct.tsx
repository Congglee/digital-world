import { yupResolver } from '@hookform/resolvers/yup'
import { ImageUp, List, Loader } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Combobox from 'src/components/AdminPanel/Combobox'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import RichTextEditor from 'src/components/AdminPanel/RichTextEditor'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Switch } from 'src/components/ui/switch'
import path from 'src/constants/path'
import PreviewProductImages from 'src/pages/DashBoard/pages/Product/components/PreviewProductImages'
import { useGetAllCategoriesQuery } from 'src/redux/apis/category.api'
import { useGetProductDetailQuery, useUpdateProductMutation } from 'src/redux/apis/product.api'
import { useUploadImagesMutation } from 'src/redux/apis/upload.api'
import { isEntityError } from 'src/utils/helper'
import { ProductSchema, productSchema } from 'src/utils/rules'
import { handleValidateFile, handleValidateMultiFile } from 'src/utils/utils'

type FormData = ProductSchema
const updateProductSchema = productSchema

const initialFormState = {
  name: '',
  thumb: '',
  images: [],
  overview: '',
  is_featured: false,
  is_actived: true,
  price: 0,
  price_before_discount: 0,
  category: '',
  brand: '',
  quantity: 0,
  description: ''
}

export default function UpdateProduct() {
  const { product_id } = useParams()
  const { data: productDetailData, refetch } = useGetProductDetailQuery(product_id!)
  const { data: categoriesData } = useGetAllCategoriesQuery()
  const product = productDetailData?.data.data
  const form = useForm<FormData>({
    resolver: yupResolver(updateProductSchema),
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
  const [productImages, setProductImages] = useState<string[]>([])

  const selectedCategory = useMemo(() => {
    return categoriesData?.data.categories.find((category) => category._id === form.watch('category'))
  }, [categoriesData, form.watch('category')])

  useEffect(() => {
    if (!selectedCategory) {
      refetch()
    }
  }, [selectedCategory])

  const categoriesOptions = useMemo(() => {
    return categoriesData
      ? categoriesData.data.categories.map((category) => ({ label: category.name, value: category._id }))
      : []
  }, [categoriesData])
  const brandsOptions = useMemo(() => {
    return selectedCategory ? selectedCategory.brands.map((brand) => ({ label: brand.name, value: brand.name })) : []
  }, [selectedCategory])

  const [uploadImages, uploadImagesResult] = useUploadImagesMutation()
  const [updateProduct, { data, isSuccess, isError, error, isLoading }] = useUpdateProductMutation()

  useEffect(() => {
    if (product) {
      form.setValue('name', product.name)
      form.setValue('thumb', product.thumb)
      form.setValue('images', product.images)
      form.setValue('price', product.price)
      form.setValue('price_before_discount', product.price_before_discount)
      form.setValue('category', product.category._id)
      form.setValue('brand', product.brand)
      form.setValue('quantity', product.quantity)
      form.setValue('is_featured', product.is_featured)
      form.setValue('is_actived', product.is_actived)
      form.setValue('overview', product.overview)
      form.setValue('description', product.description)

      setProductImages(product.images)
    }
  }, [product, form.setValue])

  const handleRemoveImageFiles = useCallback(
    (index: number) => {
      const updatedImageFiles = imageFiles.filter((_, idx) => idx !== index)
      setImageFiles(updatedImageFiles)
    },
    [imageFiles]
  )

  const handleRemoveProductImages = useCallback(
    (index: number) => {
      const updatedProductImages = productImages.filter((_, idx) => idx !== index)
      setProductImages(updatedProductImages)
    },
    [productImages]
  )

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
      const payloadData = {
        ...data,
        thumb: thumbUrl !== '' ? thumbUrl : data.thumb,
        images: imagesUrls.length > 0 ? imagesUrls : productImages
      }
      await updateProduct({
        id: product_id!,
        payload: payloadData
      })
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.data.message)
      refetch()
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

  if (!product) return null

  return (
    <>
      <PageHeading heading='Cập nhật sản phẩm' hasDownload={false}>
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
                <FormItem className='col-span-2 md:col-span-1'>
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
                      variant='outline'
                      onClick={() => {
                        thumbFileInputRef.current?.click()
                      }}
                      className='text-sm text-card-foreground shadow-sm space-x-2'
                    >
                      <ImageUp className='size-5' />
                      <span>Chọn ảnh</span>
                    </Button>
                    <FormMessage />
                    <img
                      src={previewThumbImage || product?.thumb}
                      alt='product-thumb'
                      className='rounded-md object-cover'
                    />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='images'
              render={({ field }) => (
                <FormItem className='col-span-2 md:col-span-1'>
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
                      variant='outline'
                      onClick={() => {
                        imagesFilesInputRef.current?.click()
                      }}
                      className='text-sm text-card-foreground shadow-sm space-x-2'
                    >
                      <ImageUp className='size-5' />
                      <span>Chọn ảnh</span>
                    </Button>
                    <FormMessage />
                    <PreviewProductImages
                      previewImages={previewImages}
                      productImages={productImages}
                      handleRemoveImageFiles={handleRemoveImageFiles}
                      handleRemoveProductImages={handleRemoveProductImages}
                    />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem className='col-span-2 md:col-span-1'>
                  <FormLabel>Danh mục sản phẩm</FormLabel>
                  <Combobox
                    value={field.value}
                    options={categoriesOptions}
                    onSelect={(value) => form.setValue('category', value)}
                    hasSearchCombobox={true}
                    searchComboPlaceholder='Tìm kiếm danh mục...'
                    searchEmptyText='Không tìm thấy danh mục.'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='brand'
              render={({ field }) => (
                <FormItem className='col-span-2 md:col-span-1'>
                  <FormLabel>Thương hiệu sản phẩm</FormLabel>
                  <Combobox
                    value={field.value}
                    options={brandsOptions}
                    onSelect={(value) => form.setValue('brand', value)}
                    hasSearchCombobox={true}
                    searchComboPlaceholder='Tìm kiếm thương hiệu...'
                    searchEmptyText='Không tìm thấy thương hiệu.'
                  />
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
                name='is_actived'
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
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                      <RichTextEditor value={product.overview} onChange={field.onChange} />
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
                      <RichTextEditor value={product.description} onChange={field.onChange} editorHeight={500} />
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
                form.reset({ ...product, category: product?.category._id }),
                  setProductImages(product?.images!),
                  setThumbFile(null),
                  setImageFiles([])
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
