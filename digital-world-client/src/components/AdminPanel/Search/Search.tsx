import { Input } from 'src/components/ui/input'

export default function Search() {
  return (
    <div>
      <Input type='search' placeholder='Tìm kiếm...' className='md:w-[100px] lg:w-[300px]' />
    </div>
  )
}
