import React from 'react'
import { View, ScrollView, Image } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { AtActivityIndicator } from 'taro-ui'

import { useStore } from '../../../store/index'

import './index.scss'


const Banner: React.FC = observer(() => {
  const { studyStore: { recommendCourseList }, courseStore: { getCourseDetail } } = useStore();

  return recommendCourseList && recommendCourseList.slice().length !== 0 ? (
    <ScrollView
      className='banner-container'
      scrollX
      scrollWithAnimation
    >
      {recommendCourseList.map((item, index) => {
        const { id, courseName } = item;
        return (
          <View className='banner-item' key={id} onClick={() => { getCourseDetail(id, courseName) }}>
            <View className='title'>{courseName}</View>
            <Image className='bg' src={`http://cdn.algbb.cn/study/banner/${(index + 1).toString()}.svg`} lazyLoad />
          </View>
        )
      })}
    </ScrollView>
  ) : (
    <View className='banner-loading'>
      <AtActivityIndicator size={40} content='加载中' mode='center'></AtActivityIndicator>
    </View>
  )
})

export default Banner 
