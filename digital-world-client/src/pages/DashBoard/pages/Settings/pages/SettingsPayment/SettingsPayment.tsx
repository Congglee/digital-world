import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ConfirmDialog from 'src/components/AdminPanel/ConfirmDialog'
import { Card, CardHeader, CardTitle } from 'src/components/ui/card'
import { Separator } from 'src/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import AddPaymentMethodForm from 'src/pages/DashBoard/pages/Settings/components/AddPaymentMethodForm'
import PaymentMethodCard from 'src/pages/DashBoard/pages/Settings/components/PaymentMethodCard'
import SettingsHeading from 'src/pages/DashBoard/pages/Settings/components/SettingsHeading'
import UpdatePaymentMethodDialog from 'src/pages/DashBoard/pages/Settings/components/UpdatePaymentMethodDialog'
import { useDeletePaymentMethodMutation, useGetAllPaymentMethodsQuery } from 'src/redux/apis/payment.api'
import { PaymentMethod } from 'src/types/payment.type'

export default function SettingsPayment() {
  const { data: paymentMethodsData } = useGetAllPaymentMethodsQuery()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [deletePaymentMethodDialogOpen, setDeletePaymentMethodDialogOpen] = useState<boolean>(false)
  const [updatePaymentMethodDialogOpen, setUpdatePaymentMethodDialogOpen] = useState<boolean>(false)
  const [deletePaymentMethod, deletePaymentMethodResult] = useDeletePaymentMethodMutation()

  const handleDeletePaymentMethod = async (id: string) => {
    await deletePaymentMethod(id)
  }

  useEffect(() => {
    if (deletePaymentMethodResult.isSuccess) {
      toast.success(deletePaymentMethodResult.data.data.message)
    }
  }, [deletePaymentMethodResult.isSuccess])

  return (
    <>
      <SettingsHeading heading='Thanh toán' description='Chỉnh sửa phương thức thanh toán của cửa hàng' />
      <Separator className='my-6' />
      <Tabs defaultValue='payment-methods-list'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='payment-methods-list'>Danh Sách</TabsTrigger>
          <TabsTrigger value='add-payment-method'>Thêm Mới</TabsTrigger>
        </TabsList>
        <TabsContent value='payment-methods-list' className='pt-2 space-y-5'>
          {paymentMethodsData &&
            paymentMethodsData.data.payment_methods.map((paymentMethod) => (
              <PaymentMethodCard
                key={paymentMethod._id}
                paymentMethod={paymentMethod}
                onDelete={() => {
                  setSelectedPaymentMethod(paymentMethod)
                  setDeletePaymentMethodDialogOpen(true)
                }}
                onEdit={() => {
                  setSelectedPaymentMethod(paymentMethod)
                  setUpdatePaymentMethodDialogOpen(true)
                }}
              />
            ))}
        </TabsContent>
        <TabsContent value='add-payment-method' className='pt-2'>
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Thêm mới phương thức thanh toán</CardTitle>
            </CardHeader>
            <AddPaymentMethodForm />
          </Card>
        </TabsContent>
      </Tabs>
      <UpdatePaymentMethodDialog
        open={updatePaymentMethodDialogOpen}
        onOpenChange={setUpdatePaymentMethodDialogOpen}
        selectedPaymentMethod={selectedPaymentMethod}
        onAfterUpdate={setSelectedPaymentMethod}
      />
      <ConfirmDialog
        open={deletePaymentMethodDialogOpen}
        onOpenStateChange={setDeletePaymentMethodDialogOpen}
        title='Bạn có chắc là muốn xóa phương thức thanh toán này chứ?'
        description='Phương thức thanh toán sản phẩm sau khi bị xóa không thể khôi phục'
        onConfirm={() => {
          if (!deletePaymentMethodResult.isLoading) {
            handleDeletePaymentMethod(selectedPaymentMethod?._id!)
            setSelectedPaymentMethod(null)
          }
        }}
      />
    </>
  )
}
