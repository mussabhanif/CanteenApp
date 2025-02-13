import { renderAvatarFallback } from "../hooks/helper";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";

export default function BaseHeader({ pageName, user }) {
  return (
    <header className='py-4 flex items-center justify-between'>
      <div className="flex items-center">
        <SidebarTrigger className='mt-1' />
        <h3 className='text-xl font-semibold ml-2'>{pageName}</h3>
      </div>
      <Avatar className='cursor-pointer '>
        <AvatarImage src={user?.avatar} />
        <AvatarFallback className='bg-primary text-white select-none'>
          {renderAvatarFallback(user.name || 'Admin')}
        </AvatarFallback>
      </Avatar>
    </header>
  )
}
