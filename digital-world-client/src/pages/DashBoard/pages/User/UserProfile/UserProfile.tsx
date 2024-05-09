import { useParams } from 'react-router-dom'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import ChangeUserPassword from 'src/pages/DashBoard/pages/User/components/ChangeUserPassword'
import UpdateUserProfile from 'src/pages/DashBoard/pages/User/components/UpdateUserProfile'
import UserProfileInformation from 'src/pages/DashBoard/pages/User/components/UserProfileInformation'
import UserProfileOverview from 'src/pages/DashBoard/pages/User/components/UserProfileOverview'
import { useGetUserOrdersQuery } from 'src/redux/apis/order.api'
import { useGetUserQuery } from 'src/redux/apis/user.api'

export default function UserProfile() {
  const { user_id } = useParams()
  const { data: userProfileData } = useGetUserQuery(user_id!)
  const { data: userOrdersData, refetch, isFetching } = useGetUserOrdersQuery(user_id!)

  const userProfile = userProfileData?.data.data

  const handleRefetchUserOrders = () => {
    refetch()
  }

  if (!userProfile) return null

  return (
    <>
      <PageHeading heading='Thông tin người dùng' hasDownload={false}></PageHeading>
      <div className='grid grid-cols-3 grid-flow-row border border-border divide-x divide-border bg-background shadow rounded-md'>
        <div className='col-span-3 lg:col-span-1 p-6'>
          <UserProfileInformation
            userProfile={userProfile}
            userOrdersLength={userOrdersData?.data.orders.length || 0}
          />
        </div>
        <div className='col-span-3 lg:col-span-2 p-6'>
          <Tabs defaultValue='profile'>
            <TabsList>
              <TabsTrigger value='profile'>Hồ Sơ</TabsTrigger>
              <TabsTrigger value='edit'>Chỉnh Sửa</TabsTrigger>
              <TabsTrigger value='editPassword'>Đổi Mật Khẩu</TabsTrigger>
            </TabsList>
            <TabsContent value='profile'>
              <UserProfileOverview
                userOrders={userOrdersData?.data.orders || []}
                userWishlistLength={userProfile.wishlist.length}
                handleRefetch={handleRefetchUserOrders}
                loading={isFetching}
              />
            </TabsContent>
            <TabsContent value='edit'>
              <UpdateUserProfile userProfile={userProfile} />
            </TabsContent>
            <TabsContent value='editPassword'>
              <ChangeUserPassword userProfile={userProfile} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
