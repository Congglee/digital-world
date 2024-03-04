import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from 'src/components/ui/alert-dialog'

interface confirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onOpenStateChange: React.Dispatch<React.SetStateAction<boolean>>
  onConfirm: (...args: any[]) => unknown
}

export default function ConfirmDialog(props: confirmDialogProps) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenStateChange}>
      <AlertDialogContent className='text-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => props.onOpenStateChange(!props.open)}>
            {props.cancelText || 'Hủy'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (props.onConfirm) props.onConfirm()
            }}
          >
            {props.confirmText || 'OK'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}