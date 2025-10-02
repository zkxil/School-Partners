import React, { useEffect, useState } from 'react'
import Taro, { } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import { CourseInfo } from '../../modals/courseList'

import './index.scss'



const CourseList: React.FC = observer(() => {
  const [courseList, setCourseList] = useState<Array<CourseInfo>>([])
  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      Taro.setNavigationBarTitle({
        title: '课程列表'
      })
      const { data } = await Taro.request({
        url: 'http://localhost:3000/courses'
      })
      setCourseList(data)
    }
    fetchData()
  }, [])

  const handleSearchChange = (searchValue: string) => {
    setSearchValue(searchValue)
  }

  const { courseStore: { getCourseDetail } } = useStore()
  return (
    <View className="course-list">
      <AtSearchBar
        value={searchValue}
        onChange={handleSearchChange}
      />
      <View className="course-list__container">
        {courseList.map(course => {
          const { id, courseName } = course
          return (
            <View className="course-list__wrap" key={id} onClick={() => { getCourseDetail(id, courseName) }}>
              <View className="cover"></View>
              <View className="name">{courseName}</View>
            </View>
          )
        })}
      </View>
    </View>
  )
})

export default CourseList 