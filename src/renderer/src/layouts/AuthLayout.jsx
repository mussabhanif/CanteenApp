import { Outlet, Navigate } from 'react-router-dom'
import loginBg from '@/assets/login_bg.jpg'

export function AuthLayout() {
  return (
    <div className={`relative min-h-screen flex items-center justify-center bg-cover bg-center select-none`} style={{backgroundImage: `url(${loginBg})`}}>
      <div className="absolute inset-0 bg-black/40"></div>
      <Outlet />
    </div>
  )
}

