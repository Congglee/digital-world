import { Button } from 'src/components/ui/button'
import CalendarDateRangePicker from '../CalendarDateRangePicker'
import { Download } from 'lucide-react'

interface PageHeadingProps {
  heading: string
  isDownload?: boolean
  children?: React.ReactNode
}

export default function PageHeading({ heading, isDownload = true, children }: PageHeadingProps) {
  return (
    <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-3'>
      <h2 className='text-3xl font-bold tracking-tight'>{heading}</h2>
      <div className='flex flex-col flex-wrap sm:flex-row sm:items-center sm:space-x-2 gap-1'>
        <CalendarDateRangePicker />
        {isDownload && (
          <Button className='space-x-2'>
            <Download />
            <span>Tải về</span>
          </Button>
        )}
        {children}
      </div>
    </div>
  )
}
