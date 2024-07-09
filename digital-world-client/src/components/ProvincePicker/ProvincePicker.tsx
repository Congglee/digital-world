import { VietNamProvince } from 'src/types/location.type'

interface ProvincePickerProps {
  value?: string
  provinces: VietNamProvince[]
  onSelect?: (provinceId: string, provinceValue: string) => void
  onChange: (...event: any[]) => void
}

export default function ProvincePicker({ value, provinces, onSelect, onChange }: ProvincePickerProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.options[event.target.selectedIndex]
    const provinceId = selectedOption.getAttribute('data-id')!
    onSelect && onSelect(provinceId, selectedOption.text)
    onChange && onChange(event)
  }

  return (
    <select
      id='shipping_province'
      className='w-full py-[10px] pl-3 pr-6 border border-[#c9cccf] rounded transition-shadow focus:outline-none focus:shadow-[0_0_0_1.5px_#458fff] appearance-none focus:border-transparent'
      onChange={handleChange}
      value={value}
    >
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
