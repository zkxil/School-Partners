import axios from 'axios'
import { message } from 'antd'

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': "application/json;charset=utf-8" },
})

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config
  },
  error => Promise.reject(error)
)

instance.interceptors.response.use(
  res => res, // 返回完整响应
  error => {
    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        case 401:
          localStorage.removeItem('token')
          window.location.href = './#/login'
          break
        case 504:
          message.error('代理请求失败')
          break
        default:
          message.error(data?.msg || '请求出错')
      }
    }
    return Promise.reject(error)
  }
)

const get = (url: string, options?: object) =>
  instance.get(url, options).then(res => res.data)

const post = (url: string, params: object, options?: object) =>
  instance.post(url, params, options).then(res => res.data)

const put = (url: string, params: object, options?: object) =>
  instance.put(url, params, options).then(res => res.data)

const del = (url: string, options?: object) =>
  instance.delete(url, options).then(res => res.data)

export default { get, post, put, delete: del }
