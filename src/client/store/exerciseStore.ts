import { makeAutoObservable } from 'mobx'; // 推荐使用现代 API
import Taro from '@tarojs/taro'
import { TopicList } from '../modals/exerciseDetail'

const themeList: Array<{ theme: string, title: string, icon: string }> = [
  {
    theme: 'light',
    title: '日间模式',
    icon: 'icon-light'
  }, {
    theme: 'dark',
    title: '夜间模式',
    icon: 'icon-dark'
  }, {
    theme: 'care',
    title: '护眼模式',
    icon: 'icon-care'
  }
];

class exerciseStore {
  fontSize: string = 'normal';
  fontSizeId: number = 2;
  settingOpened: boolean = false;
  theme: string = 'light';
  themeList: Array<{ theme: string, title: string, icon: string }> = themeList

  emptyPage: number = 0;
  isFinished: boolean = false
  isSubmitted: boolean = false
  currentPage: number = 0;
  totalPage: number = 0;
  exerciseCid: string = '';
  topicList: TopicList[] = [];
  // 题目的标准答案
  exerciseAnswers: Array<Array<number>> = [];
  // 用户选择的答案
  optionStatus: Array<Array<number>> = []
  // 用户做对的题数
  correctCount: number = 0
  exerciseId: number = 0
  constructor() {
    // 关键：自动绑定 this 并处理响应式
    makeAutoObservable(this, {}, { autoBind: true });
  }

  resetExerciseDetail(): void {
    this.topicList = []
    this.exerciseAnswers = []
    this.optionStatus = []
    this.exerciseAnswers = []
    this.currentPage = 0
    this.totalPage = 0
    this.emptyPage = 0
    this.isFinished = false
    this.isSubmitted = false
  }


  getExerciseDetail(cid: number): any {
    this.exerciseId = cid

    return new Promise(async (resolve) => {
      await Taro.navigateTo({
        url: '/pages/exerciseDetail/index'
      })
      Taro.showLoading({
        title: '加载中...'
      })
      const { data: { data } } = await Taro.request({
        url: `http://localhost:3000/exercises/${cid}`,
        method: 'GET',
      })
      const { exerciseName, topicList } = data
      Taro.setNavigationBarTitle({ title: exerciseName })
      const answerList = Array.from({ length: topicList.length }, (_, index) => Array.from({ length: topicList[index].topicOptions.length }, __ => 0))
      this.topicList = topicList
      this.optionStatus = answerList
      this.exerciseAnswers = [...answerList]
      this.totalPage = topicList.length
      Taro.hideLoading()
      resolve()
    })
  }


  setFontSize(sizeId: number = 2): void {
    if (sizeId > 4 || sizeId < 0) return;
    this.fontSizeId = sizeId;
    this.fontSize = ['smaller', 'small', 'normal', 'large', 'larger'][sizeId]
  }


  setTheme(theme: string = 'light'): void {
    this.theme = theme;
  }


  setSettingOpened(): void {
    this.settingOpened = !this.settingOpened
  }


  setCurrentPage(current: number = 0): void {
    this.currentPage = current;
  }


  handleOptionClick(number: number, index: number): void {
    if (this.isSubmitted) return
    if (this.topicList[number].topicType === 1) {
      this.optionStatus[number].fill(0)
    }
    this.optionStatus[number][index] = this.optionStatus[number][index] === 1 ? 0 : 1
    this.emptyPage = this.optionStatus.findIndex((answer) => answer.every(option => option === 0));
    this.isFinished = this.emptyPage === -1

  }


  handleConfirmClick(): void {
    if (this.isSubmitted) return
    if (!this.isFinished) {
      this.currentPage = this.emptyPage
    }
    else {
      /* 处理答案 */
      this.isSubmitted = true

      this.optionStatus.forEach((eachTopic, topicIndex) => {
        const { topicAnswer = [], topicOptions } = this.topicList[topicIndex]

        /* 记录做对题目id */
        const correctAnswer: number[] = topicAnswer.slice()

        eachTopic.forEach((option, optionIndex) => {
          const { id: currentId = 0 } = topicOptions[optionIndex]

          if (option === 1 && !topicAnswer.includes(currentId)) {
            /* 选中，但是选错了 */
            this.optionStatus[topicIndex][optionIndex] = -2
          } else if (option === 0 && topicAnswer.includes(currentId) && topicAnswer.length > 1) {
            /* 没选，但是是正确答案，并且是单选题模式 */
            this.optionStatus[topicIndex][optionIndex] = -1
          } else if (option === 0 && topicAnswer.includes(currentId) && topicAnswer.length === 1) {
            /* 没选，但是是正确答案，并且是多选题模式 */
            this.optionStatus[topicIndex][optionIndex] = 2
          } else if (option === 1 && topicAnswer.includes(currentId)) {
            /* 选了，选对了 */
            this.optionStatus[topicIndex][optionIndex] = 2

            correctAnswer.splice(correctAnswer.indexOf(currentId), 1)
          }
        })

        /* 所有选项都选中了，不多不少，则判断作对一题 */
        if (correctAnswer.length === 0) {
          this.correctCount += 1
        }
      })

      const openid = Taro.getStorageSync('openid')
      const score: number = parseFloat((this.correctCount / this.totalPage).toFixed(4)) * 100

      Taro.request({
        url: 'http://localhost:3000/exercises/score',
        method: 'PUT',
        data: {
          exerciseId: this.exerciseId,
          openid,
          score
        }
      })

      Taro.showToast({
        title: `最终得分: ${score}`,
        icon: 'none'
      })

      // 清空做题状态
      this.currentPage = 0
      this.correctCount = 0
    }
  }
}

export default exerciseStore