import React from 'react'
import { View, Video } from '@tarojs/components'

import './index.scss'

const CourseVideo: React.FC = () => {
  return (
    <View>
      <Video
        className="video"
        src="http://cdn.algbb.cn/test.mp4"
        controls
        autoplay={false}
        poster="http://cdn.algbb.cn/cover.png"
        id="video"
        loop={false}
        muted={false}
      />
    </View>
  )
}

// 配置导航栏标题
CourseVideo.config = {
  navigationBarTitleText: '课程视频',
}

export default CourseVideo
