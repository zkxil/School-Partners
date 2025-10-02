import React, { useState, useEffect } from 'react'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { View, ScrollView, Input, Image } from '@tarojs/components'
import { AtActivityIndicator } from "taro-ui"
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import './index.scss'

const ChatRoom: React.FC = observer(() => {
  const [value, setValue] = useState('')
  const [scrollAnimation, setScrollAnimation] = useState(false)
  const [emojiOpened, setEmojiOpened] = useState(false)
  const router = useRouter()
  const { chatroomStore } = useStore()
  const { to, title } = router.params as { to?: string, title?: string }


  // 初始化
  useEffect(() => {
    if (to) {
      chatroomStore.setLatestScrollViewId(to)
    }
    Taro.setNavigationBarTitle({
      title: title || '聊天室'
    })
  }, [to, title])

  useDidShow(() => {
    setScrollAnimation(true)
  })

  const onMessageSend = () => {
    if (!value || !to) return
    chatroomStore.handleMessageSend({
      type: 'text',
      from: chatroomStore.socketId,
      to,
      message: value
    })
    setValue('')
  }

  const handleEmojiOpen = () => setEmojiOpened(!emojiOpened)

  const handleChange = (e: { detail: { value: string } }) => {
    setValue(e.detail.value)
  }

  const { messageList, scrollViewId, isReconnected, openid } = chatroomStore


  return (
    <View className='chat'>
      <View hidden={!isReconnected}>
        <AtActivityIndicator mode='center' content='重连中...' size={36}></AtActivityIndicator>
      </View>
      <ScrollView
        className={`chat-message-container ${emojiOpened ? 'emoji-open' : ''}`}
        scrollY
        scrollWithAnimation={scrollAnimation}
        scrollIntoView={scrollViewId}
      >
        {to && messageList[to] && messageList[to].map(messageInfo => {
          const { message, messageId, currentTime, userAvatar, isMyself } = messageInfo
          return (
            <View className={`message-wrap ${isMyself || messageInfo.openid === openid ? 'myself' : ''}`} id={messageId} key={messageId}>
              <Image className='avatar' src={userAvatar} />
              <View className='info'>
                <View className='header'>
                  <View className='username'>
                    {messageInfo.userName}
                  </View>
                  <View className='time'>
                    {currentTime}
                  </View>
                </View>
                <View className='content'>
                  {message}
                </View>
              </View>
            </View>
          )
        })}
      </ScrollView>
      <View className={`chat-input-container ${emojiOpened ? 'emoji-open' : ''}`}>
        <View className='chat-input-wrap'>
          <Image className='emoji' src='http://cdn.algbb.cn/chatroom/emoji.png' onClick={handleEmojiOpen} />
          <Input className='input' type='text' value={value} onInput={handleChange} placeholder='来吹吹水吧~' cursorSpacing={10} confirmType='send' />
          <View className='button' onClick={onMessageSend} >发送</View>
        </View>
        <ScrollView scrollY className='emoji-container'>
          {Array.from({ length: 33 }).map((_, index) => {
            let id = index + 1 + ''
            if (id.length === 1) id = '0' + id
            const imgSrc = `http://cdn.algbb.cn/emoji/${id}.png`
            return (
              <Image className='emoji' key={index} src={imgSrc} />
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
})

ChatRoom.config = {
  navigationBarTitleText: '聊天室',
}

export default ChatRoom
