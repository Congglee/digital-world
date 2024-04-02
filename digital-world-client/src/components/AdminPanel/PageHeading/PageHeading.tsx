import { BlobProvider, DocumentProps } from '@react-pdf/renderer'
import { Download, Eye, FileDown } from 'lucide-react'
import { CSVLink } from 'react-csv'
import { Link } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from 'src/components/ui/dropdown-menu'
import { CSV, PDF } from 'src/utils/icons'
import CalendarDateRangePicker from '../CalendarDateRangePicker'

interface PageHeadingProps {
  heading: string
  children?: React.ReactNode
  isDownload?: boolean
  hasPdfDownload?: boolean
  hasCsvDownload?: boolean

  csvData?: (string | number | undefined)[][]
  csvFileName?: string
  handleDownloadPdf?: () => void
  pdfViewDocument?: React.ReactElement<DocumentProps>
}

export default function PageHeading({
  heading,
  isDownload = true,
  hasPdfDownload = true,
  hasCsvDownload = true,
  children,
  csvData = [],
  csvFileName,
  handleDownloadPdf,
  pdfViewDocument
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
                {hasPdfDownload && (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className='p-0'>
                          <Button variant='ghost' className='w-full justify-start flex gap-2 cursor-pointer px-2'>
                            <PDF className='size-5' />
                            <span>PDF (.pdf)</span>
                          </Button>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {pdfViewDocument && (
                              <>
                                <DropdownMenuItem>
                                  <BlobProvider document={pdfViewDocument}>
                                    {({ url, blob }) => (
                                      <Link to={url!} target='_blank' className='flex items-center'>
                                        <Eye className='mr-2 h-4 w-4' />
                                        <span>Xem file PDF</span>
                                      </Link>
                                    )}
                                  </BlobProvider>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem>
                              <button
                                className='flex items-center'
                                onClick={() => {
                                  handleDownloadPdf && handleDownloadPdf()
                                }}
                              >
                                <FileDown className='mr-2 h-4 w-4' />
                                <span>Tải về...</span>
                              </button>
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuGroup>
                  </>
                )}
                {hasCsvDownload && (
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Button variant='ghost' asChild className='w-full justify-start flex gap-2 cursor-pointer'>
                        <CSVLink filename={csvFileName} data={csvData}>
                          <CSV className='size-5' />
                          <span>CSV (.csv)</span>
                        </CSVLink>
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {children}
        </div>
      </div>
    </>
  )
}
