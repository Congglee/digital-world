import { ArrowDownUp, CheckIcon } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from 'src/components/ui/command'
import { FormControl } from 'src/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { ScrollArea } from 'src/components/ui/scroll-area'
import { VietNamDistrict } from 'src/types/location.type'
import { cn } from 'src/utils/utils'

interface DistrictPickerProps {
  value?: string
  districts: VietNamDistrict[]
  provinceId: string
  handleSelectDistrict?: (districtId: string, districValue: string, wardValue: string) => void
}

export default function DistrictPicker({ value, provinceId, districts, handleSelectDistrict }: DistrictPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant='outline'
            role='combobox'
            className={cn('w-full justify-between overflow-hidden', !value && 'text-muted-foreground')}
          >
            {value ? districts.find((district) => district.district_name === value)?.district_name : 'Quận huyện'}
            <ArrowDownUp className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder='Tìm kiếm quận huyện...' className='h-9' />
          <CommandEmpty>Không tìm thấy quận huyện.</CommandEmpty>
          <ScrollArea className='h-48 overflow-auto'>
            {provinceId && (
              <CommandGroup>
                {districts.map((district) => (
                  <CommandItem
                    value={district.district_name}
                    key={district.district_id}
                    onSelect={() => {
                      handleSelectDistrict &&
                        handleSelectDistrict(district.district_id.toString(), district.district_name, '')
                    }}
                  >
                    {district.district_name}
                    <CheckIcon
                      className={cn('ml-auto h-4 w-4', district.district_name === value ? 'opacity-100' : 'opacity-0')}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
