import { makeAutoObservable } from 'mobx';
import Taro from '@tarojs/taro'

interface UserInfo {
  avatarUrl: string,
  city: string,
  country: string,
  gender: number,
  language: string,
  nickName: string,
  province: string,
}

class infoStore {
  openid: string = ''
  userInfo: UserInfo = {
    avatarUrl: '',
    city: '',
    country: '',
    gender: -1,
    language: '',
    nickName: '',
    province: '',
  }
  isLogin: boolean = false

  constructor() {
    // 关键：自动绑定 this 并处理响应式
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async handleUserLogin(): Promise<void> {
    try {
      const { code } = await Taro.login()
      console.log(code)
      const { userInfo } = await Taro.getUserInfo()
      console.log(userInfo)
      const { nickName, avatarUrl } = userInfo
      const { data } = await Taro.request({
        url: `http://localhost:3000/login/`,
        method: 'POST',
        data: {
          code,
          nickName,
          avatarUrl
        }
      })
      const { openid = '' } = data
      console.log('login suc')
      Taro.setStorageSync('openid', openid)
      this.openid = openid
      this.userInfo = {
        ...userInfo,
        gender: userInfo.gender ?? -1
      }
    } catch (e) {
      console.log(e)
      if (e.errMsg === 'getUserInfo:fail scope unauthorized') {
        Taro.redirectTo({
          url: '/pages/login/index'
        })
        return
      }
      // Taro.showToast({
      //   title: '信息加载失败，请重试...',
      //   icon: "none"
      // })
      setTimeout(() => {
        this.handleUserLogin()

      }, 1000)
      // Taro.redirectTo({
      //   url: '/pages/index/index'
      // })
    }
  }

  setUserInfo(userInfo: UserInfo): any {
    this.userInfo = userInfo
  }

  setIsLogin(isLogin: boolean): any {
    this.isLogin = isLogin
  }

  // @action.bound
  // getUserInfo(): any {
  //   return new Promise(async (resolve) => {
  //     const { userInfo } = await Taro.getUserInfo({
  //       withCredentials: true
  //     })
  //     this.userInfo = userInfo
  //     resolve()
  //   })
  // }
}

export default infoStore