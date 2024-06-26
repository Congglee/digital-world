import { Input } from 'src/components/ui/input'
import { cn } from 'src/utils/utils'

export default function Search({ className }: { className?: string }) {
  return <Input type='search' placeholder='Tìm kiếm...' className={cn('md:w-[100px] lg:w-[300px]', className)} />
}
