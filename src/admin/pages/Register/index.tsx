import React, { useState, useCallback } from 'react'
import { Form, Input, message } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { useService } from '@/admin/hooks'
import { FetchConfig } from '@/admin/modals/http'

import './index.scss'

const Register: React.FC = () => {
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [fetchConfig, setFetchConfig] = useState<FetchConfig>({
    url: '', method: 'GET', params: {}, config: {}
  })
  const { response = {} } = useService(fetchConfig)
  const { code = 0, data = {} } = response || {}

  const [form] = Form.useForm()
  const navigate = useNavigate()

  /* 注册成功 */
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
    const { username, password, phone, email } = values
    const registerConfig: FetchConfig = {
      url: '/register',
      method: 'POST',
      params: { username, password, phone, email },
      config: {}
    }
    setFetchConfig({ ...registerConfig })
  }

  return (
    <div className="register__container">
      <div className="register__mask" hidden={!isModalOpened} onClick={handleMaskClick} >
        <div className="register__mask__container">
          <div className="tips">登录二维码</div>
          <img src={require('../../assets/img/login.png')} />
        </div>
      </div>
      <div className="register__wrap">
        <div className="register__wrap--left" />
        <div className="register__wrap--right">
          <div className="form__decoration">
            <div className="logo">S</div>
          </div>
          <div className="form__container">
            <div className="form__title">欢迎注册<br />School-Partners</div>
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
                  placeholder="用户名"
                  prefix={<i className="form__icon iconfont icon-yonghu" />}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
              >
                <Input.Password
                  placeholder="密码"
                  prefix={<i className="form__icon iconfont icon-mima" />}
                  onPressEnter={() => form.submit()}
                />
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: '请输入手机号!' }]}
              >
                <Input
                  placeholder="手机号"
                  prefix={<i className="form__icon iconfont icon-shouji" />}
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[{ required: true, message: '请输入邮箱!' }]}
              >
                <Input
                  placeholder="邮箱"
                  prefix={<i className="form__icon iconfont icon-youxiang" />}
                />
              </Form.Item>
              <button className="form__button" type="submit">立即注册</button>
            </Form>
            <div className="form__footer">
              <Link to="/login">立即登录</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
