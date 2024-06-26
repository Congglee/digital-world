import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import { Calendar } from 'src/components/ui/calendar'
import { FormControl } from 'src/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { cn } from 'src/utils/utils'

interface DatePickerProps {
  className?: string
  value?: Date
  onChange?: (...event: any[]) => void
}

export default function DatePicker({ className, value, onChange }: DatePickerProps) {
  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={'outline'}
              className={cn('w-full pl-3 text-left font-normal', !value && 'text-muted-foreground')}
            >
              {value ? format(value, 'dd MMMM yyyy', { locale: vi }) : <span>Chọn ngày</span>}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            captionLayout='dropdown-buttons'
            selected={value}
            defaultMonth={value}
            onSelect={onChange}
            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
            fromYear={1960}
            toYear={new Date().getFullYear() + 1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
