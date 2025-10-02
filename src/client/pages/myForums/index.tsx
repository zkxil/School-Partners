import React, { useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import Empty from '../../components/Forum/Empty'

import './index.scss'

const MyForums: React.FC = observer(() => {
  const router = useRouter()

  useEffect(() => {
    const { title } = router.params
    const { infoStore: { userInfo }, forumStore: { getForumList } } = useStore()
    const { nickName } = userInfo
    Taro.setNavigationBarTitle({ title: title || '我的帖子' })
    getForumList(nickName)
  }, [])

  const handleDeleteClick = async (forumId: number) => {
    const { infoStore: { userInfo }, forumStore: { getForumList } } = useStore()
    const { nickName } = userInfo
    await Taro.request({
      url: `http://localhost:3000/forums/${forumId}`,
      method: 'DELETE'
    })
    Taro.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 1000
    })
    getForumList(nickName)
  }

  const handleModifyClick = (forumId: number): void => {
    Taro.navigateTo({
      url: `/pages/forumModify/index?forumId=${forumId}`
    })
  }

  const { forumStore: { myForumList } } = useStore()
  return (
    <View className="myforum-list__container">
      {myForumList.slice().length === 0 ? <Empty /> : myForumList.slice().map(forum => {
        const { forumImage, forumTitle, forumContent, forumLike, forumComment, forumId, publishTime } = forum
        return (
          <View className="myforum-list__wrap" key={forumId}>
            <View className="wrap__content">
              <Image className="image" src={forumImage} mode="aspectFill" />
              <View className="info">
                <View className="title">{forumTitle}</View>
                <View className="content">{forumContent}</View>
                <View className="status">
                  <View className="iconfont icon-like" />{forumLike}
                  <View className="iconfont icon-comment" />{forumComment}
                </View>
              </View>
            </View>
            <View className="wrap__footer">
              <View className="time">{publishTime}</View>
              <View className="action" onClick={() => { handleModifyClick(forumId) }}>修改</View>
              <View className="action action--delete" onClick={() => { handleDeleteClick(forumId) }}>删除</View>
            </View>
          </View>
        )
      })}
    </View>
  )
})

export default MyForums