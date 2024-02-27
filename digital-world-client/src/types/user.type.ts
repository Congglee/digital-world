type Role = 'User' | 'Admin' | 'Guest' | 'Writer'

export interface User {
  _id: string
  name?: string
  email: string
  roles: Role[]
  date_of_birth?: string // ISO8601
  avatar?: string
  address?: string
  phone?: string
  is_blocked: boolean
  createdAt: string
  updatedAt: string
}
