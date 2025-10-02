import React from 'react'
import { View } from '@tarojs/components'
import { AtActivityIndicator } from 'taro-ui'
import { observer } from 'mobx-react-lite'

import { useStore } from '../../../store/index'

import './index.scss'

const List: React.FC = observer(() => {
  const { studyStore: { hotExerciseList }, exerciseStore: { getExerciseDetail } } = useStore()

  return hotExerciseList && hotExerciseList.slice().length !== 0 ? (
    <View className='list-container'>
      {hotExerciseList.map((item) => {
        const { id, exerciseName, exerciseContent } = item;
        return (
          <View className='list-wrap' key={id} onClick={() => { getExerciseDetail(id) }}>
            <View className='list-preview'>
              <View className='iconfont icon-tiku'></View>
            </View>
            <View className='list-info'>
              <View className='title'>{exerciseName}</View>
              <View className='content'>{exerciseContent}</View>
            </View>
          </View>
        )
      })}
    </View>
  ) : (
    <View className='list-loading'>
      <AtActivityIndicator size={40} content='加载中' mode='center'></AtActivityIndicator>
    </View>
  )
})

export default List
