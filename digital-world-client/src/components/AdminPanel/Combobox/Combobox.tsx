import { ArrowDownUp, CheckIcon } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from 'src/components/ui/command'
import { FormControl } from 'src/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Option } from 'src/static/options'
import { cn } from 'src/utils/utils'

interface ComboboxProps {
  value?: string
  options: Option[]
  onSelect?: (value: string) => void
  hasSearchCombobox?: boolean
  searchComboPlaceholder?: string
  searchEmptyText?: string
}

export default function Combobox({
  value,
  options,
  onSelect,
  hasSearchCombobox,
  searchComboPlaceholder,
  searchEmptyText
}: ComboboxProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant='outline'
            role='combobox'
            className={cn('w-full justify-between overflow-hidden', !value && 'text-muted-foreground')}
          >
            {value ? options.find((option) => option.value === value)?.label : 'Hãy chọn một danh mục sản phẩm'}
            <ArrowDownUp className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='xs:w-96 p-0'>
        <Command>
          {hasSearchCombobox && (
            <>
              <CommandInput placeholder={searchComboPlaceholder || 'Tìm kiếm...'} className='h-9' />
              <CommandEmpty>{searchEmptyText || 'Không tìm thấy kết quả.'}</CommandEmpty>
            </>
          )}
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                value={option.label}
                key={option.value}
                onSelect={() => {
                  onSelect && onSelect(option.value)
                }}
              >
                {option.label}
                <CheckIcon className={cn('ml-auto h-4 w-4', option.value === value ? 'opacity-100' : 'opacity-0')} />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
