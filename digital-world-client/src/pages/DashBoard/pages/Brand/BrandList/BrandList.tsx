import { pdf } from '@react-pdf/renderer'
import { ColumnDef } from '@tanstack/react-table'
import { saveAs } from 'file-saver'
import { PlusCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import ConfirmDialog from 'src/components/AdminPanel/ConfirmDialog'
import DataTable from 'src/components/AdminPanel/DataTable'
import DataTableColumnHeader from 'src/components/AdminPanel/DataTableColumnHeader'
import DataTableRowActions from 'src/components/AdminPanel/DataTableRowActions'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import { useDeleteBrandMutation, useGetAllBrandsQuery } from 'src/redux/apis/brand.api'
import { Brand } from 'src/types/brand.type'
import AddBrandDialog from '../components/AddBrandDialog'
import UpdateBrandDialog from '../components/UpdateBrandDialog'
import PDFBrandsTableDocument from '../components/PDFBrandsTable'

const exportDataHeaders = ['ID', 'Tên thương hiệu']

export default function BrandList() {
  const { data: brandsData } = useGetAllBrandsQuery()
  const [addBrandDialogOpen, setAddBrandDialogOpen] = useState<boolean>(false)
  const [deleteBrandDialogOpen, setDeleteBrandDialogOpen] = useState<boolean>(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [updateBrandDialogOpen, setUpdateBrandDialogOpen] = useState<boolean>(false)
  const [deleteBrand, deleteBrandResult] = useDeleteBrandMutation()

  const csvExportBrandsData = useMemo(() => {
    return brandsData && [exportDataHeaders, ...brandsData.data.brands.map((brand) => [brand._id, brand.name])]
  }, [brandsData])

  const handleDeleteBrand = async (id: string) => {
    await deleteBrand(id)
  }

  const handleDownloadPdf = () => {
    pdf(<PDFBrandsTableDocument brands={brandsData?.data.brands!} />)
      .toBlob()
      .then((blob) => saveAs(blob, 'danh_sach_thuong_hieu.pdf'))
  }

  useEffect(() => {
    if (deleteBrandResult.isSuccess) {
      toast.success(deleteBrandResult.data.data.message)
    }
  }, [deleteBrandResult.isSuccess])

  const columns: ColumnDef<Brand>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-[2px]'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-[2px]'
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: '_id',
      header: ({ column }) => <DataTableColumnHeader column={column} title='BrandID' />,
      cell: ({ row }) => <div>{row.getValue('_id')}</div>,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên thương hiệu' />,
      footer: 'Tên thương hiệu',
      cell: ({ row }) => {
        return <div className='font-medium'>{row.getValue('name')}</div>
      }
    },
    {
      id: 'actions',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thao tác' />,
      cell: ({ row }) =>
        row.getValue('name') !== 'Unbranded' ? (
          <DataTableRowActions
            row={row}
            enableEditing={true}
            enableDeleting={true}
            onDelete={() => {
              setSelectedBrand(row.original)
              setDeleteBrandDialogOpen(true)
            }}
            onEdit={() => {
              setSelectedBrand(row.original)
              setUpdateBrandDialogOpen(true)
            }}
          />
        ) : null
    }
  ]

  return (
    <>
      <PageHeading
        heading='Thương hiệu'
        csvData={csvExportBrandsData}
        csvFileName='danh_sach_thuong_hieu'
        handleDownloadPdf={handleDownloadPdf}
        pdfViewDocument={<PDFBrandsTableDocument brands={brandsData?.data.brands!} />}
      >
        <Button variant='outline' className='space-x-2 bg-blue-500' onClick={() => setAddBrandDialogOpen(true)}>
          <PlusCircle />
          <span>Thêm thương hiệu</span>
        </Button>
      </PageHeading>
      <DataTable data={brandsData?.data.brands || []} columns={columns} placeholder='Lọc thương hiệu...' />
      <AddBrandDialog open={addBrandDialogOpen} onOpenChange={setAddBrandDialogOpen} />
      <UpdateBrandDialog
        open={updateBrandDialogOpen}
        onOpenChange={setUpdateBrandDialogOpen}
        selectedBrand={selectedBrand}
        onAfterUpdate={setSelectedBrand}
      />
      <ConfirmDialog
        open={deleteBrandDialogOpen}
        onOpenStateChange={setDeleteBrandDialogOpen}
        title='Bạn có chắc là muốn xóa thương hiệu này chứ?'
        description='Thương hiệu sản phẩm sau khi bị xóa không thể khôi phục'
        onConfirm={() => {
          if (!deleteBrandResult.isLoading) {
            handleDeleteBrand(selectedBrand?._id!)
            setSelectedBrand(null)
          }
        }}
      />
    </>
  )
}
