import { MoveLeft, MoveRight } from 'lucide-react'
import { Link, createSearchParams } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { cn, scrollToTop } from 'src/utils/utils'

interface PaginationProps {
  queryConfig: QueryConfig
  pageSize: number
}

const RANGE = 2
export default function Pagination({ queryConfig, pageSize }: PaginationProps) {
  const page = Number(queryConfig.page)

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span key={index} className='text-[#1c1d1d] p-1 text-sm hover:text-purple'>
            ...
          </span>
        )
      }
    }

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='text-[#1c1d1d] p-1 text-sm hover:text-purple'>
            ...
          </span>
        )
      }
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <Link
            to={{
              pathname: path.products,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={cn('text-[#1c1d1d] p-1 text-sm hover:text-purple', {
              'text-purple': pageNumber === page,
              'text-[#1c1d1d]': pageNumber !== page
            })}
            onClick={scrollToTop}
          >
            {pageNumber}
          </Link>
        )
      })
  }

  return (
    <div className='flex flex-wrap mt-10 justify-center items-center gap-4'>
      {page !== 1 && (
        <Link
          to={{
            pathname: path.products,
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className='hover:text-purple'
          onClick={scrollToTop}
        >
          <MoveLeft className='size-4' />
        </Link>
      )}

      {renderPagination()}

      {page !== pageSize && (
        <Link
          to={{
            pathname: path.products,
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}
          className='hover:text-purple'
          onClick={scrollToTop}
        >
          <MoveRight className='size-4' />
        </Link>
      )}
    </div>
  )
}
