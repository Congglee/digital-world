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
