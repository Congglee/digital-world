import { Lock, ShieldCheck } from 'lucide-react'

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
