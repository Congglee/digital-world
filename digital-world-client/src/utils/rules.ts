import config from 'src/constants/config'
import * as yup from 'yup'

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Nhập lại mật khẩu là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại mật khẩu không khớp')
}

export const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Họ tên là bắt buộc')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  email: yup
    .string()
    .required('Email là bắt buộc')
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự'),
  confirm_password: handleConfirmPasswordYup('password'),
  token: yup
    .string()
    .required('Vui lòng nhập mã xác thực OTP')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
})

export const categorySchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Tên danh mục là bắt buộc')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  brands: yup.array().of(yup.string()).min(1, 'Vui lòng chọn ít nhất một thương hiệu').required()
})

export const productSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Tên sản phẩm là bắt buộc')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  thumb: yup
    .mixed()
    .test('required', 'Ảnh đại diện sản phẩm là bắt buộc', (value) => {
      if (value) return true
      return false
    })
    .test('fileSize', 'Kích thước ảnh tối đa 5Mb', (value: any) => {
      if (value) {
        return value.size < config.maxSizeUpload
      }
      return true
    }),
  images: yup
    .mixed()
    .test('required', 'Ảnh chi tiết sản phẩm là bắt buộc', (values: any) => values?.length > 0)
    .test('fileSize', 'Kích thước ảnh tối đa 5Mb', (values: any) => {
      const validFiles = Array.from(values).filter(
        (value: any) => value.size < config.maxSizeUpload && value.type.includes('image')
      )
      return validFiles.length > 0
    }),
  category: yup.string().trim().required('Danh mục sản phẩm là bắt buộc'),
  price: yup.number().required('Giá sản phẩm là bắt buộc').min(0, 'Giá sản phẩm không được âm'),
  price_before_discount: yup.number().required('Giá gốc sản phẩm là bắt buộc').min(0, 'Giá gốc sản phẩm không được âm'),
  quantity: yup.number().required('Số lượng sản phẩm là bắt buộc').min(0, 'Số lượng sản phẩm không được âm'),
  brand: yup.string().trim().max(160, 'Độ dài tối đa 160 ký tự'),
  is_featured: yup.boolean().required('Vui lòng chọn sản phẩm này có phải là sản phẩm nổi bật không?'),
  is_published: yup.boolean().required('Vui lòng chọn trạng thái hiện thị cho sản phẩm'),
  overview: yup.string().trim(),
  description: yup.string().trim()
})

export type CategorySchema = yup.InferType<typeof categorySchema>
export type ProductSchema = yup.InferType<typeof productSchema>

export type Schema = yup.InferType<typeof schema>
