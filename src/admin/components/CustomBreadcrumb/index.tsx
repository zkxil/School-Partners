import React from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'

const CustomBreadcrumb = ({ list }: { list: Array<string> }) => {
  const items = [
    {
      title: <Link to='/admin'>首页</Link>
    },
    ...(list || []).map((item: string) => ({
      title: item
    }))
  ]

  return (
    <Breadcrumb
      style={{ marginBottom: 20, height: 20, cursor: 'default' }}
      items={items}
    />
  )
}
export default CustomBreadcrumb