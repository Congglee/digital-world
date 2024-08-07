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
import AddCategoryDialog from 'src/pages/DashBoard/pages/Category/components/AddCategoryDialog'
import PDFCategoriesTableDocument from 'src/pages/DashBoard/pages/Category/components/PDFCategoriesTable'
import UpdateCategoryDialog from 'src/pages/DashBoard/pages/Category/components/UpdateCategoryDialog'
import { useGetAllBrandsQuery } from 'src/redux/apis/brand.api'
import {
  useDeleteCategoryMutation,
  useDeleteManyCategoriesMutation,
  useGetAllCategoriesQuery
} from 'src/redux/apis/category.api'
import { Brand } from 'src/types/brand.type'
import { Category } from 'src/types/category.type'

const exportDataHeaders = ['ID', 'Tên danh mục', 'Thương hiệu']

export default function CategoryList() {
  const { data: categoriesData } = useGetAllCategoriesQuery()
  const { data: brandsData } = useGetAllBrandsQuery()
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState<boolean>(false)
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState<boolean>(false)
  const [deleteCategoriesDialogOpen, setDeleteCategoriesDialogOpen] = useState<boolean>(false)
  const [updateCategoryDialogOpen, setUpdateCategoryDialogOpen] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<string[]>([])

  const [deleteCategory, deleteCategoryResult] = useDeleteCategoryMutation()
  const [deleteManyCategories, deleteManyCategoriesResult] = useDeleteManyCategoriesMutation()

  const csvExportCategoriesData = useMemo(() => {
    const rows = categoriesData
      ? categoriesData.data.categories.map((category) => [
          category._id,
          category.name,
          category.brands.map((brand) => brand.name).join(' - ')
        ])
      : []
    return [exportDataHeaders, ...rows]
  }, [categoriesData])

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id)
  }

  const handleDeleteManyCategories = async (categoriesIds: string[]) => {
    await deleteManyCategories({ list_id: categoriesIds })
  }

  const handleDownloadPdf = useCallback(() => {
    pdf(<PDFCategoriesTableDocument categories={categoriesData?.data.categories!} />)
      .toBlob()
      .then((blob) => saveAs(blob, 'danh_sach_danh_muc.pdf'))
  }, [categoriesData])

  useEffect(() => {
    if (deleteCategoryResult.isSuccess) {
      toast.success(deleteCategoryResult.data.data.message)
    }
  }, [deleteCategoryResult.isSuccess])

  useEffect(() => {
    if (deleteManyCategoriesResult.isSuccess) {
      toast.success(deleteManyCategoriesResult.data.data.message)
    }
  }, [deleteManyCategoriesResult.isSuccess])

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
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
            const categoryId = row.original._id
            if (!row.getIsSelected()) {
              setSelectedCategoriesIds((prevIds) => [...prevIds, categoryId])
            } else {
              setSelectedCategoriesIds((prevIds) => prevIds.filter((id) => id !== categoryId))
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
            setSelectedCategory(row.original)
            setDeleteCategoryDialogOpen(true)
          }}
          onEdit={() => {
            setSelectedCategory(row.original)
            setUpdateCategoryDialogOpen(true)
          }}
        />
      )
    }
  ]

  return (
    <>
      <PageHeading
        heading='Danh mục'
        csvData={csvExportCategoriesData}
        csvFileName='danh_sach_danh_muc.csv'
        handleDownloadPdf={handleDownloadPdf}
        pdfViewDocument={<PDFCategoriesTableDocument categories={categoriesData?.data.categories!} />}
      >
        <Button variant='outline' className='space-x-2 bg-blue-500' onClick={() => setAddCategoryDialogOpen(true)}>
          <PlusCircle />
          <span>Thêm danh mục</span>
        </Button>
        <Button
          variant='destructive'
          className='space-x-2'
          onClick={() => {
            if (selectedCategoriesIds.length > 0) {
              setDeleteCategoriesDialogOpen(true)
            } else {
              toast.info('Vui lòng chọn một danh mục')
            }
          }}
        >
          <Trash2 className='size-5' />
          <span>Xóa</span>
        </Button>
      </PageHeading>
      <DataTable
        data={categoriesData?.data.categories || []}
        columns={columns}
        placeholder='Lọc danh mục...'
        handleSelectedRowsIds={setSelectedCategoriesIds}
      />
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
        description='Danh mục sản phẩm sau khi bị xóa không thể khôi phục.'
        onConfirm={() => {
          if (!deleteCategoryResult.isLoading) {
            handleDeleteCategory(selectedCategory?._id!)
            setSelectedCategory(null)
          }
        }}
      />
      <ConfirmDialog
        open={deleteCategoriesDialogOpen}
        onOpenStateChange={setDeleteCategoriesDialogOpen}
        title='Bạn có chắc là muốn xóa những danh mục này chứ?'
        description='Danh mục sản phẩm sau khi bị xóa không thể khôi phục.'
        onConfirm={() => {
          if (!deleteManyCategoriesResult.isLoading) {
            handleDeleteManyCategories(selectedCategoriesIds)
            setSelectedCategoriesIds([])
          }
        }}
      />
    </>
  )
}
