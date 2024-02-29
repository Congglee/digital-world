import { Download, PlusCircle } from 'lucide-react'
import CalendarDateRangePicker from 'src/components/AdminPanel/CalendarDateRangePicker'
import DataTable from 'src/components/AdminPanel/DataTable'
import { Button } from 'src/components/ui/button'
import { tasks } from 'src/utils/data'
import { columns } from 'src/components/AdminPanel/Columns/Columns'

export default function CategoryList() {
  return (
    <>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Category</h2>
        <div className='flex items-center space-x-2'>
          <CalendarDateRangePicker />
          <Button className='space-x-2'>
            <Download />
            <span> Download</span>
          </Button>
          <Button variant='outline' className='space-x-2 bg-blue-500'>
            <PlusCircle />
            <span>Create Category</span>
          </Button>
        </div>
      </div>
      <DataTable data={tasks} columns={columns} />
    </>
  )
}
