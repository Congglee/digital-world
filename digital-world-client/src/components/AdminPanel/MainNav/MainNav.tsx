import { Link } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import path from 'src/constants/path'
import { cn } from 'src/utils/utils'

export default function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn('flex items-center', className)} {...props}>
      <Button asChild variant='ghost'>
        <Link to={path.dashboard} className='text-sm font-medium transition-colors hover:text-primary'>
          Overview
        </Link>
      </Button>
      <Button asChild variant='ghost'>
        <Link
          to={path.categoryDashboard}
          className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        >
          Category
        </Link>
      </Button>
      <Button asChild variant='ghost'>
        <Link
          to={path.productsDashboard}
          className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        >
          Product
        </Link>
      </Button>
      <Button asChild variant='ghost'>
        <Link
          to={path.userDashBoard}
          className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        >
          User
        </Link>
      </Button>
      <Button asChild variant='ghost'>
        <Link
          to='/examples/dashboard'
          className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        >
          Settings
        </Link>
      </Button>
    </nav>
  )
}
