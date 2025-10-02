import React, { useEffect } from 'react'
import Taro, { useDidShow, useUnload } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'
import { AtTabs, AtTabsPane } from 'taro-ui'

import Topic from '../../components/Exercise/Topic/index'
import Options from '../../components/Exercise/Options/index'
import Status from '../../components/Exercise/Status/index'

import './index.scss'

const Exam: React.FC = observer(() => {
  useDidShow(() => {
    // 页面显示时的逻辑
  })

  useUnload(() => {
    const { exerciseStore: { resetExerciseDetail } } = useStore()
    resetExerciseDetail()
  })

  const switchPage = (current: number) => {
    const { exerciseStore: { setCurrentPage } } = useStore();
    setCurrentPage(current)
  }

  const generateTab = (): Array<{ title: string }> => {
    const { exerciseStore: { topicList } } = useStore();
    return Array.from({ length: topicList.length }).map((_, index) => ({ title: (index + 1).toString() }))
  }

  const switchFontSize = (type: number): void => {
    const { exerciseStore: { fontSizeId, setFontSize } } = useStore();
    setFontSize(fontSizeId + type)
  }

  const { exerciseStore } = useStore();
  const { currentPage, topicList, theme } = exerciseStore;
  const tabList = generateTab();

  return (
    <View className={`exam-container ${theme}`}>
      <AtTabs
        current={currentPage}
        scroll
        tabList={tabList}
        onClick={switchPage}>
        {topicList.map((_, index) => {
          return (
            <AtTabsPane current={currentPage} index={index} key={index}>
              <Topic number={index} />
              <Options number={index} />
            </AtTabsPane>
          )
        })}
      </AtTabs>
      <Status />
    </View>
  )
})

Exam.config = {
  navigationBarTitleText: '刷题'
}

export default Exam
