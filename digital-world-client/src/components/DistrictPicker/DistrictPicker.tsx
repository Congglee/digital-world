import { VietNamDistrict } from 'src/types/location.type'
import { cn } from 'src/utils/utils'

interface DistrictPickerProps {
  value?: string
  districts: VietNamDistrict[]
  onSelect?: (districtId: string, districtValue: string) => void
  onChange: (...event: any[]) => void
  className?: string
  labelId?: string
}

export default function DistrictPicker({
  value,
  districts,
  onSelect,
  onChange,
  className,
  labelId
}: DistrictPickerProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.options[event.target.selectedIndex]
    const districtId = selectedOption.getAttribute('data-id')!
    onSelect && onSelect(districtId, selectedOption.text)
    onChange && onChange(event)
  }

  return (
    <select id={labelId} className={cn('w-full border', className)} value={value} onChange={handleChange}>
      <option value='' disabled>
        Chọn một quận/huyện
      </option>
      {districts.map((district) => (
        <option key={district.district_id} value={district.district_name} data-id={district.district_id}>
          {district.district_name}
        </option>
      ))}
    </select>
  )
}
