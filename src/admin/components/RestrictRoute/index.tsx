import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { message } from 'antd'
import useStore from '@/admin/hooks/useStore'

interface Props {
  children: React.ReactNode
}

const RestrictRoute: React.FC<Props> = ({ children }) => {
  const { userInfoStore } = useStore()
  const { isActived } = userInfoStore
  const location = useLocation()

  console.log('RestrictRoute location', location)
  console.log('isActived 1111', isActived)
  useEffect(() => {
    if (!isActived) {
      message.warn('请先完善班级信息')
    }
  }, [isActived])

  if (!isActived) {
    // 未激活跳转到班级仪表盘，并保留来源路径
    return <Navigate to="/admin/class/class-dashboard" state={{ from: location }} replace />
  }
  console.log('isActived 2222', isActived)
  return <>{children}</>
}

export default RestrictRoute
