import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import List from '../../components/Study/List/index'
import Navigation from '../../components/Study/Navigation/index'
import Title from '../../components/Study/Title/index'
import Banner from '../../components/Study/Banner/index'

import './index.scss'



const Study: React.FC = observer(() => {
  const getCourseInfo = async () => {
    try {
      const { studyStore: { getCourseList, getExerciseList } } = useStore();
      await getCourseList()
      await getExerciseList()
      Taro.hideLoading()
    } catch (e) {
      Taro.showToast({
        title: '资源加载失败，请重试...',
        icon: 'none'
      })
      setTimeout(() => {
        getCourseInfo()
      }, 1000)
    }
  }

  useEffect(() => {
    Taro.showLoading({
      title: '加载中...'
    })
    getCourseInfo()
  }, [])

  return (
    <View className='study-container'>
      <View className='study-banner'>
        <Image className='bg' src={'http://cdn.algbb.cn/study/banner-bg.svg'}></Image>
        <View className='slogan'>
          <View><View className='title'>Hey Guys</View >come to study !</View>
          <View className='button'>Let's start</View>
        </View>
      </View>
      <Navigation />
      <Title link='courseList'>推荐课程</Title>
      <Banner />
      <Title link='exerciseList'>热门题库</Title>
      <List />
    </View>
  )
})

Study.config = {
  navigationBarTitleText: '学习',
}

export default Study
