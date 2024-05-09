import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { CircleUserRound, Eye, EyeOff, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmDialog from 'src/components/AdminPanel/ConfirmDialog'
import DataTable from 'src/components/AdminPanel/DataTable'
import DataTableColumnHeader from 'src/components/AdminPanel/DataTableColumnHeader'
import DataTableRowActions from 'src/components/AdminPanel/DataTableRowActions'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import ProductRating from 'src/components/ProductRating'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import {
  useDeleteManyRatingsMutation,
  useDeleteRatingMutation,
  useGetProductDetailQuery
} from 'src/redux/apis/product.api'
import { Rating } from 'src/types/product.type'
import { getAvatarUrl } from 'src/utils/utils'
import UpdateRatingStatusDialog from '../components/UpdateRatingStatusDialog/UpdateRatingStatusDialog'
import { pdf } from '@react-pdf/renderer'
import PDFRatingDetailTable from '../components/PDFRatingDetailTable'
import { saveAs } from 'file-saver'

const exportDataHeaders = ['RatingID', 'Khách hàng', 'Đánh giá', 'Bình luận', 'Ngày đăng']

export default function RatingDetail() {
  const { product_id } = useParams()
  const { data: productDetailData } = useGetProductDetailQuery(product_id!)
  const product = productDetailData?.data.data
  const publishedRatings = useMemo(() => {
    return product ? product.ratings.filter((rating) => rating.publish === true) : []
  }, [product])
  const unpublishedRatings = useMemo(() => {
    return product ? product.ratings.filter((rating) => rating.publish === false) : []
  }, [product])

  const [deleteRatingDialogOpen, setDeleteRatingDialogOpen] = useState<boolean>(false)
  const [deleteRatingsDialogOpen, setDeleteRatingsDialogOpen] = useState<boolean>(false)
  const [selectedRating, setSelectedRating] = useState<Rating | string | null>(null)
  const [selectedRatingsIds, setSelectedRatingsIds] = useState<string[]>([])
  const [updateRatingStatusDialogOpen, setUpdateRatingStatusDialogOpen] = useState<boolean>(false)
  const [deleteRating, deleteRatingResult] = useDeleteRatingMutation()
  const [deleteManyRatings, deleteManyRatingsResult] = useDeleteManyRatingsMutation()

  const handleDeleteRating = async (productId: string, ratingId: string) => {
    await deleteRating({ product_id: productId, rating_id: ratingId })
  }

  const handleDeleteManyRatings = async (productId: string, ratingIds: string[]) => {
    await deleteManyRatings({ product_id: productId, payload: { list_id: ratingIds } })
  }

  useEffect(() => {
    if (deleteRatingResult.isSuccess) {
      toast.success(deleteRatingResult.data.data.message)
    }
  }, [deleteRatingResult.isSuccess])

  useEffect(() => {
    if (deleteManyRatingsResult.isSuccess) {
      toast.success(deleteManyRatingsResult.data.data.message)
    }
  }, [deleteManyRatingsResult.isSuccess])

  const csvExportRatingsDetailData = useMemo(() => {
    const rows = product
      ? product.ratings.map((rating) => [
          rating._id,
          rating.user_name,
          `${rating.star} sao`,
          rating.comment,
          format(rating.date, 'dd/MM/yyyy')
        ])
      : []
    return [exportDataHeaders, ...rows]
  }, [product])

  const handleDownloadPdf = () => {
    pdf(<PDFRatingDetailTable ratings={product?.ratings!} productName={product?.name!} />)
      .toBlob()
      .then((blob) => saveAs(blob, 'danh_sach_danh_gia.pdf'))
  }

  const columns: ColumnDef<Rating>[] = [
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
            const ratingId = row.original._id
            if (!row.getIsSelected()) {
              setSelectedRatingsIds((prevIds) => [...prevIds, ratingId])
            } else {
              setSelectedRatingsIds((prevIds) => prevIds.filter((id) => id !== ratingId))
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
      header: ({ column }) => <DataTableColumnHeader column={column} title='RatingID' />,
      cell: ({ row }) => <div>{row.getValue('_id')}</div>,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'user_name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Khách hàng' />,
      footer: 'Khách hàng',
      cell: ({ row }) => {
        return <div className='font-medium'>{row.getValue('user_name')}</div>
      },
      enableSorting: false
    },
    {
      accessorKey: 'user_avatar',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Avatar' />,
      footer: 'Avatar',
      cell: ({ row }) => {
        return (
          <div className='size-14 rounded-lg overflow-hidden'>
            {row.getValue('user_avatar') ? (
              <img
                src={getAvatarUrl(row.getValue('user_avatar'))}
                alt='user avatar'
                className='w-full h-full object-cover'
              />
            ) : (
              <CircleUserRound strokeWidth={1.5} className='size-full text-foreground' />
            )}
          </div>
        )
      },
      enableSorting: false
    },
    {
      accessorKey: 'star',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Đánh giá' />,
      footer: 'Đánh giá',
      cell: ({ row }) => {
        return (
          <div className='flex items-center space-x-2'>
            <span className='font-semibold'>{row.getValue('star')}</span>
            <ProductRating
              rating={row.getValue('star')}
              activeClassname='fill-orange-400 text-orange-300 h-4 w-4'
              nonActiveClassname='fill-gray-300 text-gray-300 h-4 w-4'
            />
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes((row.getValue(id) as string).toString())
      }
    },
    {
      accessorKey: 'comment',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Bình luận' />,
      footer: 'Bình luận',
      cell: ({ row }) => {
        return <div className='font-medium'>{row.getValue('comment')}</div>
      }
    },
    {
      accessorKey: 'date',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày đăng' />,
      footer: 'Ngày đăng',
      cell: ({ row }) => {
        return <div className='font-medium'>{format(row.getValue('date'), 'dd-MM-yyyy')}</div>
      }
    },
    {
      accessorKey: 'publish',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái hiển thị' />,
      footer: 'Trạng thái hiển thị',
      cell: ({ row }) => {
        return (
          <div className='font-medium'>
            {row.getValue('publish') ? (
              <div className='flex items-center space-x-2'>
                <Eye className='size-5' />
                <span>Hiển thị</span>
              </div>
            ) : (
              <div className='flex items-center space-x-2'>
                <EyeOff className='size-5' />
                <span>Ẩn</span>
              </div>
            )}
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
            setSelectedRating(row.original._id)
            setDeleteRatingDialogOpen(true)
          }}
          onEdit={() => {
            setSelectedRating(row.original)
            setUpdateRatingStatusDialogOpen(true)
          }}
        />
      )
    }
  ]

  if (!product) return null

  return (
    <>
      <PageHeading
        heading='Đánh giá chi tiết'
        description={`Những đánh giá của sản phẩm ${product.name}`}
        csvData={csvExportRatingsDetailData}
        csvFileName='danh_sach_danh_gia_chi_tiet.csv'
        handleDownloadPdf={handleDownloadPdf}
        pdfViewDocument={<PDFRatingDetailTable ratings={product?.ratings!} productName={product?.name!} />}
      >
        <Button
          variant='destructive'
          className='space-x-2'
          onClick={() => {
            if (selectedRatingsIds.length > 0) {
              setDeleteRatingsDialogOpen(true)
            } else {
              toast.info('Vui lòng chọn một đánh giá')
            }
          }}
        >
          <Trash2 className='size-5' />
          <span>Xóa</span>
        </Button>
      </PageHeading>
      <Tabs defaultValue='all'>
        <TabsList>
          <TabsTrigger value='all'>Tất cả</TabsTrigger>
          <TabsTrigger value='active'>Hiển thị</TabsTrigger>
          <TabsTrigger value='archived'>Lưu trữ</TabsTrigger>
        </TabsList>
        <TabsContent value='all'>
          <DataTable
            data={product.ratings || []}
            columns={columns}
            placeholder='Lọc đánh giá...'
            handleSelectedRowsIds={setSelectedRatingsIds}
          />
        </TabsContent>
        <TabsContent value='active'>
          <DataTable
            data={publishedRatings}
            columns={columns}
            placeholder='Lọc đánh giá...'
            handleSelectedRowsIds={setSelectedRatingsIds}
          />
        </TabsContent>
        <TabsContent value='archived'>
          <DataTable
            data={unpublishedRatings}
            columns={columns}
            placeholder='Lọc đánh giá...'
            handleSelectedRowsIds={setSelectedRatingsIds}
          />
        </TabsContent>
      </Tabs>
      <UpdateRatingStatusDialog
        open={updateRatingStatusDialogOpen}
        onOpenChange={setUpdateRatingStatusDialogOpen}
        selectedRating={selectedRating as Rating}
        onAfterUpdate={setSelectedRating}
        product={product}
      />
      <ConfirmDialog
        open={deleteRatingDialogOpen}
        onOpenStateChange={setDeleteRatingDialogOpen}
        title='Bạn có chắc là muốn xóa đánh giá này chứ?'
        description='Đánh giá sau khi bị xóa không thể khôi phục'
        onConfirm={() => {
          if (!deleteRatingResult.isLoading) {
            handleDeleteRating(product._id, selectedRating as string)
            setSelectedRating(null)
          }
        }}
      />
      <ConfirmDialog
        open={deleteRatingsDialogOpen}
        onOpenStateChange={setDeleteRatingsDialogOpen}
        title='Bạn có chắc là muốn xóa những đánh giá này chứ?'
        description='Những đánh giá sau khi bị xóa không thể khôi phục'
        onConfirm={() => {
          if (!deleteManyRatingsResult.isLoading) {
            handleDeleteManyRatings(product._id, selectedRatingsIds)
            setSelectedRatingsIds([])
          }
        }}
      />
    </>
  )
}
