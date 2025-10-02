import { createContext } from 'react'
import store from '@/admin/store'

const storeContext = createContext({
  userInfoStore: store.userInfoStore,
})
export default storeContext;