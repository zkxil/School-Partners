import React, { useEffect } from 'react'
import Taro, { } from '@tarojs/taro'
import { View, Form, Textarea, Button, Input } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import './index.scss'



const ForumPublish: React.FC = observer(() => {
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: '发布帖子' })
  }, [])

  const handleSubmit = async (e: any) => {
    const { detail: { value } } = e
    const { infoStore: { userInfo }, forumStore: { getForumList } } = useStore()
    const { forumTitle, forumContent } = value
    const { nickName, avatarUrl } = userInfo

    const { data } = await Taro.request({
      url: 'http://localhost:3000/forums',
      method: 'PUT',
      data: {
        forumTitle,
        forumContent,
        forumAuthor: nickName,
        forumAvatar: avatarUrl
      }
    })

    Taro.showToast({
      title: data.msg,
    })

    getForumList()
    getForumList(nickName)
    Taro.navigateBack({ delta: 1 })
  }

  return (
    <View className="forum-publish__container">
      <Form onSubmit={handleSubmit} >
        <View className="title__wrap">
          <View className="label">帖子标题:</View>
          <Input className="input" name="forumTitle" placeholder="请输入标题..." />
        </View>
        <View className="content__wrap">
          <View className="label">帖子内容:</View>
          <Textarea className="content" name="forumContent" value="" placeholder="请输入内容..." />
        </View>
        <Button className="submit" formType="submit">立 即 发 送</Button>
      </Form>
    </View>
  )
})

export default ForumPublish