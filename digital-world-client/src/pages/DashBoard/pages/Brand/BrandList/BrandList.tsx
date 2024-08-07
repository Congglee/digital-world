import { pdf } from '@react-pdf/renderer'
import { ColumnDef } from '@tanstack/react-table'
import { saveAs } from 'file-saver'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import ConfirmDialog from 'src/components/AdminPanel/ConfirmDialog'
import DataTable from 'src/components/AdminPanel/DataTable'
import DataTableColumnHeader from 'src/components/AdminPanel/DataTableColumnHeader'
import DataTableRowActions from 'src/components/AdminPanel/DataTableRowActions'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import { Badge } from 'src/components/ui/badge'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import AddBrandDialog from 'src/pages/DashBoard/pages/Brand/components/AddBrandDialog'
import PDFBrandsTableDocument from 'src/pages/DashBoard/pages/Brand/components/PDFBrandsTable'
import UpdateBrandDialog from 'src/pages/DashBoard/pages/Brand/components/UpdateBrandDialog'
import { useDeleteBrandMutation, useDeleteManyBrandsMutation, useGetAllBrandsQuery } from 'src/redux/apis/brand.api'
import { Brand } from 'src/types/brand.type'

const exportDataHeaders = ['ID', 'Tên thương hiệu']

export default function BrandList() {
  const { data: brandsData } = useGetAllBrandsQuery()
  const [addBrandDialogOpen, setAddBrandDialogOpen] = useState<boolean>(false)
  const [deleteBrandDialogOpen, setDeleteBrandDialogOpen] = useState<boolean>(false)
  const [deleteBrandsDialogOpen, setDeleteBrandsDialogOpen] = useState<boolean>(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [selectedBrandsIds, setSelectedBrandsIds] = useState<string[]>([])
  const [updateBrandDialogOpen, setUpdateBrandDialogOpen] = useState<boolean>(false)

  const [deleteBrand, deleteBrandResult] = useDeleteBrandMutation()
  const [deleteManyBrands, deleteManyBrandsResult] = useDeleteManyBrandsMutation()

  const csvExportBrandsData = useMemo(() => {
    const rows = brandsData ? brandsData.data.brands.map((brand) => [brand._id, brand.name]) : []

    return [exportDataHeaders, ...rows]
  }, [brandsData])

  const handleDeleteBrand = async (id: string) => {
    await deleteBrand(id)
  }

  const handleDeleteManyBrands = async (brandsIds: string[]) => {
    await deleteManyBrands({ list_id: brandsIds })
  }

  const handleDownloadPdf = useCallback(() => {
    pdf(<PDFBrandsTableDocument brands={brandsData?.data.brands!} />)
      .toBlob()
      .then((blob) => saveAs(blob, 'name_sach_thuong_hieu.pdf'))
  }, [brandsData])

  useEffect(() => {
    if (deleteBrandResult.isSuccess) {
      toast.success(deleteBrandResult.data.data.message)
    }
  }, [deleteBrandResult.isSuccess])

  useEffect(() => {
    if (deleteManyBrandsResult.isSuccess) {
      toast.success(deleteManyBrandsResult.data.data.message)
    }
  }, [deleteManyBrandsResult.isSuccess])

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
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
            const brandId = row.original._id
            if (!row.getIsSelected()) {
              setSelectedBrandsIds((prevIds) => [...prevIds, brandId])
            } else {
              setSelectedBrandsIds((prevIds) => prevIds.filter((id) => id !== brandId))
            }
          }}
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
      accessorKey: 'is_actived',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
      footer: 'Trạng thái',
      cell: ({ row }) => {
        return (
          <div className='font-medium'>
            <Badge>{row.getValue('is_actived') ? 'Kích hoạt' : 'Lưu trữ'}</Badge>
          </div>
        )
      }
    },
    {
      id: 'actions',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thao tác' />,
      cell: ({ row }) => (
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
      )
    }
  ]

  return (
    <>
      <PageHeading
        heading='Thương hiệu'
        csvData={csvExportBrandsData}
        csvFileName='danh_sach_thuong_hieu.csv'
        handleDownloadPdf={handleDownloadPdf}
        pdfViewDocument={<PDFBrandsTableDocument brands={brandsData?.data.brands!} />}
      >
        <Button variant='outline' className='space-x-2 bg-blue-500' onClick={() => setAddBrandDialogOpen(true)}>
          <PlusCircle />
          <span>Thêm thương hiệu</span>
        </Button>
        <Button
          variant='destructive'
          className='space-x-2'
          onClick={() => {
            if (selectedBrandsIds.length > 0) {
              setDeleteBrandsDialogOpen(true)
            } else {
              toast.info('Vui lòng chọn một thương hiệu')
            }
          }}
        >
          <Trash2 className='size-5' />
          <span>Xóa</span>
        </Button>
      </PageHeading>
      <DataTable
        data={brandsData?.data.brands || []}
        columns={columns}
        placeholder='Lọc thương hiệu...'
        handleSelectedRowsIds={setSelectedBrandsIds}
      />
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
        description='Thương hiệu sản phẩm sau khi bị xóa không thể khôi phục.'
        onConfirm={() => {
          if (!deleteBrandResult.isLoading) {
            handleDeleteBrand(selectedBrand?._id!)
            setSelectedBrand(null)
          }
        }}
      />
      <ConfirmDialog
        open={deleteBrandsDialogOpen}
        onOpenStateChange={setDeleteBrandsDialogOpen}
        title='Bạn có chắc là muốn xóa những thương hiệu này chứ?'
        description='Thương hiệu sản phẩm sau khi bị xóa không thể khôi phục.'
        onConfirm={() => {
          if (!deleteManyBrandsResult.isLoading) {
            handleDeleteManyBrands(selectedBrandsIds)
            setSelectedBrandsIds([])
          }
        }}
      />
    </>
  )
}
