import React, { useEffect } from 'react'
import Taro, { } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import './index.scss'



const ForumList: React.FC = observer(() => {
  const { forumStore: { getForumList } } = useStore()
  useEffect(() => {
    getForumList()
  }, [])

  const navigateTo = (forumId: number, forumTitle: string): void => {
    Taro.navigateTo({
      url: `/pages/forumDetail/index?forumId=${forumId}&forumTitle=${forumTitle}`
    })
  }

  const { forumStore: { forumList } } = useStore()

  return (
    <View className="forum__container">
      <View className="forum__publish">
        <View className="forum__publish--background"></View>
        <Image className="icon" src="http://cdn.algbb.cn/forum/add.png" mode="aspectFill" onClick={() => { Taro.navigateTo({ url: '/pages/forumPublish/index' }) }} />
      </View>
      {forumList.map(forum => {
        const { forumId, forumAvatar, forumAuthor, timeAgo, forumImage, forumTitle, forumContent, forumLike, forumComment } = forum
        return (
          <View className="forum__wrap" key={forumId}>
            <View className="header">
              <Image className="avatar" src={forumAvatar} mode="aspectFill" />
              <View className="author">
                {forumAuthor}
                <View className="time">{timeAgo === 0 ? 'today' : `${timeAgo} days ago`}</View>
              </View>
              <View className="iconfont icon-more more" />
            </View>
            <Image className="image" src={forumImage} mode="aspectFill" onClick={() => { navigateTo(forumId, forumTitle) }} />
            <View className="content__wrap" onClick={() => { navigateTo(forumId, forumTitle) }}>
              <View className="title">
                {forumTitle}
              </View>
              <View className="content">
                {forumContent}
              </View>
            </View>
            <View className="status">
              <View className="iconfont icon-like" />
              {forumLike}
              <View className="iconfont icon-comment" />
              {forumComment}
            </View>
          </View>
        )
      })}
    </View>
  )
})

export default ForumList