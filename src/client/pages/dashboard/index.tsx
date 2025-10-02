import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import PersonalInfo from '../../components/DashBoard/PersonalInfo/index'
import Recoomend from '../../components/DashBoard/Recommend/index'
import FeatureList from '../../components/DashBoard/FeatureList/index'

import './index.scss'

const DashBoard: React.FC = observer(() => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { infoStore: { handleUserLogin, getUserInfo, userInfo } } = useStore()
      // if (userInfo.avatarUrl !== '') {
      //   setIsLoading(false)
      // }
      // else {
      try {
        Taro.showLoading({
          title: '加载中...'
        })
        await handleUserLogin()
        // await getUserInfo()
        setIsLoading(false)
        Taro.hideLoading()
      } catch (e) {

      }
      // }
    }
    init()
  }, [])

  return (
    <View className='dashboard-container'>
      <PersonalInfo />
      <Recoomend />
      <FeatureList />
    </View>
  )
  // return !isLoading ? (
  //   <View className='dashboard-container'>
  //     <PersonalInfo />
  //     <Recoomend />
  //     <FeatureList />
  //   </View>
  // ) : <Button openType='getUserInfo' >点击登录</Button>
})

DashBoard.config = {
  navigationBarTitleText: '个人中心',
}

export default DashBoard
