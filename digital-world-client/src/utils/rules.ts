import * as yup from 'yup'

function handleConfirmPasswordYup(refString: string) {
  return yup
    .string()
    .required('Nhập lại mật khẩu là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại mật khẩu không khớp')
}

function testPriceBeforeDiscount(this: yup.TestContext<yup.AnyObject>) {
  const { price, price_before_discount } = this.parent as { price: number; price_before_discount: number }
  if (price_before_discount !== 0 && price !== 0) {
    return price < price_before_discount
  }
  return true
}

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
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
    .max(160, 'Độ dài từ 6 - 160 ký tự'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  search_text: yup.string().trim().required('Tên sản phẩm là bắt buộc')
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

export const brandSchema = yup.object({
  name: yup.string().trim().required('Tên thương hiệu là bắt buộc').max(160, 'Độ dài từ 5 - 160 ký tự')
})

export const productSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Tên sản phẩm là bắt buộc')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  thumb: yup.string().trim().required('Ảnh đại diện sản phẩm là bắt buộc'),
  images: yup.array().of(yup.string()),
  category: yup.string().trim().required('Danh mục sản phẩm là bắt buộc'),
  price: yup
    .number()
    .required('Giá sản phẩm là bắt buộc')
    .typeError('Giá sản phẩm phải là số')
    .min(0, 'Giá sản phẩm không được âm')
    .test({
      name: 'price-check',
      message: 'Giá sản phẩm phải nhỏ hơn giá gốc',
      test: testPriceBeforeDiscount
    }),
  price_before_discount: yup
    .number()
    .required('Giá gốc sản phẩm là bắt buộc')
    .typeError('Giá gốc sản phẩm phải là số')
    .min(0, 'Giá gốc sản phẩm không được âm')
    .test({
      name: 'price-before-discount-check',
      message: 'Giá gốc phải lớn hơn giá sản phẩm',
      test: testPriceBeforeDiscount
    }),
  quantity: yup.number().required('Số lượng sản phẩm là bắt buộc').min(0, 'Số lượng sản phẩm không được âm'),
  brand: yup.string().trim().required('Thương hiệu sản phẩm là bắt buộc').max(160, 'Độ dài tối đa 160 ký tự'),
  is_featured: yup.boolean().required('Vui lòng chọn sản phẩm này có phải là sản phẩm nổi bật không?'),
  is_published: yup.boolean().required('Vui lòng chọn trạng thái hiện thị cho sản phẩm'),
  overview: yup.string().trim().required('Thông số kỹ thuật là bắt buộc'),
  description: yup.string().trim()
})

export const userSchema = yup.object({
  name: yup.string().trim().required('Họ và tên là bắt buộc').max(160, 'Độ dài từ 5 - 160 ký tự'),
  email: yup
    .string()
    .required('Email là bắt buộc')
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  phone: yup
    .string()
    .matches(/^(0[1-9])+([0-9]{8,9})$/, { message: 'Số điện thoại không đúng định dạng', excludeEmptyString: true })
    .max(20, 'Độ dài tối đa là 20 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  province: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  district: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  ward: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  is_blocked: yup.boolean().required('Vui lòng chọn trạng thái tài khoản'),
  roles: yup.array().of(yup.string()).min(1, 'Vui lòng chọn vai trò cho tài khoản').required(),
  password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  confirm_password: handleConfirmPasswordYup('new_password')
})

export const orderSchema = yup.object({
  order_status: yup.string().trim().required('Trạng thái đơn hàng là bắt buộc').max(160, 'Độ dài từ 5 - 160 ký tự'),
  delivery_status: yup.string().trim().required('Trạng thái vận chuyển là bắt buộc'),
  payment_status: yup.string().trim().required('Trạng thái thanh toán là bắt buộc').max(160, 'Độ dài từ 5 - 160 ký tự')
})

export const mailSchema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  subject: yup.string().trim().required('Tiêu đề là bắt buộc'),
  content: yup.string().trim().required('Nội dung mail là bắt buộc')
})

export const ratingSchema = yup.object({
  publish: yup.boolean().required('Vui lòng chọn trạng thái hiển thị của đánh giá'),
  star: yup
    .number()
    .required('Số sao đánh giá sản phẩm là bắt buộc')
    .min(1, 'Vui lòng chọn số sao đánh giá')
    .max(5, 'Số sao đánh giá sản phẩm không được lớn hơn 5'),
  comment: yup.string().trim()
})

export const storeSchema = yup.object({
  name: yup.string().trim().required('Tên cửa hàng là bắt buộc').max(160, 'Độ dài từ 5 - 160 ký tự'),
  phoneNumber: yup
    .string()
    .matches(/^(0[1-9])+([0-9]{8,9})$/, {
      message: 'Số điện thoại cửa hàng không đúng định dạng',
      excludeEmptyString: true
    })
    .max(20, 'Độ dài tối đa là 20 ký tự'),
  email: yup
    .string()
    .required('Email cửa hàng là bắt buộc')
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  address: yup.string().required('Địa chỉ cửa hàng là bắt buộc').max(160, 'Độ dài tối đa là 160 ký tự'),
  description: yup.string().trim()
})

export type CategorySchema = yup.InferType<typeof categorySchema>
export type ProductSchema = yup.InferType<typeof productSchema>
export type BrandSchema = yup.InferType<typeof brandSchema>
export type UserSchema = yup.InferType<typeof userSchema>
export type OrderSchema = yup.InferType<typeof orderSchema>
export type MailSchema = yup.InferType<typeof mailSchema>
export type RatingSchema = yup.InferType<typeof ratingSchema>
export type StoreSchema = yup.InferType<typeof storeSchema>

export type Schema = yup.InferType<typeof schema>
