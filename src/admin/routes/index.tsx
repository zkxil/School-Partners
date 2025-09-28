import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from '../components/PrivateRoute'
import { Login, Register } from '../pages'
import Main from '../components/Main/index'

const AppRoutes: React.FC = () => (
  <Routes>
    {/* 公共路由 */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* 私有路由 */}
    <Route
      path="/admin/*"
      element={
        <PrivateRoute >
          <Main /> {/* Main 内再处理 /admin/* 的子路由 */}
        </PrivateRoute>
      }
    />

    {/* 默认跳转 */}
    <Route path="/" element={<Navigate to="/admin" replace />} />

    {/* 可选：未匹配路由 */}
    <Route path="*" element={<div>404 Not Found</div>} />
  </Routes>
)

export default AppRoutes