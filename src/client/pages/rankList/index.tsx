import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'

import './index.scss'

// 排行榜项目类型定义
type IRankItem = {
  count: number,
  total: number,
  studentId: number,
  studentName: string,
  studentAvatar: string,
  nickName: string,
  correctRate: string
}

const RankList: React.FC = observer(() => {
  // 初始化排行榜数据状态
  const [rankList, setRankList] = useState<IRankItem[]>([])
  const store = useStore() // 获取store实例

  useEffect(() => {
    // 组件加载时获取排行榜数据
    const fetchRankList = async () => {
      Taro.setNavigationBarTitle({ title: '排行榜' })
      
      const { data } = await Taro.request({
        url: 'http://localhost:3000/exercises-rank'
      })
      const { rankList = [] } = data
      setRankList(rankList)
    }
    
    fetchRankList()
  }, [])

  // 注释的测试数据，保留原有注释
  // const rankList = [
  //   { avatar: 'http://cdn.algbb.cn/emoji/32.png', name: 'Tom Mark', score: 13122 },
  //   { avatar: 'http://cdn.algbb.cn/emoji/31.png', name: 'Bruce Alex', score: 23124 },
  //   { avatar: 'http://cdn.algbb.cn/emoji/30.png', name: 'Chirs Ford', score: 45631 },
  //   { avatar: 'http://cdn.algbb.cn/emoji/29.png', name: 'Ben Dick', score: 16341 },
  //   { avatar: 'http://cdn.algbb.cn/emoji/28.png', name: 'Martin Hugo', score: 23145 },
  //   { avatar: 'http://cdn.algbb.cn/emoji/27.png', name: 'Lee Oliver', score: 34123 },
  //   { avatar: 'http://cdn.algbb.cn/emoji/26.png', name: 'Mark Rex', score: 56142 }
  // ]

  return (
    <View className="rank-list__container">
      <View className="rank-list__background" />
      {/* 冠军展示区域 */}
      {rankList.length > 0 && (
        <View className="rank-list__wrap--champion">
          <Image className="decoration" src="http://cdn.algbb.cn/rank/crown.png" />
          <Image className="avatar" src={rankList[0].studentAvatar} />
          <View>
            <View className="name">{rankList[0].nickName}</View>
            <View className="realname">
              <Text>({rankList[0].studentName})</Text>
              <View className="score">{rankList[0].count}</View>
            </View>
          </View>
        </View>
      )}

      {/* 注释的表头，保留原有注释 */}
      {/* <View className="rank-list__wrap rank-list__wrap--header">
        <View className="number"></View>
        <View className="score">做题数</View>
      </View> */}

      {/* 其他排名展示区域 */}
      {rankList.slice(1).map((rank, index) => {
        const { studentAvatar, nickName, studentName, count } = rank
        return (
          <View className="rank-list__wrap" key={index}>
            <View className="number">{index + 2}</View>
            <Image className="avatar" src={studentAvatar} />
            <View className="name">
              {nickName}
              <View className="realname">
                ({studentName})
              </View>
            </View>
            <View className="score">{count}</View>
          </View>
        )
      })}
    </View>
  )
})

export default RankList