import { makeAutoObservable } from 'mobx';
import Taro from '@tarojs/taro'

import { CourseInfo } from '../modals/courseDetail'

class courseStore {
  courseDetail: CourseInfo = {
    courseAuthor: '',
    publishDate: '',
    courseViews: 0,
    courseDescription: '',
    courseSteps: [],
    courseRate: 0
  }

  constructor() {
    // 关键：自动绑定 this 并处理响应式
    makeAutoObservable(this, {}, { autoBind: true });
  }

  getCourseDetail(id: number, title: string): any {
    return new Promise(async (resolve) => {
      Taro.showLoading({
        title: '加载中...'
      })
      const { data } = await Taro.request({
        url: `http://localhost:3000/courses/${id}`,
        method: 'GET',
      })
      this.courseDetail = data
      await Taro.navigateTo({
        url: `/pages/courseDetail/index`
      })
      Taro.setNavigationBarTitle({
        title
      })
      Taro.hideLoading()
      resolve()
    })
  }


}

export default courseStore