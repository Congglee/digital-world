import { ColumnDef } from '@tanstack/react-table'
import { Download, PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CalendarDateRangePicker from 'src/components/AdminPanel/CalendarDateRangePicker'
import ConfirmDialog from 'src/components/AdminPanel/ConfirmDialog'
import DataTable from 'src/components/AdminPanel/DataTable'
import DataTableColumnHeader from 'src/components/AdminPanel/DataTableColumnHeader'
import DataTableRowActions from 'src/components/AdminPanel/DataTableRowActions'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import { useDeleteCategoryMutation, useGetAllCategoriesQuery } from 'src/redux/apis/category.api'
import { Category } from 'src/types/category.type'
import AddCategoryDialog from '../components/AddCategoryDialog'
import UpdateCategoryDialog from '../components/UpdateCategoryDialog'

export default function CategoryList() {
  const { data: categoriesData } = useGetAllCategoriesQuery()
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState<boolean>(false)
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState<boolean>(false)
  const [updateCategoryDiglogOpen, setUpdateCategoryDiglogOpen] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [deleteCategory, deleteCategoryResult] = useDeleteCategoryMutation()

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id)
  }

  useEffect(() => {
    if (deleteCategoryResult.isSuccess) {
      toast.success(deleteCategoryResult.data?.data.message)
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
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'brands',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thương hiệu' />,
      footer: 'Thương hiệu',
      cell: ({ row }) => {
        return (
          <div>
            {(row.getValue('brands') as string[]).map((item, idx) => (
              <span key={idx}>
                {idx > 0 && ' - '} {item}
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
              setUpdateCategoryDiglogOpen(true)
            }}
          />
        ) : null
    }
  ]

  return (
    <>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Danh mục</h2>
        <div className='flex items-center space-x-2'>
          <CalendarDateRangePicker />
          <Button className='space-x-2'>
            <Download />
            <span>Tải về</span>
          </Button>
          <Button variant='outline' className='space-x-2 bg-blue-500' onClick={() => setAddCategoryDialogOpen(true)}>
            <PlusCircle />
            <span>Thêm danh mục</span>
          </Button>
        </div>
      </div>
      <DataTable data={categoriesData?.data.categories || []} columns={columns} placeholder='Lọc danh mục...' />
      <AddCategoryDialog open={addCategoryDialogOpen} onOpenChange={setAddCategoryDialogOpen} />
      <UpdateCategoryDialog
        open={updateCategoryDiglogOpen}
        selectedCategory={selectedCategory}
        onOpenChange={setUpdateCategoryDiglogOpen}
        onAfterUpdate={setSelectedCategory}
      />
      <ConfirmDialog
        open={deleteCategoryDialogOpen}
        onOpenStateChange={setDeleteCategoryDialogOpen}
        title='Bạn có chắc là muốn xóa danh mục này chứ?'
        description='Danh mục sản phẩm sau khi bị xóa không thể khôi phục'
        onConfirm={() => {
          if (!deleteCategoryResult.isLoading) {
            handleDeleteCategory(selectedCategory?._id as string)
            setSelectedCategory(null)
          }
        }}
      />
    </>
  )
}
