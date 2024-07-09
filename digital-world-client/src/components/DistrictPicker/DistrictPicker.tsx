import { VietNamDistrict } from 'src/types/location.type'

interface DistrictPickerProps {
  value?: string
  districts: VietNamDistrict[]
  onSelect?: (districtId: string, districtValue: string) => void
  onChange: (...event: any[]) => void
}

export default function DistrictPicker({ value, districts, onSelect, onChange }: DistrictPickerProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.options[event.target.selectedIndex]
    const districtId = selectedOption.getAttribute('data-id')!
    onSelect && onSelect(districtId, selectedOption.text)
    onChange && onChange(event)
  }

  return (
    <select
      id='shipping_district'
      className='w-full py-[10px] pl-3 pr-6 border border-[#c9cccf] rounded transition-shadow focus:outline-none focus:shadow-[0_0_0_1.5px_#458fff] appearance-none focus:border-transparent'
      value={value}
      onChange={handleChange}
    >
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
