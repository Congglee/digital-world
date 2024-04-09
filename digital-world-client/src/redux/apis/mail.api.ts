import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosResponse } from 'axios'
import { SuccessResponse } from 'src/types/utils.type'
import axiosBaseQuery from '../helper'
import { MailSchema } from 'src/utils/rules'

export const MAIL_URL = 'mail'
export const ADMIN_MAIL_URL = `admin/${MAIL_URL}`

export const URL_SEND_NOTIFY_MAIL = `${ADMIN_MAIL_URL}/send-notify-mail`

const reducerPath = 'mail/api' as const
const tagTypes = ['Mail'] as const

export const mailApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    sendNotifyMail: build.mutation<
      AxiosResponse<SuccessResponse<string>>,
      Pick<MailSchema, 'email' | 'subject' | 'content'>
    >({
      query: (payload) => ({ url: URL_SEND_NOTIFY_MAIL, method: 'POST', data: payload })
    })
  })
})

export const { useSendNotifyMailMutation } = mailApi