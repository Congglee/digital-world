import { Laptop, List } from 'lucide-react'
import { Link, createSearchParams } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { Category } from 'src/types/category.type'
import { cn } from 'src/utils/utils'

interface CategorySideFilterProps {
  queryConfig: QueryConfig
  categories: Category[]
}

export default function CategorySideFilter({ categories, queryConfig }: CategorySideFilterProps) {
  const { category } = queryConfig

  return (
    <div className='border border-[#ebebeb]'>
      <div className='bg-purple uppercase text-base font-semibold py-[10px] px-5 flex items-center gap-[10px] text-white'>
        <List />
        <span>Danh mục</span>
      </div>
      <ul>
        {categories
          .filter((category) => category.is_actived)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((categoryItem) => {
            const isActive = category === categoryItem._id
            return (
              <li className='py-[15px] px-5' key={categoryItem._id}>
                <Link
                  to={{
                    pathname: path.products,
                    search: createSearchParams({
                      ...queryConfig,
                      category: categoryItem._id
                    }).toString()
                  }}
                  className={cn(
                    'flex items-center flex-wrap gap-2 text-[#1c1d1d] text-sm hover:text-purple',
                    isActive && 'text-purple'
                  )}
                >
                  <Laptop />
                  {categoryItem.name}
                </Link>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
