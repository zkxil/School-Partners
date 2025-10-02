import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSearchBar, AtIcon } from 'taro-ui'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import { ExerciseInfo } from '../../modals/exerciseDetail'

import './index.scss'

const ExerciseList: React.FC = observer(() => {
  const [exerciseList, setExerciseList] = useState<Array<ExerciseInfo>>([])
  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      Taro.setNavigationBarTitle({
        title: '习题列表'
      })
      const { data } = await Taro.request({
        url: 'http://localhost:3000/exercises'
      })
      setExerciseList(data)
    }
    fetchData()
  }, [])

  const handleSearchChange = (searchValue: string) => {
    setSearchValue(searchValue)
  }

  const generateDifficulty = (exerciseDifficulty: number): string => {
    const difficultyList = {
      1: '简单',
      2: '中等',
      3: '困难'
    }
    return difficultyList[exerciseDifficulty]
  }

  const generateType = (exerciseType: number): string => {
    const typeList = {
      1: '免费',
      2: '会员'
    }
    return typeList[exerciseType]
  }

  const { exerciseStore: { getExerciseDetail } } = useStore()
  return (
    <View className="exercise-list">
      <AtSearchBar
        value={searchValue}
        onChange={handleSearchChange}
      />
      <View className="exercise-list__container">
        {exerciseList.map(exercise => {
          const { id, exerciseName, finsihCount, totalCount, exerciseDifficulty, exerciseType } = exercise
          return (
            <View className="exercise-list__wrap" key={id} onClick={() => { getExerciseDetail(id) }}>
              <View className="name">{exerciseName}</View>
              <View className="status-bar">
                {finsihCount}人完成&emsp;共{totalCount}题&emsp;-{generateDifficulty(exerciseDifficulty)}-&emsp;
                <View className={`type ${exerciseType === 2 ? 'type--charge' : ''}`}>{generateType(exerciseType)}</View>
              </View>
              <AtIcon className="icon" value='edit' />
            </View>
          )
        })}

      </View>
    </View>
  )
})

export default ExerciseList