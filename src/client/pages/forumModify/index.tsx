import React, { useEffect, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Form, Textarea, Button, Input } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import './index.scss'

const ForumModify: React.FC = observer(() => {
  const [forumTitle, setForumTitle] = useState<string>('')
  const [forumContent, setForumContent] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      Taro.setNavigationBarTitle({ title: '修改帖子' })
      const { forumId } = router.params
      const { data: { forumTitle, forumContent } } = await Taro.request({
        url: `http://localhost:3000/forums/${forumId}`,
        method: 'GET'
      })
      setForumTitle(forumTitle)
      setForumContent(forumContent)
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: any) => {
    const { forumId } = router.params
    const { detail: { value } } = e
    const { forumTitle, forumContent } = value
    const { infoStore: { userInfo }, forumStore: { getForumList } } = useStore()
    const { nickName } = userInfo

    const { data } = await Taro.request({
      url: `http://localhost:3000/forums/${forumId}`,
      method: 'PUT',
      data: {
        forumTitle,
        forumContent,
      }
    })

    Taro.showToast({
      title: data.msg,
    })

    getForumList(nickName)

    Taro.navigateBack({ delta: 1 })
  }

  return (
    <View className="forum-publish__container">
      <Form onSubmit={handleSubmit} >
        <View className="title__wrap">
          <View className="label">帖子标题:</View>
          <Input className="input" name="forumTitle" placeholder="请输入标题..." value={forumTitle} />
        </View>
        <View className="content__wrap">
          <View className="label">帖子内容:</View>
          <Textarea className="content" name="forumContent" value={forumContent} placeholder="请输入内容..." />
        </View>
        <Button className="submit" formType="submit">立 即 修 改</Button>
      </Form>
    </View>
  )
})

export default ForumModify