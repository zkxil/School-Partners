import { makeAutoObservable } from 'mobx';
import Taro from '@tarojs/taro'

import { CourseInfo } from '../modals/courseList'
import { ExerciseInfo } from '../modals/exerciseList'

class studyStore {
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


  getCourseList(): any {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await Taro.request({
          url: 'http://localhost:3000/courses',
          method: 'GET',
        })
        this.courseList = data;
        this.recommendCourseList = data.filter(this.isRecommend)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  getExerciseList(): any {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await Taro.request({
          url: 'http://localhost:3000/exercises',
          method: 'GET',
        })
        this.exerciseList = data;
        this.hotExerciseList = data.filter(this.isHot)
        resolve()
      } catch (e) {
        reject(e)
      }

    })
  }
}

export default studyStore