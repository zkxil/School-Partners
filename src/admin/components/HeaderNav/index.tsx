import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Dropdown, message } from 'antd'
import { UserOutlined, SettingOutlined, PoweroffOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'

import useStore from '@/admin/hooks/useStore'
import './index.scss'

const HeaderNav: FC = () => {
  const { userInfoStore } = useStore()
  const { username } = userInfoStore
  const navigate = useNavigate()

  // 退出登录
  const handleLogout = () => {
    message.success('退出成功')
    localStorage.removeItem('token')
    navigate('/login') // React Router v6 替换 history.push
  }

  // Antd v4 Dropdown + Menu 写法
  const menuItems = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined /> 个人信息
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <SettingOutlined /> 管理设置
        </span>
      ),
    },
    { type: 'divider' },
    {
      key: '3',
      label: (
        <span onClick={handleLogout}>
          <PoweroffOutlined /> 退出登录
        </span>
      ),
    },
  ]

  return (
    <div className="header__container">
      <div className="header__wrap">
        <div className="logo">School-Partners</div>
        <Dropdown menu={{ items: menuItems }}>
          <div className="info">
            <span>{username}</span>
            <img src="http://cdn.algbb.cn/avatar" width="35" height="35" />
          </div>
        </Dropdown>
      </div>
    </div>
  )
}

export default observer(HeaderNav)
