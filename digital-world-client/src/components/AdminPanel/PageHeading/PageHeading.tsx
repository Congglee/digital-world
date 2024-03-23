import { Download } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from 'src/components/ui/dropdown-menu'
import { CSV, PDF } from 'src/utils/icons'
import CalendarDateRangePicker from '../CalendarDateRangePicker'
import { CSVLink } from 'react-csv'

interface PageHeadingProps {
  heading: string
  isDownload?: boolean
  children?: React.ReactNode
  csvData?: (string | number)[][]
  csvFileName?: string
  handleDownloadPdf?: () => void
}

export default function PageHeading({
  heading,
  isDownload = true,
  children,
  csvData = [],
  csvFileName,
  handleDownloadPdf
}: PageHeadingProps) {
  return (
    <>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-3'>
        <h2 className='text-3xl font-bold tracking-tight'>{heading}</h2>
        <div className='flex flex-col flex-wrap sm:flex-row sm:items-center sm:space-x-2 gap-1'>
          <CalendarDateRangePicker />
          {isDownload && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='space-x-2'>
                  <Download />
                  <span>Tải về</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Button
                    variant='ghost'
                    className='w-full justify-start flex gap-2 cursor-pointer'
                    onClick={() => {
                      handleDownloadPdf && handleDownloadPdf()
                    }}
                  >
                    <PDF className='size-5' />
                    <span>PDF (.pdf)</span>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Button variant='ghost' asChild className='w-full justify-start flex gap-2 cursor-pointer'>
                    <CSVLink filename={csvFileName} data={csvData}>
                      <CSV className='size-5' />
                      <span>CSV (.csv)</span>
                    </CSVLink>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {children}
        </div>
      </div>
    </>
  )
}
