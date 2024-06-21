import { Image, Pencil, Trash2 } from 'lucide-react'
import { Badge } from 'src/components/ui/badge'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from 'src/components/ui/card'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import { PaymentMethod } from 'src/types/payment.type'

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod
  onDelete: () => void
  onEdit: () => void
}

export default function PaymentMethodCard({ paymentMethod, onDelete, onEdit }: PaymentMethodCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>{paymentMethod.name}</CardTitle>
        <div className='space-x-2'>
          <Button size='icon' variant='outline' className='h-8 w-8' onClick={onEdit}>
            <Pencil className='h-3.5 w-3.5' />
            <span className='sr-only'>Edit</span>
          </Button>
          <Button size='icon' variant='outline' className='h-8 w-8' onClick={onDelete}>
            <Trash2 className='h-3.5 w-3.5' />
            <span className='sr-only'>Delete</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid w-full items-center gap-4'>
          <div className='flex flex-col space-y-2'>
            <Label htmlFor='name'>Tên phương thức</Label>
            <Input id='name' value={paymentMethod.name} readOnly placeholder='Name of your project' />
          </div>
          <div className='flex flex-col space-y-2'>
            <Label htmlFor='image'>Ảnh</Label>
            {paymentMethod.image ? (
              <div className='w-full max-w-[50%] h-40'>
                <img src={paymentMethod.image} alt={paymentMethod.name} className='aspect-square size-full' />
              </div>
            ) : (
              <div className='w-full max-w-[50%] h-40 border border-border rounded-md'>
                <Image className='size-full opacity-60' strokeWidth={0.8} />
              </div>
            )}
          </div>
          <div className='flex items-center space-x-2'>
            <Label htmlFor='is_actived'>Trạng thái:</Label>
            <Badge>{paymentMethod.is_actived ? 'Kích hoạt' : 'Lưu trữ'}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter />
    </Card>
  )
}
