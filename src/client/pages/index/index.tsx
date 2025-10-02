import React, { useState, useEffect } from 'react'
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import Study from '../study/index'
import Contacts from '../contacts/index'
import ForumList from '../forumList/index'
import DashBoard from '../dashboard';
import Tabbar from '../../components/Tabbar/index'
import Game from '../game'

import './index.scss'

const Index: React.FC = observer(() => {
  const [count, setCount] = useState(1)
  const [current, setCurrent] = useState(0)

  const getChatRoomInfo = async () => {
    try {
      const { chatroomStore: { socketConnect, setUserInfo, setContactsList }, infoStore: { handleUserLogin, openid } } = useStore()
      await handleUserLogin()

      // await getUserInfo()
      await setUserInfo()
      await setContactsList()
      await socketConnect(openid)
    } catch (e) {
      setTimeout(() => {
        getChatRoomInfo()
      }, 1000)
    }
  }

  useEffect(() => {
    getChatRoomInfo()
  }, [])

  useReachBottom(() => {
    /* 触摸底部加载更多题库 */
  })

  usePullDownRefresh(async () => {
    /* 下拉刷新课程、题库列表 */
    Taro.showNavigationBarLoading()
    Taro.showLoading({ title: '刷新中...' })
    const { studyStore: { getCourseList, getExerciseList } } = useStore();
    await getCourseList()
    await getExerciseList()
    Taro.hideLoading()
    Taro.hideNavigationBarLoading()
    Taro.stopPullDownRefresh()
  })

  const switchTab = (index: number): void => {
    const navigationTitle: Array<string> = [
      '首页', '聊天室', '对战', '论坛', '个人中心'
    ]
    setCurrent(index)
    Taro.setNavigationBarTitle({ title: navigationTitle[index] })
  }

  return (
    <View className='index-container'>
      {current === 0 ? <Study />
        : current === 1 ? <Contacts />
          : current === 2 ? <Game />
            : current === 3 ? <ForumList />
              : current === 4 ? <DashBoard />
                : null}
      <Tabbar onSwitchTab={switchTab} current={current} />
    </View>
  )
})

Index.config = {
  navigationBarTitleText: '首页',
  enablePullDownRefresh: true, // 允许下拉加载
}

export default Index
