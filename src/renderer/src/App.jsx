import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import {AuthLayout} from '@/layouts/AuthLayout'
import {AppLayout} from '@/layouts/AppLayout'
import {Login} from '@/pages/auth/Login'
import {Dashboard} from '@/pages/app/Dashboard'
import { useEffect, useState } from 'react'
import { AuthApi } from './server/api'
import { ClipLoader } from 'react-spinners'
import { Cashiers } from './pages/app/Cashiers'
import { Products } from './pages/app/Products'
import { Orders } from './pages/app/Orders'
import { useToast } from './hooks/use-toast'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const {toast} = useToast()

  const checkAuth = async () => {
    setLoading(true)
    try {
      const response = await AuthApi.getProfile()
      setUser(response.data?.user || null)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await AuthApi.logout()
      await checkAuth() // Re-check auth status after logout
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
    <div className='bg-primary h-screen w-screen flex items-center justify-center'>
      <ClipLoader color='#fff' loading={loading} size={120} />
    </div>
    )
  }

  return (
    <HashRouter>
      <Routes>
        {user ? (
          <Route element={<AppLayout onLogout={handleLogout} user={user} toast={toast}/>}>
            <Route index path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard toast={toast} />} />
            <Route path="/cashiers" element={<Cashiers toast={toast} />} />
            <Route path="/products" element={<Products toast={toast} />} />
            <Route path="/orders" element={<Orders toast={toast} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login onLoginSuccess={checkAuth} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>
        )}
      </Routes>
    </HashRouter>
  )
}

export default App
