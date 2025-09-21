import { createContext } from 'react'
import UserInfoStore from '@/admin/store'

const storeContext = createContext({
  userInfoStore: new UserInfoStore()
})
export default storeContext;