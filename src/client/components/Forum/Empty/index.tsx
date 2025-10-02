import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

const Empty: React.FC = () => {
  const handleAddClick = () => {
    Taro.navigateTo({ url: '/pages/forumPublish/index' })
  }

  return (
    <View className="empty__container">
      <Image className="image" src="http://cdn.algbb.cn/forum/empty.svg" />
      <View className="title">No Forums Here</View>
      <View className="content">赶快前往论坛社区中发表新的贴子吧</View>
      <Image
        className="add"
        src="http://cdn.algbb.cn/forum/add.png"
        mode="aspectFill"
        onClick={handleAddClick}
      />
    </View>
  )
}

export default Empty
