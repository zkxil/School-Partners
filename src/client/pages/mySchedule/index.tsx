import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { AtCalendar, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtInput } from "taro-ui"
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import { MarkInfo, TaskInfo } from '../../modals/schedule'

import './index.scss'

const MySchedule: React.FC = observer(() => {
  // 初始化状态
  const [markList, setMarkList] = useState<Array<MarkInfo>>([])
  const [taskList, setTaskList] = useState<Array<TaskInfo>>([])
  const [currentDayTaskList, setCurrentDayTaskList] = useState<Array<TaskInfo>>([])
  const [currentDay, setCurrentDay] = useState<string>('')
  const [newTaskContent, setNewTaskContent] = useState<string>('')
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)
  
  const store = useStore() // 获取store实例

  useEffect(() => {
    // 组件加载时初始化数据
    Taro.setNavigationBarTitle({ title: '我的日程' })
    
    const initialMarkList: Array<MarkInfo> = [
      { value: '2019-12-08' },
      { value: '2019-12-14' },
      { value: '2019-12-23' }
    ]
    const initialTaskList: Array<TaskInfo> = [
      { content: '完成web大作业', time: '2019-12-08' },
      { content: '准备期末考试', time: '2019-12-08' },
      { content: '开始四六级考试', time: '2019-12-14' },
      { content: '出去玩出去嗨皮', time: '2019-12-23' },
    ]
    const initialCurrentDay: string = new Date().toLocaleDateString().replace(/\//g, '-')
    
    setMarkList(initialMarkList)
    setTaskList(initialTaskList)
    setCurrentDay(initialCurrentDay)
  }, [])

  // 处理日期点击事件
  const handleDayClick = ({ value: time }: { value: string }): void => {
    const currentDayTasks: Array<TaskInfo> = taskList.filter((task: TaskInfo) => task.time === time)
    setCurrentDayTaskList(currentDayTasks)
    setCurrentDay(time)
  }

  // 处理添加按钮点击事件
  const handleAddClick = (): void => {
    setIsModalOpened(true)
  }

  // 处理确认按钮点击事件
  const handleConfirmClick = (): void => {
    const newTaskList = [...taskList, {
      content: newTaskContent,
      time: currentDay
    }]
    const newMarkList = [...markList, {
      value: currentDay
    }]
    const updatedCurrentDayTaskList: Array<TaskInfo> = newTaskList.filter((task: TaskInfo) => task.time === currentDay)

    setTaskList(newTaskList)
    setMarkList(newMarkList)
    setCurrentDayTaskList(updatedCurrentDayTaskList)
    setIsModalOpened(false)
    setNewTaskContent('')
  }

  // 处理取消按钮点击事件
  const handleCancelClick = (): void => {
    setIsModalOpened(false)
  }

  // 处理任务内容变化事件
  const handleTaskContentChange = (value: string): void => {
    setNewTaskContent(value)
  }

  return (
    <View className="schedule__container">
      <AtModal isOpened={isModalOpened}>
        <AtModalHeader>添加活动日程</AtModalHeader>
        <AtModalContent>
          <AtInput
            name="taskContent"
            type='text'
            placeholder='请输入活动日程安排'
            value={newTaskContent}
            onChange={handleTaskContentChange}
          />
        </AtModalContent>
        <AtModalAction>
          <Button onClick={handleCancelClick}>取消</Button>
          <Button onClick={handleConfirmClick}>确定</Button>
        </AtModalAction>
      </AtModal>
      <View className="schedule__calender">
        <AtCalendar marks={markList} onDayClick={handleDayClick} />
      </View>
      <View className="schedule__wrap">
        {currentDayTaskList.length !== 0 ?
          currentDayTaskList.map((task: TaskInfo, index: number) => {
            const { content, time } = task
            return (
              <View className="schedule__item" key={index}>
                <Image className="icon" src="http://cdn.algbb.cn/schedule/task.png" />
                <View className="content">{content}</View>
                <View className="time">{time}</View>
              </View>
            )
          }) :
          <View className="schedule__item--empty">暂无日程安排</View>
        }
        <View className="schedule__publish" onClick={handleAddClick}>ADD EVENT</View>
      </View>
    </View>
  )
})

export default MySchedule