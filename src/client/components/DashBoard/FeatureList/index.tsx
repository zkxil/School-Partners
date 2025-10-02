import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { observer } from 'mobx-react-lite'


import './index.scss'

const FeatureList: React.FC = observer(() => {
  const navigateTo = (link: string, feature: string): void => {
    Taro.navigateTo({ url: `${link}?title=${feature}` })
  }

  const featureList: Array<{ icon: string, feature: string, link: string }> = [
    { icon: 'http://cdn.algbb.cn/dashboard/history.png', feature: '历史足迹', link: '' },
    { icon: 'http://cdn.algbb.cn/dashboard/class.png', feature: '我的班级', link: '/pages/myClass/index' },
    { icon: 'http://cdn.algbb.cn/dashboard/forums.png', feature: '我的帖子', link: '/pages/myForums/index' },
    { icon: 'http://cdn.algbb.cn/dashboard/calender.png', feature: '我的日程', link: '/pages/mySchedule/index' },
    { icon: 'http://cdn.algbb.cn/dashboard/heart.png', feature: '我的订阅', link: '' },
    { icon: 'http://cdn.algbb.cn/dashboard/star.png', feature: '我的收藏', link: '' },
    { icon: 'http://cdn.algbb.cn/dashboard/score.png', feature: '我的成绩', link: '' },
    { icon: 'http://cdn.algbb.cn/dashboard/setting.png', feature: '设置中心', link: '' },
  ]

  return (
    <View className='feature-list-container'>
      {featureList.map((item, index) => (
        <View
          className='feature-list-wrap'
          key={index}
          onClick={() => navigateTo(item.link, item.feature)}
        >
          <Image className='icon' src={item.icon} />
          <View className='feature'>{item.feature}</View>
          <Image className='arrow' src='http://cdn.algbb.cn/dashboard/arrow.png' />
        </View>
      ))}
    </View>
  )
})

export default FeatureList
