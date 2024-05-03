import { useMemo, useState } from 'react'

export const usePagination = <T extends any>(data: T[], volume: number = 10) => {
  const totalPages = useMemo(() => Math.ceil(data.length / volume), [volume, data.length])

  const [page, setPage] = useState(0)

  const nextPage = () => {
    if (page < totalPages - 1) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  const slicedData = useMemo(() => data.slice(0, (page + 1) * volume), [data, page, volume])

  return { data: slicedData, page, totalPages, setPage, nextPage }
}
