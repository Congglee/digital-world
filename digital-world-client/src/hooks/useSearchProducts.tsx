import { Schema, schema } from 'src/utils/rules'
import useQueryConfig from './useQueryConfig'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createSearchParams, useNavigate } from 'react-router-dom'
import omit from 'lodash/omit'
import path from 'src/constants/path'

type FormData = Pick<Schema, 'search_text'>

const searchProductSchema = schema.pick(['search_text'])

export default function useSearchProducts() {
  const queryConfig = useQueryConfig()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      search_text: ''
    },
    resolver: yupResolver(searchProductSchema)
  })
  const navigate = useNavigate()

  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.search_text
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.search_text
        }
    navigate({
      pathname: path.products,
      search: createSearchParams(config).toString()
    })
  })

  return { onSubmitSearch, register }
}
