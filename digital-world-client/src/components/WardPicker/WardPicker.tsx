import { VietNamWard } from 'src/types/location.type'

interface WardPickerProps {
  value?: string
  wards: VietNamWard[]
  onSelect: (wardValue: string) => void
  onChange: (...event: any[]) => void
}

export default function WardPicker({ value, wards, onSelect, onChange }: WardPickerProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.options[event.target.selectedIndex]
    onSelect && onSelect(selectedOption.text)
    onChange && onChange(event)
  }

  return (
    <select
      id='shipping_ward'
      className='w-full py-[10px] pl-3 pr-6 border border-[#c9cccf] rounded transition-shadow focus:outline-none focus:shadow-[0_0_0_1.5px_#458fff] appearance-none focus:border-transparent'
      value={value}
      onChange={handleChange}
    >
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
