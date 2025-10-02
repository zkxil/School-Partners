import React from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.scss'

interface IProps {
  link: string
  children: React.ReactNode
}

const Title: React.FC<IProps> = ({ link, children }) => {
  const handleNavigate = () => {
    Taro.navigateTo({ url: `/pages/${link}/index` })
  }

  return (
    <View className='title'>
      <View>{children}</View>
      <View className='link' onClick={handleNavigate}>更多</View>
    </View>
  )
}

export default Title
