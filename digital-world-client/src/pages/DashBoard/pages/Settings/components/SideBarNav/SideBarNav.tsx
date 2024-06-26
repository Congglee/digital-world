import { HTMLAttributes } from 'react'
import { NavLink } from 'react-router-dom'
import { buttonVariants } from 'src/components/ui/button'
import { cn } from 'src/utils/utils'

interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  items: {
    path: string
    label: string
  }[]
}

export default function SideBarNav({ className, items, ...props }: SidebarNavProps) {
  return (
    <nav
      className={cn('overflow-auto pb-2 flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)}
      {...props}
    >
      {items.map((item) => (
        <NavLink
          to={item.path}
          key={item.path}
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: 'ghost' }),
              isActive ? 'bg-muted hover:bg-muted' : 'hover:bg-transparent hover:underline',
              'justify-start uppercase'
            )
          }
          end
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
