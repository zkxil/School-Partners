import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../../utils/session'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation()
  console.log('PrivateRoute location', location)

  // ✅ 返回 children，不要再额外 Navigate
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
}

export default PrivateRoute
