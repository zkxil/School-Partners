import React from 'react'
import { View, Image } from '@tarojs/components'
import { observer } from 'mobx-react-lite'

import { useStore } from '../../../store/index'

import './index.scss'

const PersonalInfo: React.FC = observer(() => {
  const { infoStore: { userInfo } } = useStore()
  const { avatarUrl, nickName } = userInfo
  return (
    <View className='information-container'>
      <View className='information-wrap'>
        <Image className='avatar' src={avatarUrl} lazyLoad></Image>
        <View className='nickname'>
          <View>{nickName}</View>
          <View className='tag'>北京师范大学珠海分校的一名小菜鸡</View>
        </View>
        <View className='status'>
          <View className='status-wrap'>
            <View className='amount'>
              4
            </View>
            <View>通过课程</View>
          </View>
          <View className='status-wrap'>
            <View className='amount'>
              3
            </View>
            <View>完成题库</View>
          </View>
          <View className='status-wrap'>
            <View className='amount'>
              12
            </View>
            <View>收藏</View>
          </View>
        </View>
      </View>
    </View>
  )
})

export default PersonalInfo
