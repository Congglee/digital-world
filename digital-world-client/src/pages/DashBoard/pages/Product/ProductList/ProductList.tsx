import { ColumnDef } from '@tanstack/react-table'
import { PlusCircle, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmDialog from 'src/components/AdminPanel/ConfirmDialog'
import DataTable from 'src/components/AdminPanel/DataTable'
import DataTableColumnHeader from 'src/components/AdminPanel/DataTableColumnHeader'
import DataTableRowActions from 'src/components/AdminPanel/DataTableRowActions'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import path from 'src/constants/path'
import { useDeleteProductMutation, useGetProductsQuery } from 'src/redux/apis/product.api'
import { Category } from 'src/types/category.type'
import { Product } from 'src/types/product.type'
import { formatCurrency } from 'src/utils/utils'

export default function ProductList() {
  const { data: productsData } = useGetProductsQuery()
  const [deleteProductDialogOpen, setDeleteProductDialogOpen] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [deleteProduct, deleteProductResult] = useDeleteProductMutation()

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id)
  }

  useEffect(() => {
    if (deleteProductResult.isSuccess) {
      toast.success(deleteProductResult.data.data.message)
    }
  }, [deleteProductResult.isSuccess])

  const columns: ColumnDef<Product>[] = [
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
      header: ({ column }) => <DataTableColumnHeader column={column} title='ProductID' />,
      cell: ({ row }) => <div>{row.getValue('_id')}</div>,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên sản phẩm' />,
      footer: 'Tên sản phẩm',
      cell: ({ row }) => {
        return <div className='font-medium line-clamp-2'>{row.getValue('name')}</div>
      }
    },
    {
      accessorKey: 'thumb',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ảnh' />,
      footer: 'Ảnh',
      cell: ({ row }) => {
        return (
          <div className='size-20 rounded-md overflow-hidden'>
            <img src={row.getValue('thumb')} alt='product-thumb' className='w-full h-full object-cover' />
          </div>
        )
      },
      enableSorting: false
    },
    {
      accessorKey: 'price',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Giá sản phẩm' />,
      footer: 'Giá sản phẩm',
      cell: ({ row }) => {
        return <div className='font-medium'>{formatCurrency(row.getValue('price'))}đ</div>
      }
    },
    {
      accessorKey: 'price_before_discount',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Giá gốc' />,
      footer: 'Giá gốc',
      cell: ({ row }) => {
        return <div className='font-medium'>{formatCurrency(row.getValue('price_before_discount'))}đ</div>
      }
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Số lượng' />,
      footer: 'Số lượng',
      cell: ({ row }) => {
        return <div className='font-medium'>{formatCurrency(row.getValue('quantity'))}</div>
      }
    },
    {
      accessorKey: 'total_ratings',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Đánh giá' />,
      footer: 'Đánh giá',
      cell: ({ row }) => {
        return (
          <div className='font-medium flex items-center space-x-1'>
            <Star className='size-4 fill-yellow-400 text-yellow-400' />
            <span>{formatCurrency(row.getValue('total_ratings'))}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'brand',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thương hiệu' />,
      footer: 'Thương hiệu',
      cell: ({ row }) => {
        return <div className='font-medium'>{row.getValue('brand')}</div>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'category',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Danh mục' />,
      footer: 'Danh mục',
      cell: ({ row }) => {
        return <div className='font-medium'>{(row.getValue('category') as Category).name}</div>
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
              setSelectedProduct(row.original._id)
              setDeleteProductDialogOpen(true)
            }}
            // onEdit={() => {
            //   setSelectedCategory(row.original)
            //   setUpdateCategoryDiglogOpen(true)
            // }}
          />
        ) : null
    }
  ]

  return (
    <>
      <PageHeading heading='Sản phẩm'>
        <Link to={path.addProduct}>
          <Button variant='outline' className='space-x-2 bg-blue-500'>
            <PlusCircle />
            <span>Thêm sản phẩm</span>
          </Button>
        </Link>
      </PageHeading>
      <DataTable data={productsData?.data.products || []} columns={columns} placeholder='Lọc sản phẩm...' />
      <ConfirmDialog
        open={deleteProductDialogOpen}
        onOpenStateChange={setDeleteProductDialogOpen}
        title='Bạn có chắc là muốn xóa sản phẩm này chứ?'
        description='Sản phẩm sau khi bị xóa không thể khôi phục'
        onConfirm={() => {
          if (!deleteProductResult.isLoading) {
            handleDeleteProduct(selectedProduct as string)
            setSelectedProduct(null)
          }
        }}
      />
    </>
  )
}
