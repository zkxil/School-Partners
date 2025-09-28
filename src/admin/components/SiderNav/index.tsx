import React, { FC, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  HomeOutlined,
  ProfileOutlined,
  UserOutlined,
  NotificationOutlined
} from '@ant-design/icons'

const { Sider } = Layout

import './index.scss'

const SiderNav: FC = () => {
  const location = useLocation() // React Router v6 获取当前路由信息
  const pathname = location.pathname
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['/admin']) // 当前选中的菜单项
  const [openedKeys, setOpenedKeys] = useState<string[]>([]) // 当前展开的 SubMenu


  useEffect(() => {
    console.log('SiderNav pathname:', pathname);
    const rank = pathname.split('/') // 拆分路径用于判断层级
    console.log('Rank:', rank);
    if (rank.length === 2) {
      // 一级目录（如 /admin）
      setSelectedKeys([pathname]);
      setOpenedKeys([]);
    } else if (rank.length === 4) {
      // 二级目录（如 /admin/content/exercise-list）
      setSelectedKeys([pathname]);
      setOpenedKeys([rank.slice(0, 3).join('/')]); // 展开对应的父级目录 (/admin/content)
    }
  }, [pathname]);


  // 菜单展开/收起时触发
  const handleMenuChange = (openKeys: string[]): void => {
    setOpenedKeys(openKeys)
  }

  // antd v5 推荐用 items 配置菜单，而不是 Menu.Item / SubMenu
  const items = [
    {
      key: '/admin',
      icon: <HomeOutlined />,
      label: <Link to="/admin">首页</Link> // 首页
    },
    {
      key: '/admin/content',
      icon: <ProfileOutlined />,
      label: '内容管理',
      // 子菜单项
      children: [
        {
          key: '/admin/content/exercise-list',
          label: <Link to="/admin/content/exercise-list">题库管理</Link>
        },
        {
          key: '/admin/content/course-list',
          label: <Link to="/admin/content/course-list">课程管理</Link>
        },
        {
          key: '/admin/content/exam-list',
          label: <Link to="/admin/content/exam-list">考试管理</Link>
        },
        {
          key: '/admin/content/mark-paper',
          label: <Link to="/admin/content/mark-paper">批阅作业</Link>
        }
      ]
    },
    {
      key: '/admin/class',
      icon: <UserOutlined />,
      label: '班级建设',
      // 子菜单项
      children: [
        {
          key: '/admin/class/class-dashboard',
          label: <Link to="/admin/class/class-dashboard">班级管理</Link>
        },
        { key: '1', label: <Link to="/#">1</Link> },
        { key: '2', label: <Link to="/#">2</Link> },
        { key: '3', label: <Link to="/#">3</Link> }
      ]
    },
    {
      key: 'sub3',
      icon: <NotificationOutlined />,
      label: 'subnav 3',
      // 子菜单项
      children: [
        { key: '9', label: 'option9' },
        { key: '10', label: 'option10' },
        { key: '11', label: 'option11' },
        { key: '12', label: 'option12' }
      ]
    }
  ]

  return (
    <Sider className="sider-nav__container">
      <Menu
        mode="inline"
        // defaultSelectedKeys={['/admin']} // 默认选中首页
        selectedKeys={selectedKeys} // 动态高亮选中的菜单
        openKeys={openedKeys} // 控制展开的 SubMenu
        onOpenChange={handleMenuChange} // 展开/收起回调
        onClick={handleMenuClick} // 添加点击事件
        items={items} // 菜单配置
      />
    </Sider>
  )
}

export default SiderNav
