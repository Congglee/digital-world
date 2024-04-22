import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { cn } from 'src/utils/utils'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  { errorMessage, className, classNameInput, classNameError, onChange, value = '', ...rest },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (/^\d+$/.test(value) || value === '') {
      // Thực thi onChange callback từ bên ngoài truyền vào props
      onChange && onChange(event)
      // Cập nhật localValue state
      setLocalValue(value)
    }
  }

  return (
    <div className={className}>
      <input
        className={cn(
          'py-2 px-[10px] w-full text-[#1c1d1d] border-transparent bg-[#f6f6f6] focus:shadow-sm',
          classNameInput
        )}
        onChange={handleChange}
        value={value === undefined ? localValue : value}
        {...rest}
        ref={ref}
      />

      <div className={cn('mt-1 text-red-600 min-h-[1.25rem] text-sm', classNameError)}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
