import { Outlet } from 'react-router-dom'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

export default function MainLayout() {
  return (
    <div className='bg-white'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
