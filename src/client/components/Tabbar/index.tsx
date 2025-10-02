import React from 'react'
import { View } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'

import './index.scss'

interface IProps {
  onSwitchTab: (index: number) => void
  current: number
}

const Tabbar: React.FC<IProps> = ({ current, onSwitchTab }) => {
  const tabList = [
    { title: '首页', iconType: 'bullet-list' },
    { title: '聊天', iconType: 'message' },
    { title: '对战', iconType: 'edit' },
    { title: '论坛', iconType: 'bookmark' },
    { title: '个人', iconType: 'user' }
  ]

  return (
    <View>
      <AtTabBar
        fixed
        selectedColor='#1890ff'
        tabList={tabList}
        onClick={onSwitchTab}
        current={current}
      />
    </View>
  )
}

export default Tabbar
