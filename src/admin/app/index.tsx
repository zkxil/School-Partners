import React from 'react'
import {
  HashRouter as Router,
} from 'react-router-dom'
import { ConfigProvider } from 'antd'

import zhCN from 'antd/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn'); // 全局设置中文

import Routes from '../routes'

import store, { StoreContext } from '@/admin/store'

const App = () => (
  <div>
    <ConfigProvider locale={zhCN}>
      <Router>
        <StoreContext.Provider value={store}>
          <Routes />
        </StoreContext.Provider>
      </Router>
    </ConfigProvider>
  </div>
)

export default App
