import { VietNamProvince } from 'src/types/location.type'
import { cn } from 'src/utils/utils'

interface ProvincePickerProps {
  value?: string
  provinces: VietNamProvince[]
  onSelect?: (provinceId: string, provinceValue: string) => void
  onChange: (...event: any[]) => void
  className?: string
  labelId?: string
}

export default function ProvincePicker({
  value,
  provinces,
  onSelect,
  onChange,
  className,
  labelId
}: ProvincePickerProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.options[event.target.selectedIndex]
    const provinceId = selectedOption.getAttribute('data-id')!
    onSelect && onSelect(provinceId, selectedOption.text)
    onChange && onChange(event)
  }

  return (
    <select id={labelId} className={cn('w-full border', className)} onChange={handleChange} value={value}>
      <option value='' disabled>
        Chọn một tỉnh thành
      </option>
      {provinces.map((province) => (
        <option key={province.province_id} value={province.province_name} data-id={province.province_id}>
          {province.province_name}
        </option>
      ))}
    </select>
  )
}
