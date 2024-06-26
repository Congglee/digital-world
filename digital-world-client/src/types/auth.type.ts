import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  refresh_token: string
  expire_refresh_token: number
  expires: number
  user: User
}>

export type RefreshTokenResponse = SuccessResponse<{ access_token: string }>
