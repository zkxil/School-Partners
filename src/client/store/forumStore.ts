import { makeAutoObservable } from 'mobx';
import Taro from '@tarojs/taro'

import { ForumInfo } from '../modals/forumList'

class ForumStore {
  myForumList: Array<ForumInfo> = []
  forumList: Array<ForumInfo> = []


  constructor() {
    // 关键：自动绑定 this 并处理响应式
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async getForumList(forumAuthor?: string): Promise<void> {
    if (forumAuthor) {
      const { data } = await Taro.request({
        url: `http://localhost:3000/forums/`,
        method: 'POST',
        data: {
          forumAuthor
        }
      })
      this.myForumList = data.code === 404 ? [] : data
    } else {
      const { data } = await Taro.request({
        url: `http://localhost:3000/forums/`,
        method: 'GET',
      })
      this.forumList = data
    }
  }
}

export default ForumStore