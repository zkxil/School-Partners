import UserInfoStore from './UserInfoStore'
import React from 'react'

// 先实例化
const userInfoStore = new UserInfoStore()

// 把所有 store 放在一个对象里
const store = {
    userInfoStore,
}

export default store

// 如果要用 mobx-react-lite 的 Context 写法：

export const StoreContext = React.createContext(store)
export const useStore = () => React.useContext(StoreContext)