import { Laptop, List } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Category } from 'src/types/category.type'

interface CategorySideFilterProps {
  categories: Category[]
}

export default function CategorySideFilter({ categories }: CategorySideFilterProps) {
  return (
    <div className='border border-[#ebebeb]'>
      <div className='bg-purple text-white uppercase text-base font-semibold py-[10px] px-5 flex items-center gap-[10px]'>
        <List />
        <span>Danh mục</span>
      </div>
      <ul>
        {categories
          .filter((category) => category.name !== 'Uncategorized')
          .map((category) => (
            <li className='py-[15px] px-5' key={category._id}>
              <Link to='#' className='flex items-center flex-wrap gap-2 text-[#1c1d1d] text-sm hover:text-purple'>
                <Laptop />
                {category.name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  )
}
