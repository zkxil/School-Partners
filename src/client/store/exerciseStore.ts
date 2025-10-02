import { makeAutoObservable } from 'mobx';
import Taro from '@tarojs/taro';
import { TopicList } from '../modals/exerciseDetail';

const themeList: Array<{ theme: string; title: string; icon: string }> = [
  { theme: 'light', title: '日间模式', icon: 'icon-light' },
  { theme: 'dark', title: '夜间模式', icon: 'icon-dark' },
  { theme: 'care', title: '护眼模式', icon: 'icon-care' },
];

class ExerciseStore {
  fontSize: string = 'normal';
  fontSizeId: number = 2;
  settingOpened: boolean = false;
  theme: string = 'light';
  themeList: typeof themeList = themeList;

  emptyPage: number = 0;
  isFinished: boolean = false;
  isSubmitted: boolean = false;
  currentPage: number = 0;
  totalPage: number = 0;
  exerciseCid: string = '';
  topicList: TopicList[] = [];
  exerciseAnswers: number[][] = [];
  optionStatus: number[][] = [];
  correctCount: number = 0;
  exerciseId: number = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  resetExerciseDetail() {
    this.topicList = [];
    this.exerciseAnswers = [];
    this.optionStatus = [];
    this.currentPage = 0;
    this.totalPage = 0;
    this.emptyPage = 0;
    this.isFinished = false;
    this.isSubmitted = false;
    this.correctCount = 0;
  }

  async getExerciseDetail(cid: number) {
    this.exerciseId = cid;
    try {
      await Taro.navigateTo({ url: '/pages/exerciseDetail/index' });
      Taro.showLoading({ title: '加载中...' });

      const res = await Taro.request<{ data: { exerciseName: string; topicList: TopicList[] } }>({
        url: `http://localhost:3000/exercises/${cid}`,
        method: 'GET',
      });

      const { exerciseName, topicList } = res.data.data;

      Taro.setNavigationBarTitle({ title: exerciseName });

      const answerList = topicList.map(topic =>
        Array.from({ length: topic.topicOptions.length }, () => 0)
      );

      this.topicList = topicList;
      this.optionStatus = answerList;
      this.exerciseAnswers = answerList.map(arr => [...arr]);
      this.totalPage = topicList.length;
    } catch (error) {
      console.error('获取练习题失败:', error);
      Taro.showToast({ title: '加载失败，请重试', icon: 'none' });
    } finally {
      Taro.hideLoading();
    }
  }

  setFontSize(sizeId: number = 2) {
    if (sizeId < 0 || sizeId > 4) return;
    this.fontSizeId = sizeId;
    this.fontSize = ['smaller', 'small', 'normal', 'large', 'larger'][sizeId];
  }


  setTheme(theme: string = 'light') {
    this.theme = theme;
  }

  toggleSettingOpened() {
    this.settingOpened = !this.settingOpened;
  }

  setCurrentPage(current: number = 0) {
    this.currentPage = current;
  }

  handleOptionClick(topicIndex: number, optionIndex: number) {
    if (this.isSubmitted) return;

    const topic = this.topicList[topicIndex];
    if (topic.topicType === 1) this.optionStatus[topicIndex].fill(0);

    this.optionStatus[topicIndex][optionIndex] =
      this.optionStatus[topicIndex][optionIndex] === 1 ? 0 : 1;

    this.emptyPage = this.optionStatus.findIndex(ans => ans.every(option => option === 0));
    this.isFinished = this.emptyPage === -1;
  }

  async handleConfirmClick() {
    if (this.isSubmitted) return;

    if (!this.isFinished) {
      this.currentPage = this.emptyPage;
      return;
    }

    this.isSubmitted = true;

    this.optionStatus.forEach((eachTopic, topicIndex) => {
      const { topicAnswer = [], topicOptions } = this.topicList[topicIndex];
      const correctAnswer = [...topicAnswer];

      eachTopic.forEach((option, optionIndex) => {
        const { id: currentId = 0 } = topicOptions[optionIndex];

        if (option === 1 && !topicAnswer.includes(currentId)) this.optionStatus[topicIndex][optionIndex] = -2;
        else if (option === 0 && topicAnswer.includes(currentId) && topicAnswer.length > 1) this.optionStatus[topicIndex][optionIndex] = -1;
        else if (option === 0 && topicAnswer.includes(currentId) && topicAnswer.length === 1) this.optionStatus[topicIndex][optionIndex] = 2;
        else if (option === 1 && topicAnswer.includes(currentId)) {
          this.optionStatus[topicIndex][optionIndex] = 2;
          correctAnswer.splice(correctAnswer.indexOf(currentId), 1);
        }
      });

      if (correctAnswer.length === 0) this.correctCount += 1;
    });

    const openid = Taro.getStorageSync('openid');
    const score = parseFloat((this.correctCount / this.totalPage).toFixed(4)) * 100;

    try {
      await Taro.request({
        url: 'http://localhost:3000/exercises/score',
        method: 'PUT',
        data: { exerciseId: this.exerciseId, openid, score },
      });
    } catch (error) {
      console.error('提交成绩失败:', error);
    }

    Taro.showToast({ title: `最终得分: ${score}`, icon: 'none' });

    this.currentPage = 0;
    this.correctCount = 0;
  }
}

export default ExerciseStore; 
