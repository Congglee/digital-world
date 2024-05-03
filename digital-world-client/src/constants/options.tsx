import { Lock, ShieldCheck } from 'lucide-react'
import ProductRating from 'src/components/ProductRating'

export const rolesOptions = [
  {
    label: 'Guest',
    value: 'Guest'
  },
  {
    label: 'User',
    value: 'User'
  },
  {
    label: 'Writer',
    value: 'Writer'
  }
]

export const isBlockedOptions = [
  {
    label: 'Hoạt động',
    value: 'false',
    icon: ShieldCheck
  },
  {
    label: 'Bị khóa',
    value: 'true',
    icon: Lock
  }
]

export const orderStatusOptions = [
  {
    label: 'Đang xử lý',
    value: 'Đang xử lý'
  },
  {
    label: 'Đã xử lý',
    value: 'Đã xử lý'
  },
  {
    label: 'Thành công',
    value: 'Thành công'
  },
  {
    label: 'Đã hủy',
    value: 'Đã hủy'
  }
]

export const deliveryStatusOptions = [
  {
    label: 'Đợi xác nhận',
    value: 'Đợi xác nhận'
  },
  {
    label: 'Đang giao',
    value: 'Đang giao'
  },
  {
    label: 'Đã giao thành công',
    value: 'Đã giao thành công'
  }
]

export const paymentStatusOptions = [
  {
    label: 'Chưa thanh toán',
    value: 'Chưa thanh toán'
  },
  {
    label: 'Đã thanh toán',
    value: 'Đã thanh toán'
  }
]

export const tabOptions = [
  {
    name: 'description',
    label: 'Thông tin sản phẩm'
  },
  {
    name: 'warranty',
    label: 'Bảo hành'
  },
  {
    name: 'delivery',
    label: 'Vận chuyển'
  },
  {
    name: 'payment',
    label: 'Thanh toán'
  },
  {
    name: 'rate',
    label: 'Đánh giá của khách hàng'
  }
]

interface RatingIconProps {
  rating: number
  activeClassname?: string
  nonActiveClassname?: string
}

const RatingIcon: React.FC<RatingIconProps> = ({ rating, activeClassname, nonActiveClassname }) => {
  return <ProductRating rating={rating} activeClassname={activeClassname} nonActiveClassname={nonActiveClassname} />
}

export const ratingsOptions = [
  {
    label: '5',
    value: '5',
    icon: (props: { className?: string }) => (
      <div className='mr-1'>
        <RatingIcon
          rating={5}
          activeClassname='w-4 h-4 fill-yellow-300 text-yellow-300'
          nonActiveClassname='w-4 h-4 fill-current text-gray-300'
          {...props}
        />
      </div>
    )
  },
  {
    label: '4',
    value: '4',
    icon: (props: { className?: string }) => (
      <div className='mr-1'>
        <RatingIcon
          rating={4}
          activeClassname='w-4 h-4 fill-yellow-300 text-yellow-300'
          nonActiveClassname='w-4 h-4 fill-current text-gray-300'
          {...props}
        />
      </div>
    )
  },
  {
    label: '3',
    value: '3',
    icon: (props: { className?: string }) => (
      <div className='mr-1'>
        <RatingIcon
          rating={3}
          activeClassname='w-4 h-4 fill-yellow-300 text-yellow-300'
          nonActiveClassname='w-4 h-4 fill-current text-gray-300'
          {...props}
        />
      </div>
    )
  },
  {
    label: '2',
    value: '2',
    icon: (props: { className?: string }) => (
      <div className='mr-1'>
        <RatingIcon
          rating={2}
          activeClassname='w-4 h-4 fill-yellow-300 text-yellow-300'
          nonActiveClassname='w-4 h-4 fill-current text-gray-300'
          {...props}
        />
      </div>
    )
  },
  {
    label: '1',
    value: '1',
    icon: (props: { className?: string }) => (
      <div className='mr-1'>
        <RatingIcon
          rating={1}
          activeClassname='w-4 h-4 fill-yellow-300 text-yellow-300'
          nonActiveClassname='w-4 h-4 fill-current text-gray-300'
          {...props}
        />
      </div>
    )
  }
]
