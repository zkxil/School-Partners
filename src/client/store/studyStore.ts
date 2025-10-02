import { makeAutoObservable } from 'mobx';
import Taro from '@tarojs/taro'

import { CourseInfo } from '../modals/courseList'
import { ExerciseInfo } from '../modals/exerciseList'

class StudyStore {
  courseList: Array<CourseInfo> = [];

  recommendCourseList: Array<CourseInfo> = [];

  exerciseList: Array<ExerciseInfo>

  hotExerciseList: Array<ExerciseInfo>
  constructor() {
    // 关键：自动绑定 this 并处理响应式
    makeAutoObservable(this, {}, { autoBind: true });
  }

  isRecommend(course: CourseInfo): boolean {
    return course.isRecommend
  }

  isHot(course: ExerciseInfo): boolean {
    return course.isHot
  }


  async getCourseList(): Promise<void> {
    const { data } = await Taro.request({
      url: 'http://localhost:3000/courses',
      method: 'GET',
    })
    this.courseList = data;
    this.recommendCourseList = data.filter(this.isRecommend)
  }

  async getExerciseList(): Promise<void> {
    const { data } = await Taro.request({
      url: 'http://localhost:3000/exercises',
      method: 'GET',
    })
    this.exerciseList = data;
    this.hotExerciseList = data.filter(this.isHot)
  }
}

export default StudyStore