import React from 'react'
import { View } from '@tarojs/components'
import { observer } from 'mobx-react-lite'

import { useStore } from '../../../store/index'

import './index.scss'

interface IProps {
  number: number,
}

const Topic: React.FC<IProps> = observer(({ number }) => {
  const { exerciseStore: { topicList, fontSize } } = useStore();
  if (!topicList[number]) return null;
  const { topicType, topicContent } = topicList[number];

  const tagList: { [key: number]: string } = {
    1: '单选',
    2: '多选',
    3: '上传'
  }

  const tag: string = tagList[topicType]
  return (
    <View className={`exam-topic ${fontSize}`}>
      <View className='type'>{tag}</View>
      {topicContent}
    </View>
  )
})

export default Topic 
