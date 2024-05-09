import { pdf } from '@react-pdf/renderer'
import { ColumnDef } from '@tanstack/react-table'
import { saveAs } from 'file-saver'
import { PlusCircle, Star, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmDialog from 'src/components/AdminPanel/ConfirmDialog'
import DataTable from 'src/components/AdminPanel/DataTable'
import DataTableColumnHeader from 'src/components/AdminPanel/DataTableColumnHeader'
import DataTableRowActions from 'src/components/AdminPanel/DataTableRowActions'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import path from 'src/constants/path'
import { useGetAllBrandsQuery } from 'src/redux/apis/brand.api'
import { useGetAllCategoriesQuery } from 'src/redux/apis/category.api'
import {
  useDeleteManyProductsMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery
} from 'src/redux/apis/product.api'
import { Category } from 'src/types/category.type'
import { Product } from 'src/types/product.type'
import { convertHTMLToPlainText, formatCurrency } from 'src/utils/utils'
import PDFProductsTableDocument from '../components/PDFProductsTable'

const exportDataHeaders = [
  'ID',
  'Tên sản phẩm',
  'Ảnh',
  'Giá sản phẩm',
  'Giá gốc sản phẩm',
  'Đánh giá',
  'Danh mục',
  'Thương hiệu',
  'Thông số kỹ thuật'
]

export default function ProductList() {
  const { data: productsData } = useGetAllProductsQuery()
  useGetAllBrandsQuery()
  useGetAllCategoriesQuery()

  const [deleteProductDialogOpen, setDeleteProductDialogOpen] = useState<boolean>(false)
  const [deleteProductsDialogOpen, setDeleteProductsDialogOpen] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [selectedProductsIds, setSelectedProductsIds] = useState<string[]>([])
  const [deleteProduct, deleteProductResult] = useDeleteProductMutation()
  const [deleteManyProducts, deleteManyProductsResult] = useDeleteManyProductsMutation()
  const navigate = useNavigate()

  const csvExportProductsData = useMemo(() => {
    const rows = productsData
      ? productsData.data.products.map((product) => [
          product._id,
          product.name,
          product.thumb,
          product.price,
          product.price_before_discount,
          product.total_ratings,
          product.category.name,
          product.brand,
          convertHTMLToPlainText(product.overview)
        ])
      : []

    return [exportDataHeaders, ...rows]
  }, [productsData])

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id)
  }

  const handleDeleteManyProducts = async (productIds: string[]) => {
    await deleteManyProducts({ list_id: productIds })
  }

  const handleDownloadPdf = () => {
    pdf(<PDFProductsTableDocument products={productsData?.data.products!} />)
      .toBlob()
      .then((blob) => saveAs(blob, 'danh_sach_san_pham.pdf'))
  }

  useEffect(() => {
    if (deleteProductResult.isSuccess) {
      toast.success(deleteProductResult.data.data.message)
    }
  }, [deleteProductResult.isSuccess])

  useEffect(() => {
    if (deleteManyProductsResult.isSuccess) {
      toast.success(deleteManyProductsResult.data.data.message)
    }
  }, [deleteManyProductsResult.isSuccess])

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
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
            const productId = row.original._id
            if (!row.getIsSelected()) {
              setSelectedProductsIds((prevIds) => [...prevIds, productId])
            } else {
              setSelectedProductsIds((prevIds) => prevIds.filter((id) => id !== productId))
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
      accessorKey: 'total_ratings',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Đánh giá' />,
      footer: 'Đánh giá',
      cell: ({ row }) => {
        return (
          <div className='font-medium flex items-center space-x-1'>
            <Star className='size-4 fill-yellow-400 text-yellow-400' />
            <span className='font-semibold'>{row.getValue('total_ratings')}</span>
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
      enableGlobalFilter: true,
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
      },
      filterFn: (row, id, value) => {
        return value.includes((row.getValue(id) as Category)._id)
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
            setSelectedProduct(row.original._id)
            setDeleteProductDialogOpen(true)
          }}
          onEdit={() => {
            navigate(path.updateProduct.replace(':product_id', row.original._id))
          }}
        />
      )
    }
  ]

  return (
    <>
      <PageHeading
        heading='Sản phẩm'
        csvData={csvExportProductsData}
        csvFileName='danh_sach_san_pham.csv'
        handleDownloadPdf={handleDownloadPdf}
        pdfViewDocument={<PDFProductsTableDocument products={productsData?.data.products!} />}
      >
        <Link to={path.addProduct}>
          <Button variant='outline' className='w-full space-x-2 bg-blue-500'>
            <PlusCircle />
            <span>Thêm sản phẩm</span>
          </Button>
        </Link>
        <Button
          variant='destructive'
          className='space-x-2'
          onClick={() => {
            if (selectedProductsIds.length > 0) {
              setDeleteProductsDialogOpen(true)
            } else {
              toast.info('Vui lòng chọn một sản phẩm')
            }
          }}
        >
          <Trash2 className='size-5' />
          <span>Xóa</span>
        </Button>
      </PageHeading>
      <DataTable
        data={productsData?.data.products || []}
        columns={columns}
        placeholder='Lọc sản phẩm...'
        handleSelectedRowsIds={setSelectedProductsIds}
        // queryConfig={queryConfig}
        // pageCount={productsData?.data.pagination.page_size!}
      />
      <ConfirmDialog
        open={deleteProductDialogOpen}
        onOpenStateChange={setDeleteProductDialogOpen}
        title='Bạn có chắc là muốn xóa sản phẩm này chứ?'
        description='Sản phẩm sau khi bị xóa không thể khôi phục'
        onConfirm={() => {
          if (!deleteProductResult.isLoading) {
            handleDeleteProduct(selectedProduct!)
            setSelectedProduct(null)
          }
        }}
      />
      <ConfirmDialog
        open={deleteProductsDialogOpen}
        onOpenStateChange={setDeleteProductsDialogOpen}
        title='Bạn có chắc là muốn xóa những sản phẩm này chứ?'
        description='Sản phẩm sau khi bị xóa không thể khôi phục'
        onConfirm={() => {
          if (!deleteManyProductsResult.isLoading) {
            handleDeleteManyProducts(selectedProductsIds)
            setSelectedProductsIds([])
          }
        }}
      />
    </>
  )
}
