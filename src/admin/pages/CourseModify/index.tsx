import React, { FC, useState, Fragment, useEffect } from 'react'
import { CustomBreadcrumb } from '@/admin/components'
import {
  Form,
  Input,
  Col,
  Row,
  Switch,
  Divider,
  Button,
  Tooltip,
  message,
  Rate,
  Spin
} from 'antd';
import { LoadingOutlined, DeleteTwoTone } from '@ant-design/icons';
import {
  CourseNameRules,
  CourseDescriptionRules,
  CourseAuthorRules,
  CourseRateRules,
  StepTitleRules,
  StepContentRules
} from './formValidate'
import { CourseDetails } from '@/admin/modals/courseList'
import http from '@/admin/utils/http'
import { useNavigate, useParams } from 'react-router-dom' // React Router v6

import './index.scss'

interface StepList {
  title: string,
  content: string,
}

const CourseModify: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [courseName, setCourseName] = useState<string>('')
  const [stepList, setStepList] = useState<StepList[]>([{ title: '', content: '' }])
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    courseRate: 0,
    courseName: '',
    courseDescription: '',
    courseAuthor: '',
    isRecommend: false,
    isPublic: false
  })

  const [form] = Form.useForm()
  const navigate = useNavigate() // 替代 history
  const { id } = useParams<{ id: string }>() // 获取路由参数

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 15, offset: 1 }
  }

  // 初始化课程信息
  useEffect(() => {
    setCourseInfo()
  }, [])

  const setCourseInfo = async () => {
    try {
      const { data } = await http.get(`/courses/${id}`)
      const {
        courseName,
        courseDescription,
        courseAuthor,
        courseRate,
        isRecommend,
        isPublic,
        courseSteps
      } = data

      setCourseName(courseName)
      setStepList([...courseSteps])
      setCourseDetails({ courseName, courseDescription, courseAuthor, courseRate, isRecommend, isPublic })
      form.setFieldsValue({
        courseName,
        courseDescription,
        courseAuthor,
        courseRate,
        isRecommend,
        isPublic,
        stepList: courseSteps
      })
      setIsLoading(false)
    } catch (e) {
      /* 当通过url直接访问页面时候，若课程不存在则跳转回列表页面 */
      navigate('/admin/content/course-list')
    }
  }

  // 提交表单
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields()
      const { courseName, courseDescription, courseAuthor, courseRate, isRecommend, isPublic, stepList } = values
      const { data: { msg } } = await http.put(`/courses/${id}`, {
        courseName,
        courseDescription,
        courseAuthor,
        courseRate,
        isRecommend,
        isPublic,
        stepList
      })
      message.success(msg)
      navigate('/admin/content/course-list')
    } catch (err) {
      console.log('Validation Failed:', err)
    }
  }

  // 新增步骤
  const handleTopicAddClick = () => {
    const currentSteps = form.getFieldValue('stepList') || []
    const newSteps = [...currentSteps, { title: '', content: '' }]
    setStepList(newSteps)
    form.setFieldsValue({ stepList: newSteps })
  }

  // 删除步骤
  const handleTopicDeleteClick = (topicIndex: number) => {
    const currentSteps = form.getFieldValue('stepList') || []
    currentSteps.splice(topicIndex, 1)
    setStepList([...currentSteps])
    form.setFieldsValue({ stepList: currentSteps })
  }

  return (
    <div>
      <CustomBreadcrumb list={['内容管理', '课程管理', courseName]} />
      <div className="course-modify__container">
        <Spin
          spinning={isLoading}
          size="large"
          tip="加载中..."
          indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
        >
          <div className="form__title">课程信息</div>
          <Form form={form} layout="horizontal" {...formLayout} hideRequiredMark>
            <Form.Item label="课程名称" name="courseName" rules={CourseNameRules}>
              <Input />
            </Form.Item>
            <Form.Item label="课程简介" name="courseDescription" rules={CourseDescriptionRules}>
              <Input />
            </Form.Item>
            <Row>
              <Col span={12}>
                <Form.Item label="课程作者" name="courseAuthor" rules={CourseAuthorRules} labelCol={{ span: 8 }} wrapperCol={{ span: 10, offset: 2 }}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="课程评分" name="courseRate" rules={CourseRateRules} labelCol={{ span: 4 }} wrapperCol={{ span: 10, offset: 2 }}>
                  <Rate allowHalf />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="是否推荐" name="isRecommend" valuePropName="checked" labelCol={{ span: 8 }} wrapperCol={{ span: 10, offset: 2 }}>
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="是否公开" name="isPublic" valuePropName="checked" labelCol={{ span: 4 }} wrapperCol={{ span: 10, offset: 2 }}>
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Divider />
            <Form.Item label="课程步骤">
              {stepList.map((_, index) => (
                <Fragment key={index}>
                  <div className="form__subtitle">
                    第{index + 1}步
                    <Tooltip title="删除该题目">
                      <DeleteTwoTone
                        twoToneColor="#fa4b2a"
                        style={{ marginLeft: 16, display: stepList.length > 1 ? 'inline' : 'none' }}
                        onClick={() => handleTopicDeleteClick(index)}
                      />
                    </Tooltip>
                  </div>
                  <Form.Item label="标题" name={['stepList', index, 'title']} rules={StepTitleRules}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="内容" name={['stepList', index, 'content']} rules={StepContentRules}>
                    <Input.TextArea />
                  </Form.Item>
                </Fragment>
              ))}
              <Form.Item>
                <Button onClick={handleTopicAddClick}>新增步骤</Button>
              </Form.Item>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 5 }}>
              <Button type="primary" size="large" onClick={handleFormSubmit}>立即提交</Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  )
}

export default CourseModify
