import { makeAutoObservable } from 'mobx';
import http from '@/admin/utils/http'


class UserInfoStore {
  username = ''
  isActived = false
  constructor() {
    // 关键：自动绑定 this 并处理响应式
    makeAutoObservable(this, {}, { autoBind: true });
  }
  async setUserInfo() {
    const { data: { username, isActived } } = await http.get('/info')
      this.username = username
      this.isActived = isActived
  }

  setIsActived(isActived: boolean) {
    this.isActived = isActived
  }
}

export default UserInfoStore;
