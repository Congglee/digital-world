import { Eye, EyeOff } from 'lucide-react'
import { InputHTMLAttributes, useState } from 'react'
import type { FieldPath, FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form'
import { cn } from 'src/utils/utils'

interface Props<TFieldValues extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  classNameEye?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<TFieldValues>
  rules?: RegisterOptions
  name: FieldPath<TFieldValues>
}

export default function Input<TFieldValues extends FieldValues = FieldValues>({
  errorMessage,
  className,
  name,
  register,
  rules,
  classNameInput,
  classNameError,
  classNameEye,
  ...rest
}: Props<TFieldValues>) {
  const [openEye, setOpenEye] = useState(false)
  const registerResult = register && name ? register(name, rules) : null

  const toggleEye = () => {
    setOpenEye((prev) => !prev)
  }

  const handleType = () => {
    if (rest.type === 'password') {
      return openEye ? 'text' : 'password'
    }
    return rest.type
  }

  return (
    <div className={cn('relative', className)}>
      <input
        className={cn(
          'py-2 px-[10px] w-full outline-none border-2 border-transparent bg-[#f6f6f6] rounded-sm focus:shadow-sm focus:border-[#1c1d1d] text-[#1c1d1d] transition-all placeholder:font-light',
          classNameInput
        )}
        {...registerResult}
        {...rest}
        type={handleType()}
      />
      {rest.type === 'password' && openEye && (
        <Eye
          className={cn('w-5 h-5 absolute top-[8px] right-[5px] cursor-pointer', classNameEye)}
          onClick={toggleEye}
        />
      )}
      {rest.type === 'password' && !openEye && (
        <EyeOff
          className={cn('w-5 h-5 absolute top-[8px] right-[5px] cursor-pointer', classNameEye)}
          onClick={toggleEye}
        />
      )}
      <div className={cn('mt-0.5 text-red-600 min-h-[1.25rem] text-sm', classNameError)}>{errorMessage}</div>
    </div>
  )
}
