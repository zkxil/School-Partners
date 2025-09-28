import React, { FC, useEffect, Suspense, lazy } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 加载中的页面
const LoadingPage: FC = () => {
  useEffect(() => {
    NProgress.start()
    return () => {
      NProgress.done()
    }
  }, [])

  return <div className="load-component" />
}

// 封装动态加载组件
const LoadableComponent = (importFunc: () => Promise<{ default: React.ComponentType<any> }>) => {
  const LazyComponent = lazy(importFunc)

  const Wrapper: FC = (props) => (
    <Suspense fallback={<LoadingPage />}>
      <LazyComponent {...props} />
    </Suspense>
  )

  return Wrapper
}

export default LoadableComponent
