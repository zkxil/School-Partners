import React, { useState, useCallback } from 'react'
import { Checkbox, Form, Input, message } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { useService } from '@/admin/hooks'
import { FetchConfig } from '@/admin/modals/http'
import LinkIcon from '@/admin/components/LinkIcon'

import './index.scss'

const Login: React.FC = () => {
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [fetchConfig, setFetchConfig] = useState<FetchConfig>({
    url: '', method: 'GET', params: {}, config: {}
  })
  const { response = {} } = useService(fetchConfig)
  const { code = 0, data = {} } = response || {}

  const [form] = Form.useForm()
  const navigate = useNavigate()

  /* 登录成功 */
  if (code === 200) {
    const { msg, token } = data
    localStorage.setItem('token', token)
    message.success(msg)
    navigate('/admin')
  }

  const handleMaskClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsModalOpened(false)
    },
    []
  )

  const handleFormFinish = (values: any) => {
    const { username, password } = values
    const loginConfig: FetchConfig = {
      url: '/login',
      method: 'POST',
      params: { username, password },
      config: {}
    }
    setFetchConfig({ ...loginConfig })
  }

  return (
    <div className="login__container">
      <div className="login__mask" hidden={!isModalOpened} onClick={handleMaskClick} >
        <div className="login__mask__container">
          <div className="tips">登录二维码</div>
          <img src={require('../../assets/img/login.png')} />
        </div>
      </div>
      <div className="login__wrap">
        <div className="login__wrap--left" />
        <div className="login__wrap--right">
          <div className="form__decoration">
            <div className="logo">S</div>
          </div>
          <div className="form__container">
            <div className="form__title">School-Partners<br />题库后台管理中心</div>
            <Form
              form={form}
              onFinish={handleFormFinish}
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
              >
                <Input
                  className="form__input"
                  placeholder="用户名"
                  prefix={<i className="form__icon iconfont icon-yonghu" />}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
              >
                <Input.Password
                  className="form__input"
                  placeholder="密码"
                  prefix={<i className="form__icon iconfont icon-mima" />}
                  onPressEnter={() => form.submit()}
                />
              </Form.Item>
              <Form.Item
                name="isRemember"
                valuePropName="checked"
                initialValue={false}
              >
                <Checkbox className="form__remember">记住密码</Checkbox>
              </Form.Item>
              <button className="form__button" type="submit">立即登录</button>
            </Form>
            <div className="form__footer">
              <Link to="/register">立即注册</Link>
              <div className="form__link">
                其他登录方式
                <LinkIcon icon="wechat.png" onClick={() => setIsModalOpened(true)} />
                <LinkIcon icon="qq.png" onClick={() => setIsModalOpened(true)} />
                <LinkIcon icon="weibo.png" onClick={() => setIsModalOpened(true)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
