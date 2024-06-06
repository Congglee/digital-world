import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Separator } from 'src/components/ui/separator'
import { config } from 'src/constants/config'
import { User } from 'src/types/user.type'

interface UserInformationProps {
  userProfile: User
  userOrdersLength: number
}

export default function UserProfileInformation({ userProfile, userOrdersLength }: UserInformationProps) {
  return (
    <>
      <div className='text-center space-y-4 mb-5'>
        <div className='mx-auto w-[100px] h-[100px] overflow-hidden rounded-[15px]'>
          <img
            src={userProfile.avatar ? userProfile.avatar : config.defaultUserImageUrl}
            alt='user avatar'
            className='aspect-square w-full h-full'
          />
        </div>
        <div className='space-y-1'>
          <h4 className='text-xl font-semibold'>{userProfile.name}</h4>
          <p className='text-muted-foreground text-sm'>{userProfile.email}</p>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div className='text-center space-y-1'>
          <h6 className='text-sm font-semibold'>{userOrdersLength}</h6>
          <p className='text-muted-foreground capitalize'>Đã Đặt</p>
        </div>
        <div className='text-center space-y-1'>
          <h6 className='text-sm font-semibold'>{userProfile.wishlist.length}</h6>
          <p className='text-muted-foreground capitalize'>Yêu Thích</p>
        </div>
        <div className='text-center space-y-1'>
          <h6 className='text-sm font-semibold'>{userProfile.cart.length}</h6>
          <p className='text-muted-foreground capitalize'>Giỏ Hàng</p>
        </div>
      </div>
      <Separator className='my-5' />
      <div className='pt-[30px] space-y-6'>
        <h5 className='text-lg font-semibold'>Thông tin liên lạc</h5>
        <div className='space-y-[5px]'>
          <h6 className='font-semibold'>Địa chỉ email</h6>
          <p className='text-sm text-muted-foreground'>{userProfile.email}</p>
        </div>
        <div className='space-y-[5px]'>
          <h6 className='font-semibold'>Số điện thoại</h6>
          <p className='text-sm text-muted-foreground'>{userProfile.phone}</p>
        </div>
        <div className='space-y-[5px]'>
          <h6 className='font-semibold'>Ngày sinh</h6>
          <p className='text-sm text-muted-foreground'>
            {userProfile.date_of_birth ? format(userProfile.date_of_birth, 'd MMMM, yyyy', { locale: vi }) : ''}
          </p>
        </div>
      </div>
    </>
  )
}
