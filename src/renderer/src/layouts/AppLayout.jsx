import { Link, Outlet, useLocation } from 'react-router-dom'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from '../components/ui/sidebar'
import AppIcon from '../../../../resources/icon.png'
import { Home, LogOut, Package, User, Users2Icon } from 'lucide-react'
import { Toaster } from "@/components/ui/toaster"
import BaseHeader from '../components/BaseHeader'

const items = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: Home
  },
  {
    name: 'Casheirs',
    path: '/cashiers',
    icon: User
  },
  {
    name: 'Products',
    path: '/products',
    icon: Package
  },
  {
    name: 'Orders',
    path: '/orders',
    icon: Users2Icon
  },
];
const AppSidebar = ({ onLogout }) => {
  const location = useLocation();
  return (
    <Sidebar className="w-64 bg-gray-800 text-white">
      <SidebarHeader className="px-4 py-6 text-lg font-bold">
        <img src={AppIcon} alt="" className='w-28 mx-auto' />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className='px-2'>
              {items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className={`py-5 ${location.pathname === item.path && 'bg-primary'}`} >
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => onLogout()} >
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  )
}

const MainContent = ({ user }) => {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();
  const location = useLocation();

  const pageName = items?.find(i => i?.path === location?.pathname)?.name
  return (
    <main style={{ maxWidth: `calc(100vw - ${(isMobile || !open) ? '0rem' : '16rem'})` }} className='ml-auto px-8 w-full transition-transform h-screen overflow-y-scroll'>
      {pageName && <BaseHeader pageName={pageName} user={user} />}
      <Outlet />
      {location.pathname != '/dashboard' && <Toaster />}
    </main>
  )
}

export function AppLayout({ onLogout, user }) {

  return (
    <SidebarProvider >
      <AppSidebar onLogout={onLogout} />
      <MainContent user={user} />
    </SidebarProvider>
  )
}

