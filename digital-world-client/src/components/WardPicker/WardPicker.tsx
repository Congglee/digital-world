import { VietNamWard } from 'src/types/location.type'
import { cn } from 'src/utils/utils'

interface WardPickerProps {
  value?: string
  wards: VietNamWard[]
  onSelect: (wardValue: string) => void
  onChange: (...event: any[]) => void
  className?: string
  labelId?: string
}

export default function WardPicker({ value, wards, onSelect, onChange, className, labelId }: WardPickerProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.options[event.target.selectedIndex]
    onSelect && onSelect(selectedOption.text)
    onChange && onChange(event)
  }

  return (
    <select id={labelId} className={cn('w-full border', className)} value={value} onChange={handleChange}>
      <option value='' disabled>
        Chọn một phường
      </option>
      {wards.map((ward) => (
        <option key={ward.ward_id} value={ward.ward_name}>
          {ward.ward_name}
        </option>
      ))}
    </select>
  )
}
