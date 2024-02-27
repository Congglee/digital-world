import { useEffect } from 'react'

export function useClickOutsideListener(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  excludeRefs: React.RefObject<HTMLElement>[] = []
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        const isExcluded = excludeRefs.some((excludeRef) => excludeRef.current?.contains(event.target as Node))

        if (!isExcluded) {
          callback()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback, excludeRefs])
}
