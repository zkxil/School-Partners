import React from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { observer } from 'mobx-react-lite'
import './index.scss'
const Navigation: React.FC = observer(() => {

  const navigator: Array<{ title: string, icon: string, link: string }> = [
    { title: '课程', icon: 'icon-course', link: '/pages/courseList/index' },
    { title: '做题', icon: 'icon-exam', link: '/pages/exerciseList/index' },
    { title: '分类', icon: 'icon-type', link: '' },
    { title: '排行', icon: 'icon-rank', link: '/pages/rankList/index' }
  ]

  return (
    <View className='navigation' >
      <View className='navigation-container'>
        {navigator.map((item, index) => {
          const { title, icon, link } = item;
          return (
            <View className='link-wrap' key={index} onClick={() => { Taro.navigateTo({ url: link }) }} >
              <View className='link-icon'>
                <View className={`iconfont ${icon}`}></View>
              </View>
              <View>{title}</View>
            </View>
          )
        })}
      </View>
    </View >
  )
})

export default Navigation 
