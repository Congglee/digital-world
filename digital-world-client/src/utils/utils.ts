import { clsx, type ClassValue } from 'clsx'
import { toast } from 'react-toastify'
import userImage from 'src/assets/images/user.svg'
import config from 'src/constants/config'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-De').format(currency)
}

export function handleValidateMultiFile(
  event: React.ChangeEvent<HTMLInputElement>,
  onChange: (...event: any[]) => void,
  handleImageFiles: (value: React.SetStateAction<File[]>) => void
) {
  const filesFromLocal = event.target.files
  if (filesFromLocal) {
    const validFiles = Array.from(filesFromLocal).filter(
      (file) => file.size < config.maxSizeUpload && file.type.includes('image')
    )
    if (validFiles.length === 0) {
      toast.error(
        `Không có file hình ảnh hợp lệ nào được chọn. Kích thước file tối đa 5 MB, Định dạng: .JPG, .JPEG, .PNG, .WEBP`,
        { position: 'top-center' }
      )
    } else {
      handleImageFiles(validFiles)
      onChange(validFiles.map((file) => URL.createObjectURL(file)))
    }
  }
}

export function handleValidateFile(
  event: React.ChangeEvent<HTMLInputElement>,
  onChange: (...event: any[]) => void,
  handleImageFile: (value: React.SetStateAction<File | null>) => void
) {
  const fileFromLocal = event.target.files?.[0]
  if (fileFromLocal && (fileFromLocal?.size >= config.maxSizeUpload || !fileFromLocal.type.includes('image'))) {
    toast.error(`Dung lượng file tối đa 5 MB, Định dạng:.JPG, .JPEG, .PNG, .WEBP`, {
      position: 'top-center'
    })
  } else {
    handleImageFile(fileFromLocal as File)
    onChange(URL.createObjectURL(fileFromLocal!))
  }
}

export function convertHTMLToPlainText(html: string) {
  let tempDivElement = document.createElement('div')
  tempDivElement.innerHTML = html
  return tempDivElement.textContent || tempDivElement.innerText || ''
}

export const getAvatarUrl = (avatarName?: string) => (avatarName ? avatarName : userImage)
