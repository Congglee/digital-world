import { yupResolver } from '@hookform/resolvers/yup'
import omit from 'lodash/omit'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { order as orderConstant, productSortBy } from 'src/constants/sort'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { Brand } from 'src/types/brand.type'
import { ListConfig, NoUnderfinedField } from 'src/types/utils.type'
import { DongCoin } from 'src/components/Icons/Icons'
import { Schema, schema } from 'src/utils/rules'
import Button from '../Button'
import InputNumber from '../InputNumber'
import { ChevronsUpDown } from 'lucide-react'

interface AsideFilterProps {
  queryConfig: QueryConfig
  brands: Brand[]
}

type FormData = NoUnderfinedField<Pick<Schema, 'price_max' | 'price_min'>>
const priceSchema = schema.pick(['price_min', 'price_max'])

export default function AsideFilter({ queryConfig, brands }: AsideFilterProps) {
  const { sort_by = productSortBy.createdAt, order, brand } = queryConfig
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(priceSchema as any),
    shouldFocusError: false
  })
  const [checkedBrands, setCheckedBrands] = useState<string[]>([])

  useEffect(() => {
    if (brand) {
      setCheckedBrands(brand.split(' '))
    } else {
      setCheckedBrands([])
    }
  }, [brand])

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.products,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })

  const handleSort = (sortValue: Exclude<ListConfig['sort_by' | 'order'], undefined>) => {
    const [sortBy, order] = sortValue.split('_')
    navigate({
      pathname: path.products,
      search: createSearchParams({ ...queryConfig, sort_by: sortBy, order }).toString()
    })
  }

  const handleFilterBrand = (brandValue: Exclude<ListConfig['brand'], undefined>) => {
    const brands = checkedBrands.includes(brandValue)
      ? checkedBrands.filter((brand) => brand !== brandValue)
      : [...checkedBrands, brandValue]
    setCheckedBrands(brands)
    navigate({
      pathname: path.products,
      search: createSearchParams(
        brands.length > 0 ? { ...queryConfig, brand: brands.join(' ') } : omit(queryConfig, ['brand'])
      ).toString()
    })
  }

  const handleRemoveAll = () => {
    reset()
    setCheckedBrands([])
    navigate({
      pathname: path.products,
      search: createSearchParams(
        omit(queryConfig, ['sort_by', 'order', 'price_min', 'price_max', 'brand', 'category'])
      ).toString()
    })
  }

  return (
    <div className='border border-[#ebebeb]'>
      <div className='bg-purple text-white uppercase text-base font-semibold py-[10px] px-5 flex items-center gap-[10px]'>
        <span>Mua sắm theo</span>
      </div>
      <div className='p-5 space-y-4'>
        <div className='flex flex-col gap-[10px]'>
          <label htmlFor='sort_by' className='text-[17px] font-semibold text-[rgb(80_80_80)]'>
            Sắp xếp theo
          </label>
          <div className='relative'>
            <select
              id='sort_by'
              className='text-xs border border-[#1a1b18bf] pl-3 pr-5 w-full inline-block h-9 text-[#1c1d1d] bg-[#f6f6f6] outline-none appearance-none'
              value={order ? `${sort_by}_${order}` : ''}
              onChange={(event) =>
                handleSort(event.target.value as Exclude<ListConfig['sort_by' | 'order'], undefined>)
              }
            >
              <option value='' disabled>
                Chọn
              </option>
              <option value={`${productSortBy.sold}_${orderConstant.desc}`}>Bán chạy</option>
              <option value={`${productSortBy.view}_${orderConstant.desc}`}>Nổi bật</option>
              <option value={`${productSortBy.createdAt}_${orderConstant.desc}`}>Mới nhất</option>
              <option value={`${productSortBy.name}_${orderConstant.asc}`}>Tên, từ A - Z</option>
              <option value={`${productSortBy.name}_${orderConstant.desc}`}>Tên, từ Z - A</option>
              <option value={`${productSortBy.price}_${orderConstant.asc}`}>Giá, tăng dần</option>
              <option value={`${productSortBy.price}_${orderConstant.desc}`}>Giá, giảm dần</option>
            </select>
            <div className='absolute top-0 bottom-0 right-0 -ml-5 px-3 flex items-center justify-center'>
              <ChevronsUpDown className='w-2.5 h-2.5' />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-[10px]'>
          <label className='text-[17px] font-semibold text-[#505050]'>Giá</label>
          <div className='border border-[#1a1b1833]'>
            <div className='py-[5px] px-[10px] border-b border-[#1a1b1833] text-sm text-[#505050]'>
              Giá trị đầu vào mặc định là VND{' '}
              <button
                className='hover:text-purple'
                onClick={() => {
                  reset()
                  navigate({
                    pathname: path.products,
                    search: createSearchParams(omit(queryConfig, ['price_min', 'price_max'])).toString()
                  })
                }}
              >
                Reset
              </button>
            </div>
            <div className='py-6 px-[15px]'>
              <form onSubmit={onSubmit}>
                <div className='flex items-center gap-[6px] mb-3'>
                  <label htmlFor='price_min'>
                    <DongCoin className='size-4' fill='#505050' />
                  </label>
                  <Controller
                    control={control}
                    name='price_min'
                    render={({ field }) => {
                      return (
                        <InputNumber
                          id='price_min'
                          type='text'
                          className='flex-1'
                          placeholder='Từ'
                          classNameInput='font-semibold'
                          classNameError='hidden'
                          {...field}
                          onChange={(event) => {
                            field.onChange(event)
                            trigger('price_max')
                          }}
                        />
                      )
                    }}
                  />
                </div>
                <div className='flex items-center gap-[6px]'>
                  <label htmlFor='price_max'>
                    <DongCoin className='size-4' fill='#505050' />
                  </label>
                  <Controller
                    control={control}
                    name='price_max'
                    render={({ field }) => {
                      return (
                        <InputNumber
                          id='price_max'
                          type='text'
                          className='flex-1'
                          placeholder='Đến'
                          classNameInput='font-semibold'
                          classNameError='hidden'
                          {...field}
                          onChange={(event) => {
                            field.onChange(event)
                            trigger('price_min')
                          }}
                        />
                      )
                    }}
                  />
                </div>
                <div className='mt-0.5 text-red-600 min-h-[1.25rem] text-sm text-center'>
                  {errors.price_min?.message}
                </div>
                <Button
                  type='submit'
                  className='text-center bg-purple w-full py-[10px] text-white uppercase text-sm font-semibold hover:bg-black transition-colors duration-300'
                >
                  Áp dụng
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-[10px]'>
          <label className='text-[17px] font-semibold text-[#505050]'>Thương hiệu</label>
          <div className='border border-[#1a1b1833]'>
            <div className='py-[5px] px-[10px] border-b border-[#1a1b1833] text-sm text-[#505050] flex items-center justify-between leading-6'>
              {checkedBrands.length} được chọn
              <button
                className='hover:text-purple'
                onClick={() => {
                  setCheckedBrands([])
                  navigate({
                    pathname: path.products,
                    search: createSearchParams(omit(queryConfig, ['brand'])).toString()
                  })
                }}
              >
                Reset
              </button>
            </div>
            <ul className='py-[5px] px-[10px] max-h-[300px] overflow-y-scroll space-y-[7px]'>
              {brands
                .filter((brand) => brand.name !== 'Unbranded')
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((brand) => (
                  <li className='flex items-center space-x-2 cursor-pointer' key={brand._id}>
                    <input
                      id={brand.name}
                      type='checkbox'
                      className='w-4 h-4 accent-purple cursor-pointer'
                      value={brand.name.toLowerCase()}
                      checked={checkedBrands.includes(brand.name.toLowerCase())}
                      onChange={() => handleFilterBrand(brand.name.toLowerCase())}
                    />
                    <label htmlFor={brand.name} className='capitalize text-[13px] cursor-pointer font-medium leading-7'>
                      {brand.name}
                    </label>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <button
          className='p-2 font-medium text-white text-xs shadow-md bg-purple uppercase hover:bg-black transition-colors duration-300'
          onClick={handleRemoveAll}
        >
          Xóa tất cả
        </button>
      </div>
    </div>
  )
}
