import React, { useEffect, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Image, Input } from "@tarojs/components";
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import { ForumInfo } from '../../modals/forumList'

import './index.scss'

const ForumDetail: React.FC = observer(() => {
  // 初始化论坛详情状态
  const [forumDetail, setForumDetail] = useState<ForumInfo>({
    forumId: 0,
    forumAvatar: '',
    forumAuthor: '',
    publishTime: '',
    timeAgo: 0,
    forumImage: '',
    forumTitle: '',
    forumContent: '',
    forumLike: 0,
    forumComment: 0
  })
  
  const router = useRouter()
  const store = useStore() // 获取store实例

  useEffect(() => {
    // 组件加载时获取论坛详情数据
    const fetchForumDetail = async () => {
      const { forumId, forumTitle } = router.params
      Taro.setNavigationBarTitle({ title: forumTitle || '论坛详情' })
      const { data } = await Taro.request({ url: `http://localhost:3000/forums/${forumId}` })
      setForumDetail(data)
    }
    fetchForumDetail()
  }, [])

  const { forumAvatar, forumAuthor, publishTime, forumImage, forumTitle, forumContent, forumLike, forumComment } = forumDetail
  
  return (
    <View className="forum-detail__container">
      <View className="forum-detail__header">
        <Image className="avatar" src={forumAvatar} mode="aspectFill" />
        <View className="author">
          {forumAuthor}
        </View>
        <View className="iconfont icon-star star" />
      </View>
      <Image className="forum-detail__image" src={forumImage} />
      <View className="forum-detail__wrap">
        <View className="title">
          {forumTitle}
          <View className="time">{publishTime}</View>
        </View>
        <View className="time"></View>
        <View className="content">
          {forumContent}{forumContent}
        </View>
      </View>
      <View className="forum-detail__footer">
        <View className="iconfont icon-like" />
        {forumLike}
        <View className="iconfont icon-comment" />
        {forumComment}
        <Input className="input" type='text' placeholder='请输入你的评论...' confirmType="send" />
      </View>
    </View>
  )
})

export default ForumDetail