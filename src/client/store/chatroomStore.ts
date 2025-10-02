import { makeAutoObservable } from 'mobx';
import Taro from '@tarojs/taro'
import formatTime from '../utils/formatTime'

import { SendMessageInfo, ReceiveMessageInfo, LoginInfo, MessageList, ContactsInfo } from '../modals/chatroom'

class ChatroomStore {
  /* socket部分 */
  reConnectTimer: any = null
  heartCheckTimer: any = null
  timeoutTimer: any = null
  reConnectCount: number = 3

  openid: string = ''
  socketTask: any = null
  socketId: string = ''
  userName: string = ''
  userAvatar: string = ''
  isReconnected: boolean = false

  /* 消息部分 */
  messageList: MessageList = {}
  scrollViewId: string = ''

  /* 联系人部分 */
  contactsList: ContactsInfo[] = []

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  async handleUserLogin(): Promise<void> {
    try {
      const { code } = await Taro.login()
      const { userInfo } = await Taro.getUserProfile({
        desc: '用于完善会员资料'
      })

      const { nickName, avatarUrl } = userInfo
      const { data } = await Taro.request({
        url: `http://localhost:3000/login/`,
        method: 'POST',
        data: { code, nickName, avatarUrl }
      })

      const { openid = '' } = data
      Taro.setStorageSync('openid', openid)

      this.openid = openid
      this.userInfo = {
        ...userInfo,
        gender: userInfo.gender ?? -1
      }
      this.isLogin = true

    } catch (e: any) {
      console.error('登录失败:', e)

      if (e.errMsg?.includes('unauthorized')) {
        Taro.redirectTo({ url: '/pages/login/index' })
      } else {
        Taro.showToast({ title: '登录失败，请重试', icon: 'none' })
      }
    }
  }

  setUserInfo(userInfo: UserInfo) {
    this.userInfo = userInfo
  }

  setIsLogin(isLogin: boolean) {
    this.isLogin = isLogin
  }
}

export default ChatroomStore
