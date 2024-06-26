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
import { Button } from 'src/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onOpenStateChange: React.Dispatch<React.SetStateAction<boolean>>
  onConfirm: (...args: any[]) => unknown
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenStateChange}>
      <AlertDialogContent className='text-foreground'>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => props.onOpenStateChange(!props.open)}>
            {props.cancelText || 'Hủy'}
          </AlertDialogCancel>
          <Button asChild variant='destructive'>
            <AlertDialogAction
              onClick={() => {
                props.onConfirm && props.onConfirm()
              }}
            >
              {props.confirmText || 'OK'}
            </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
