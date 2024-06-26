import { Trash } from 'lucide-react'
import { Button } from 'src/components/ui/button'

interface PreviewProductImagesProps {
  previewImages: string[]
  handleRemoveImageFiles: (index: number) => void
  productImages?: string[]
  handleRemoveProductImages?: (index: number) => void
}

export default function PreviewProductImages({
  previewImages,
  productImages = [],
  handleRemoveImageFiles,
  handleRemoveProductImages
}: PreviewProductImagesProps) {
  return (
    <div className='grid auto-fill-40 gap-4'>
      {previewImages.length > 0
        ? previewImages.map((imageUrl, index) => (
            <div className='relative h-[185px]' key={index}>
              <img src={imageUrl} alt={`product-image-${index}`} className='w-full h-full object-cover' />
              <Button
                type='button'
                onClick={() => handleRemoveImageFiles(index)}
                className='absolute top-2 right-2 size-5 p-1 bg-red-500 rounded-full hover:bg-red-300'
              >
                <Trash className='w-4 h-4 rounded-full text-white' />
              </Button>
            </div>
          ))
        : productImages.map((imageUrl, index) => (
            <div className='relative h-[185px]' key={index}>
              <img src={imageUrl} alt={`product-image-${index}`} className='w-full h-full object-cover' />
              <Button
                type='button'
                onClick={() => {
                  handleRemoveProductImages && handleRemoveProductImages(index)
                }}
                className='absolute top-2 right-2 size-5 p-1 bg-red-500 rounded-full hover:bg-red-300'
              >
                <Trash className='w-4 h-4 rounded-full text-white' />
              </Button>
            </div>
          ))}
    </div>
  )
}
