import React, { useEffect, useState } from 'react'
import { Layout } from 'antd';

import useStore from '@/admin/hooks/useStore'

import HeaderNav from '../HeaderNav'
import ContentMain from '../ContentMain'
import SiderNav from '../SiderNav'


import './index.scss'

const Main = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { userInfoStore } = useStore()
  const { setUserInfo } = userInfoStore

  useEffect(() => {
    (async () => {
      await setUserInfo()
      setIsLoading(false)
    })()
  }, [])

  return (
    <Layout className="index__container">
      <HeaderNav />
      <Layout>
        <SiderNav />
        <Layout>
          {!isLoading && <ContentMain />}
        </Layout>
      </Layout>
    </Layout>
  )
}


export default Main