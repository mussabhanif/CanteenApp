import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { Login } from '@/pages/auth/Login'
import { Dashboard } from '@/pages/app/Dashboard'
import { useEffect, useState } from 'react'
import { AuthApi, SettingsApi } from './server/api'
import { ClipLoader } from 'react-spinners'
import { Cashiers } from './pages/app/Cashiers'
import { Products } from './pages/app/Products'
import { Orders } from './pages/app/Orders'
import { toast } from './hooks/use-toast'
import ProductDetails from './pages/app/ProductDetails'
import OrderCreate from './pages/app/OrderCreate'
import OrderDetails from './pages/app/OrderDetails'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [appStatus, setAppStatus] = useState('')

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

  const checkAppStatus = async () => {
    try {
      const response = await SettingsApi.getAppStatus()
      setAppStatus(response.data.status)
    } catch (error) {
      console.error('Failed to fetch app status:', error)
      setAppStatus('active')
    }
  }

  useEffect(() => {
    checkAuth()
    checkAppStatus()
  }, [])

  const handleLogout = async () => {
    try {
      await AuthApi.logout()
      await checkAuth()
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

  if (appStatus === 'inactive') {
    return (
      <div className="bg-primary h-screen flex flex-col items-center justify-center space-y-10">
        <h2 className="text-2xl text-white font-semibold text-center">
          The application is currently inactive. Please contact support for assistance.
        </h2>
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
            <Route path="/product-details/:id" element={<ProductDetails toast={toast} user={user} />} />
            <Route path="/orders" element={<Orders toast={toast} />} />
            <Route path="/order-create" element={<OrderCreate toast={toast} user={user} />} />
            <Route path="/order-details/:id" element={<OrderDetails toast={toast} user={user} />} />
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
