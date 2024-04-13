import { ArrowDownUp, CheckIcon } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from 'src/components/ui/command'
import { FormControl } from 'src/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { ScrollArea } from 'src/components/ui/scroll-area'
import { VietNamWard } from 'src/types/location.type'
import { cn } from 'src/utils/utils'

interface WardPickerProps {
  value?: string
  wards: VietNamWard[]
  districtId: string
  handleSelectWard: (wardValue: string) => void
}

export default function WardPicker({ value, wards, districtId, handleSelectWard }: WardPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant='outline'
            role='combobox'
            className={cn('w-full justify-between overflow-hidden', !value && 'text-muted-foreground')}
          >
            {value ? wards.find((ward) => ward.ward_name === value)?.ward_name : 'Phường'}
            <ArrowDownUp className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder='Tìm kiếm phường...' className='h-9' />
          <CommandEmpty>Không tìm thấy phường.</CommandEmpty>
          <ScrollArea className='h-48 overflow-auto'>
            {districtId && (
              <CommandGroup>
                {wards.map((ward) => (
                  <CommandItem
                    value={ward.ward_name}
                    key={ward.ward_id}
                    onSelect={() => {
                      handleSelectWard && handleSelectWard(ward.ward_name)
                    }}
                  >
                    {ward.ward_name}
                    <CheckIcon
                      className={cn('ml-auto h-4 w-4', ward.ward_name === value ? 'opacity-100' : 'opacity-0')}
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
