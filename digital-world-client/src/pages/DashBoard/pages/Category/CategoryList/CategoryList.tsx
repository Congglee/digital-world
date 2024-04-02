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
import { useGetAllBrandsQuery } from 'src/redux/apis/brand.api'
import { useDeleteCategoryMutation, useGetAllCategoriesQuery } from 'src/redux/apis/category.api'
import { Brand } from 'src/types/brand.type'
import { Category } from 'src/types/category.type'
import AddCategoryDialog from '../components/AddCategoryDialog'

import PDFCategoriesTableDocument from '../components/PDFCategoriesTable'
import UpdateCategoryDialog from '../components/UpdateCategoryDialog'

const exportDataHeaders = ['ID', 'Tên danh mục', 'Thương hiệu']

export default function CategoryList() {
  const { data: categoriesData } = useGetAllCategoriesQuery()
  const { data: brandsData } = useGetAllBrandsQuery()
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState<boolean>(false)
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState<boolean>(false)
  const [updateCategoryDialogOpen, setUpdateCategoryDialogOpen] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [deleteCategory, deleteCategoryResult] = useDeleteCategoryMutation()

  const csvExportCategoriesData = useMemo(() => {
    return (
      categoriesData && [
        exportDataHeaders,
        ...categoriesData.data.categories.map((category) => [
          category._id,
          category.name,
          category.brands.map((brand) => brand.name).join(' - ')
        ])
      ]
    )
  }, [categoriesData])

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id)
  }

  const handleDownloadPdf = () => {
    pdf(<PDFCategoriesTableDocument categories={categoriesData?.data.categories!} />)
      .toBlob()
      .then((blob) => saveAs(blob, 'danh_sach_danh_muc.pdf'))
  }

  useEffect(() => {
    if (deleteCategoryResult.isSuccess) {
      toast.success(deleteCategoryResult.data.data.message)
    }
  }, [deleteCategoryResult.isSuccess])

  const columns: ColumnDef<Category>[] = [
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
      header: ({ column }) => <DataTableColumnHeader column={column} title='CategoryID' />,
      cell: ({ row }) => <div>{row.getValue('_id')}</div>,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên danh mục' />,
      footer: 'Tên danh mục',
      cell: ({ row }) => {
        return <div className='font-medium'>{row.getValue('name')}</div>
      }
    },
    {
      accessorKey: 'brands',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thương hiệu' />,
      footer: 'Thương hiệu',
      cell: ({ row }) => {
        return (
          <div>
            {(row.getValue('brands') as Brand[]).map((brand, idx) => (
              <span key={brand._id}>
                {idx > 0 && ' - '}
                {brand.name}
              </span>
            ))}
          </div>
        )
      }
    },
    {
      id: 'actions',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thao tác' />,
      cell: ({ row }) =>
        row.getValue('name') !== 'Uncategorized' ? (
          <DataTableRowActions
            row={row}
            enableEditing={true}
            enableDeleting={true}
            onDelete={() => {
              setSelectedCategory(row.original)
              setDeleteCategoryDialogOpen(true)
            }}
            onEdit={() => {
              setSelectedCategory(row.original)
              setUpdateCategoryDialogOpen(true)
            }}
          />
        ) : null
    }
  ]

  return (
    <>
      <PageHeading
        heading='Danh mục'
        csvData={csvExportCategoriesData}
        csvFileName='danh_sach_danh_muc'
        handleDownloadPdf={handleDownloadPdf}
        pdfViewDocument={<PDFCategoriesTableDocument categories={categoriesData?.data.categories!} />}
      >
        <Button variant='outline' className='space-x-2 bg-blue-500' onClick={() => setAddCategoryDialogOpen(true)}>
          <PlusCircle />
          <span>Thêm danh mục</span>
        </Button>
      </PageHeading>
      <DataTable data={categoriesData?.data.categories || []} columns={columns} placeholder='Lọc danh mục...' />
      <AddCategoryDialog
        open={addCategoryDialogOpen}
        onOpenChange={setAddCategoryDialogOpen}
        brands={brandsData?.data.brands || []}
      />
      <UpdateCategoryDialog
        open={updateCategoryDialogOpen}
        selectedCategory={selectedCategory}
        onOpenChange={setUpdateCategoryDialogOpen}
        onAfterUpdate={setSelectedCategory}
        brands={brandsData?.data.brands!}
      />
      <ConfirmDialog
        open={deleteCategoryDialogOpen}
        onOpenStateChange={setDeleteCategoryDialogOpen}
        title='Bạn có chắc là muốn xóa danh mục này chứ?'
        description='Danh mục sản phẩm sau khi bị xóa không thể khôi phục'
        onConfirm={() => {
          if (!deleteCategoryResult.isLoading) {
            handleDeleteCategory(selectedCategory?._id!)
            setSelectedCategory(null)
          }
        }}
      />
    </>
  )
}
