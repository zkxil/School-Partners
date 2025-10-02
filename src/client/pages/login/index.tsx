import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import './index.scss'



const Login: React.FC = observer(() => {
  const getUserInfo = (e: any) => {
    const { detail: { userInfo } } = e
    console.log(userInfo)
    if (userInfo) {
      Taro.reLaunch({
        url: '/pages/index/index'
      })
    } else {
      Taro.showToast({
        title: '不允许可不行哦~',
        icon: 'none'
      })
    }
  }

  return (
    <View className="login__container">
      <Image className="login__image" src="http://cdn.algbb.cn/login.svg" />
      <View className="login__wrap">
        <View>亲~您还没有登录哟</View>
        <View>需要登录后才能访问我们的页面哟</View>
      </View>
      <Button className="login__button" openType="getUserInfo" onGetUserInfo={getUserInfo}>点我登录</Button>
    </View>
  )
})

export default Login 
