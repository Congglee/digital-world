import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Product } from 'src/types/product.type'

interface ProductImagesProps {
  product: Product
}

export default function ProductImages({ product }: ProductImagesProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [activeImage, setActiveImage] = useState('')
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 3])
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )

  useEffect(() => {
    if (product) {
      setActiveImage(product.thumb)
    }
  }, [product])

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const next = () => {
    if (currentIndexImages[1] < (product as Product)?.images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image

    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }

  return (
    <>
      <div
        className='relative w-full pt-[100%] overflow-hidden cursor-zoom-in bg-white border border-[#ebebeb]'
        onMouseMove={handleZoom}
        onMouseLeave={handleRemoveZoom}
      >
        <img
          src={activeImage}
          alt={product.name}
          className='pointer-events-none absolute top-0 left-0 bg-white w-full h-full object-cover'
          ref={imageRef}
        />
      </div>
      {currentImages.length > 0 && (
        <div className='relative mt-[30px] grid grid-cols-3 gap-[10px]'>
          <>
            <button
              className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
              onClick={prev}
            >
              <ChevronLeft className='w-5 h-5' />
            </button>
            {currentImages.map((img) => {
              const isActive = img === activeImage
              return (
                <div className='relative w-full pt-[100%]' key={img} onClick={() => chooseActive(img)}>
                  <img
                    src={img}
                    alt={product.name}
                    className='absolute top-0 left-0 cursor-pointer bg-white w-full h-full object-cover border border-[#ebebeb]'
                  />
                  {isActive && <div className='absolute inset-0 border-2 border-purple' />}
                </div>
              )
            })}
            <button
              className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
              onClick={next}
            >
              <ChevronRight className='w-5 h-5' />
            </button>
          </>
        </div>
      )}
    </>
  )
}
