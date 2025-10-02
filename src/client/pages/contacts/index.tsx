import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'
import { ContactsInfo } from '../../modals/chatroom'

import './index.scss'


const Contacts: React.FC = observer(() => {
  useEffect(() => {
    // componentDidMount logic here if needed
  }, [])

  const handleGroupClick = (contactsId: string, title: string) => {
    Taro.navigateTo({
      url: `/pages/chatroom/index?to=${contactsId}&title=${title}`
    })
  }

  const { chatroomStore: { contactsList } } = useStore()

  return (
    <View className='contacts-container'>
      {contactsList.map((contactsInfo: ContactsInfo, index: number) => {
        const { title, avatar, contactsId, latestMessage } = contactsInfo
        const { userName, currentTime, message } = latestMessage
        return (
          <View className='contacts-wrap' key={index} onClick={() => handleGroupClick(contactsId, title)}>
            <Image className='avatar' src={avatar} />
            <View className='info'>
              <View className='header'>
                <View className='title'>{title}</View>
                <View className='time'>{currentTime}</View>
              </View>
              <View className='content'>{userName}: {message}</View>
            </View>
          </View>
        )
      })}
    </View>
  )
})

export default Contacts
