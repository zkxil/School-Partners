import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'

import { store, StoreProvider } from './store/index'

import './app.scss'
import 'taro-ui/dist/style/index.scss'

function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return (
    <StoreProvider value={store}>
      {children}
    </StoreProvider>
  )
}

export default App
