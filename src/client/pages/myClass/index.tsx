import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import './index.scss'

const MyClass: React.FC = observer(() => {
  const store = useStore() // 获取store实例

  useEffect(() => {
    // 组件加载时的逻辑
  }, [])

  return (
    <View className="myclass__container">
      1
    </View>
  )
})

export default MyClass