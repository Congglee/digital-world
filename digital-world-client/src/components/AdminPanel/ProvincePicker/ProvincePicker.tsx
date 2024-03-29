import { ArrowDownUp, CheckIcon } from 'lucide-react'
import { UseFormSetValue } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from 'src/components/ui/command'
import { FormControl } from 'src/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { ScrollArea } from 'src/components/ui/scroll-area'
import { VietNamProvince } from 'src/types/location.type'
import { UserSchema } from 'src/utils/rules'
import { cn } from 'src/utils/utils'

type FormData = Omit<UserSchema, 'confirm_password' | 'new_password'>

interface ProvincePickerProps {
  value?: string
  provinces: VietNamProvince[]
  setValue?: UseFormSetValue<FormData>
  handleSetProvinceId: React.Dispatch<React.SetStateAction<string>>
}

export default function ProvincePicker({ value, provinces, setValue, handleSetProvinceId }: ProvincePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant='outline'
            role='combobox'
            className={cn('w-full justify-between overflow-hidden', !value && 'text-muted-foreground')}
          >
            {value ? provinces.find((province) => province.province_name === value)?.province_name : 'Tỉnh thành'}
            <ArrowDownUp className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder='Tìm kiếm tỉnh...' className='h-9' />
          <CommandEmpty>Không tìm thấy tỉnh.</CommandEmpty>
          <ScrollArea className='h-48 overflow-auto'>
            <CommandGroup>
              {provinces.map((province) => (
                <CommandItem
                  value={province.province_name}
                  key={province.province_id}
                  onSelect={() => {
                    handleSetProvinceId(province.province_id.toString())
                    setValue && setValue('province', province.province_name)
                    setValue && setValue('district', '')
                    setValue && setValue('ward', '')
                  }}
                >
                  {province.province_name}
                  <CheckIcon
                    className={cn('ml-auto h-4 w-4', province.province_name === value ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
