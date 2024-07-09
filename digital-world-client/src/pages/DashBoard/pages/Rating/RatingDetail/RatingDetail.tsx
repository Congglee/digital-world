import { pdf } from '@react-pdf/renderer'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import { CircleUserRound, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmDialog from 'src/components/AdminPanel/ConfirmDialog'
import DataTable from 'src/components/AdminPanel/DataTable'
import DataTableColumnHeader from 'src/components/AdminPanel/DataTableColumnHeader'
import DataTableRowActions from 'src/components/AdminPanel/DataTableRowActions'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import ProductRating from 'src/components/ProductRating'
import { Badge } from 'src/components/ui/badge'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import { Switch } from 'src/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import PDFRatingDetailTable from 'src/pages/DashBoard/pages/Rating/components/PDFRatingDetailTable'
import {
  useDeleteManyRatingsMutation,
  useDeleteUserRatingMutation,
  useGetProductDetailQuery,
  useUpdateRatingStatusMutation
} from 'src/redux/apis/product.api'
import { Rating } from 'src/types/product.type'
import { getAvatarUrl } from 'src/utils/utils'

const exportDataHeaders = ['ID', 'Khách hàng', 'Đánh giá', 'Bình luận', 'Ngày đăng']

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

  const [updateRatingStatus, updateRatingStatusResult] = useUpdateRatingStatusMutation()
  const [deleteUserRating, deleteUserRatingResult] = useDeleteUserRatingMutation()
  const [deleteManyRatings, deleteManyRatingsResult] = useDeleteManyRatingsMutation()

  const handleUpdateRatingStatus = async (productId: string, ratingId: string, payload: { publish: boolean }) => {
    await updateRatingStatus({ product_id: productId, rating_id: ratingId, payload })
  }

  const handleDeleteRating = async (productId: string, ratingId: string) => {
    await deleteUserRating({ product_id: productId, rating_id: ratingId })
  }

  const handleDeleteManyRatings = async (productId: string, ratingIds: string[]) => {
    await deleteManyRatings({ product_id: productId, payload: { list_id: ratingIds } })
  }

  useEffect(() => {
    if (updateRatingStatusResult.isSuccess) {
      toast.success(updateRatingStatusResult.data.data.message, { position: 'top-right' })
    }
  }, [updateRatingStatusResult.isSuccess])

  useEffect(() => {
    if (deleteUserRatingResult.isSuccess) {
      toast.success(deleteUserRatingResult.data.data.message)
    }
  }, [deleteUserRatingResult.isSuccess])

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

  const handleDownloadPdf = useCallback(() => {
    pdf(<PDFRatingDetailTable ratings={product?.ratings!} productName={product?.name!} />)
      .toBlob()
      .then((blob) => saveAs(blob, 'danh_sach_danh_gia.pdf'))
  }, [product])

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
        return <div>{row.getValue('comment')}</div>
      }
    },
    {
      accessorKey: 'date',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày đăng' />,
      footer: 'Ngày đăng',
      cell: ({ row }) => {
        return <div>{format(row.getValue('date'), 'dd-MM-yyyy')}</div>
      }
    },
    {
      accessorKey: 'publish',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái hiển thị' />,
      footer: 'Trạng thái hiển thị',
      cell: ({ row }) => {
        return (
          <div className='flex items-center gap-4'>
            <Badge>{row.getValue('publish') ? 'Hiển thị' : 'Lưu trữ'}</Badge>
            <Switch
              disabled={updateRatingStatusResult.isLoading}
              checked={row.getValue('publish')}
              onCheckedChange={() =>
                handleUpdateRatingStatus(product?._id as string, row.original._id, {
                  publish: !row.getValue('publish')
                })
              }
            />
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
          enableEditing={false}
          enableDeleting={true}
          onDelete={() => {
            setSelectedRating(row.original._id)
            setDeleteRatingDialogOpen(true)
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
      <ConfirmDialog
        open={deleteRatingDialogOpen}
        onOpenStateChange={setDeleteRatingDialogOpen}
        title='Bạn có chắc là muốn xóa đánh giá này chứ?'
        description='Đánh giá sau khi bị xóa không thể khôi phục.'
        onConfirm={() => {
          if (!deleteUserRatingResult.isLoading) {
            handleDeleteRating(product._id, selectedRating as string)
            setSelectedRating(null)
          }
        }}
      />
      <ConfirmDialog
        open={deleteRatingsDialogOpen}
        onOpenStateChange={setDeleteRatingsDialogOpen}
        title='Bạn có chắc là muốn xóa những đánh giá này chứ?'
        description='Những đánh giá sau khi bị xóa không thể khôi phục.'
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
