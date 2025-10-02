import { makeAutoObservable } from 'mobx';
import Taro from '@tarojs/taro'

import { CourseInfo } from '../modals/courseDetail'

class CourseStore {
  courseDetail: CourseInfo = {
    courseAuthor: '',
    publishDate: '',
    courseViews: 0,
    courseDescription: '',
    courseSteps: [],
    courseRate: 0
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  async getCourseDetail(id: number, title: string): Promise<void> {
    try {
      Taro.showLoading({ title: '加载中...' })

      const { data } = await Taro.request<CourseInfo>({
        url: `http://localhost:3000/courses/${id}`,
        method: 'GET',
      })

      this.courseDetail = data

      await Taro.navigateTo({
        url: `/pages/courseDetail/index`
      })

      Taro.setNavigationBarTitle({ title })
    } catch (error) {
      console.error('获取课程详情失败:', error)
      Taro.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    } finally {
      Taro.hideLoading()
    }
  }
}

export default CourseStore
