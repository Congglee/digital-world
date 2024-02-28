export interface SuccessResponse<Data> {
  message: string
  data: Data
}

export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

export type NoUnderfinedField<T> = {
  [P in keyof T]-?: NoUnderfinedField<NonNullable<T[P]>>
}
