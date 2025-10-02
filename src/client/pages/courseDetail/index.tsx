import React, { useEffect } from 'react'
import Taro, { } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtRate } from 'taro-ui'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import './index.scss'



const CourseDetail: React.FC = observer(() => {
  useEffect(() => {
    // componentDidMount logic here if needed
  }, [])

  const handleVideoClick = () => {
    Taro.navigateTo({
      url: `/pages/courseVideo/index`
    })
  }

  const { courseStore: { courseDetail } } = useStore()
  const { courseAuthor, publishDate, courseViews, courseDescription, courseSteps, courseRate } = courseDetail
  return (
    <View className='course'>
      <View className='course-background' />
      <View className='course-container'>
        <View className='course-container__header' />
        <View className='course-container__info'>
          <Image className='info__avatar' src='https://wx.qlogo.cn/mmopen/vi_32/Ef99ySqq9bh56PoyZUsfg6jJcDpqJN0lKLCPyn305erwSl89U0W85BOsq7uRcrS8J3P5Y9fkst16wK0I92uLibw/132' />
          <View className='info__wrap'>
            <View className='info__header'>
              <View>by {courseAuthor}</View>
              <AtRate value={courseRate} />
            </View>
            <View className='info__footer'>
              <View>{publishDate}</View>
              <View>Reviews {courseViews}</View>
            </View>
          </View>
        </View>
        <View className='course-container__description'>
          <View className='description__title'>
            课程描述
          </View>
          <View className='description__content'>
            {courseDescription}
          </View>
        </View>
        <View className='course-container__path'>
          <View className='path__title'>
            课程步骤
          </View>
          <View className='path__container'>
            {courseSteps.map((item: any, index: number) => {
              let step = index + 1 + ''
              if (step.length === 1) step = '0' + step
              return (
                <View className='path__wrap' key={index}>
                  <Image src='http://cdn.algbb.cn/course/read.png' className='path__icon' />
                  <View className='path__info'>
                    <View className='path__name'>{item.title}</View>
                    <View className='path__description'>{item.content}</View>
                  </View>
                  <View className='path__decoration'>{step}</View>
                </View>
              )
            })}
          </View>
        </View>
        <View className="course-container__video" onClick={handleVideoClick}>播放课程视频</View>
      </View>
    </View>
  )
})

export default CourseDetail