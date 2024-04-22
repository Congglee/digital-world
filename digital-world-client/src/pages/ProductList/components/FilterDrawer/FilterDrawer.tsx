import AsideFilter from 'src/components/AsideFilter'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from 'src/components/ui/sheet'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { Brand } from 'src/types/brand.type'

interface FilterDrawerProps {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  limitProducts: number
  totalProducts: number
  queryConfig: QueryConfig
  brands: Brand[]
}

export default function FilterDrawer({
  open,
  onOpenChange,
  limitProducts,
  totalProducts,
  queryConfig,
  brands
}: FilterDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='bg-white w-full xs:max-w-[calc(100%_-_5rem)] sm:max-w-lg h-full text-[#505050] overflow-auto'>
        <SheetHeader className='space-y-1'>
          <SheetTitle className='text-sm font-semibold uppercase text-[#505050]'>Lọc và sắp xếp</SheetTitle>
          <SheetDescription className='text-[#1a1b18b3]'>
            Hiển thị {limitProducts} trên tổng số {totalProducts} sản phẩm.
          </SheetDescription>
        </SheetHeader>
        <div className='py-5'>
          <AsideFilter queryConfig={queryConfig} brands={brands} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
