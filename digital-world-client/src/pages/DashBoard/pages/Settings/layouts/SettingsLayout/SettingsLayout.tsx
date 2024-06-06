import { Outlet } from 'react-router-dom'
import PageHeading from 'src/components/AdminPanel/PageHeading'
import { Separator } from 'src/components/ui/separator'
import SideBarNav from '../../components/SideBarNav'
import path from 'src/constants/path'

const sidebarNavItems = [
  {
    label: 'Cài đặt cửa hàng',
    path: path.settingsStore
  },
  {
    label: 'Cài đặt thanh toán',
    path: path.settingsPayment
  },
  {
    label: 'Tài khoản',
    path: path.settingsProfile
  },
  {
    label: 'Gửi mail',
    path: path.settingsSendMail
  },
  {
    label: 'Hiển thị',
    path: path.settingsAppearance
  }
]

export default function SettingsLayout() {
  return (
    <>
      <PageHeading
        heading='Cài đặt'
        description='Quản lý nội dung website và các thông tin khác.'
        hasDownload={false}
      />
      <Separator className='my-6' />
      <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <aside className='-mx-4 lg:w-1/5'>
          <SideBarNav items={sidebarNavItems} />
        </aside>
        <div className='flex-1 lg:max-w-4xl'>
          <Outlet />
        </div>
      </div>
    </>
  )
}
