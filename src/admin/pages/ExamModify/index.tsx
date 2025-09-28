import React, { FC, Fragment, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CustomBreadcrumb } from '@/admin/components'
import {
  Form,
  Input,
  Select,
  Col,
  Row,
  Divider,
  Button,
  Checkbox,
  Tooltip,
  message,
  DatePicker,
  Spin,
  Switch
} from 'antd';
import { LoadingOutlined, InfoCircleOutlined, DeleteTwoTone } from '@ant-design/icons';
import moment from 'moment';
import http from '@/admin/utils/http'
import {
  ExamNameRules,
  ExamDifficultyRules,
  ExamTypeRules,
  ExamContentRules,
  ExamTimingModeRules,
  ExamTimeRangeRules,
  ExamCodeRules,
  ExamCountDownRules,
  TopicContentRules,
  TopicTypeRules,
  TopicOptionRules,
  TopicAnswerRules
} from './formValidate'

import './index.scss'
const { Option } = Select
const { RangePicker } = DatePicker;

interface TopicList {
  topicType: number,
  topicAnswer: number[],
  topicContent: string,
  topicOptions: any[]
}

interface ExamInfo {
  examName: string,
  examContent: string,
  examCode: string,
  examType: number,
  examDifficulty: number,
  examTimingMode: number,
  startTime: number,
  endTime: number,
  countDown: number,
  isOpen: boolean,
}

const ExamModify: FC = () => {
  const navigate = useNavigate() // React Router v6 替代 history
  const { id } = useParams<{ id: string }>() // v6 获取路由参数
  const [form] = Form.useForm() // Antd v4 Form hooks
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [examInfo, setExamInfo] = useState<ExamInfo>({
    examName: '',
    examContent: '',
    examCode: '',
    examType: 0,
    examDifficulty: 0,
    examTimingMode: 0,
    startTime: 0,
    endTime: 0,
    countDown: 0,
    isOpen: false,
  })
  const [topicList, setTopicList] = useState<TopicList[]>([{
    topicType: 1,
    topicAnswer: [],
    topicContent: '',
    topicOptions: []
  }])
  const [timingMode, setTimingMode] = useState<number>(1)
  const [examCountDown, setExamCountDown] = useState<string>('m')

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 15, offset: 1 }
  }

  // 获取考试详情
  useEffect(() => {
    const setExamDetails = async () => {
      try {
        const { data } = await http.get(`/exams/${id}`)
        const {
          examName,
          examContent,
          examCode,
          examType,
          examDifficulty,
          examTimingMode,
          startTime,
          endTime,
          countDown,
          isOpen,
          topicList
        } = data
        topicList.forEach((_: any, index: number) => {
          topicList[index].topicOptions = topicList[index].topicOptions.map((item: any) => item.option)
        })
        setExamCountDown(countDown[countDown.length - 1])
        setTopicList([...topicList])
        setExamInfo({
          examName,
          examContent,
          examCode,
          examType,
          examDifficulty,
          examTimingMode,
          startTime,
          endTime,
          countDown: countDown.substr(0, countDown.length - 1),
          isOpen
        })
        setTimingMode(examTimingMode)
        setIsLoading(false)
        // 设置表单初始值
        form.setFieldsValue({
          examName,
          examContent,
          examCode,
          examType,
          examDifficulty,
          examTimingMode,
          examTime: timingMode === 1 ? countDown.substr(0, countDown.length - 1) : [moment(startTime), moment(endTime)],
          isOpen,
          topicList
        })
      } catch (e) {
        /* 当通过url直接访问页面时候，若题库不存在则跳转回列表页面 */
        navigate('/admin/content/exam-list')
      }
    }
    setExamDetails()
  }, [id, navigate, form])

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields()
      const {
        examName,
        examContent,
        examType,
        examDifficulty,
        examTimingMode,
        examTime,
        topicList,
        examCode,
        isOpen
      } = values
      const time = timingMode === 1
        ? examTime + examCountDown
        : examTime.map((time: any) => time.format('x'))
      topicList.forEach((topic: TopicList) => {
        const { topicOptions } = topic
        topic.topicOptions = topicOptions.map((option: string, id: number) => ({
          id: id + 1,
          option
        }))
      })
      const { data: { msg } } = await http.put(`/exams/${id}`, {
        examName,
        examContent,
        examType,
        examDifficulty,
        examTimingMode,
        examTime: time,
        topicList,
        isOpen,
        examCode
      })
      message.success(msg)
      navigate('/admin/content/exam-list')
    } catch (err) {
      console.log('表单校验失败或提交异常', err)
    }
  }

  const handleTopicAddClick = () => {
    const currentList = form.getFieldValue('topicList') || topicList
    const newTopic = { topicType: 1, topicAnswer: [1], topicContent: '', topicOptions: [] }
    const updatedList = [...currentList, newTopic]
    setTopicList(updatedList)
    form.setFieldsValue({ topicList: updatedList })
  }

  const handleTopicDeleteClick = (topicIndex: number) => {
    const currentList = form.getFieldValue('topicList') || topicList
    currentList.splice(topicIndex, 1)
    setTopicList([...currentList])
    form.setFieldsValue({ topicList: currentList })
  }

  const handleTopicAnswerChange = (checkedValues: any[], index: number) => {
    const currentList = form.getFieldValue('topicList') || topicList
    const len = checkedValues.length
    if (!isMultiple(index) && len > 1) {
      checkedValues.splice(0, len - 1)
    }
    currentList[index].topicAnswer = [...checkedValues]
    setTopicList([...currentList])
    form.setFieldsValue({ topicList: currentList })
  }

  const handleTopicTypeChange = (value: any, index: number) => {
    const currentList = form.getFieldValue('topicList') || topicList
    const len = currentList[index].topicAnswer.length
    if (value === 1 && len > 1) {
      currentList[index].topicAnswer.splice(0, len - 1)
    }
    setTopicList([...currentList])
    form.setFieldsValue({ topicList: currentList })
  }

  const isMultiple = (index: number): boolean => {
    const currentList = form.getFieldValue('topicList') || topicList
    return currentList[index].topicType === 2
  }

  const handleTimingModeChange = (value: number) => {
    setTimingMode(value)
    /* 不清空表单值会引起 RangePicker 组件报错 */
    form.setFieldsValue({ examTime: null })
    setExamCountDown('m')
  }

  const handleExamCountDownChange = (value: string) => {
    setExamCountDown(value)
  }

  return (
    <div>
      <CustomBreadcrumb list={['内容管理', '新增考试', examInfo.examName]} />
      <div className="exam-publish__container">
        <Spin spinning={isLoading} size="large" tip="加载中..." indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
          <div className="form__title">考试信息</div>
          <Form form={form} layout="horizontal" {...formLayout} hideRequiredMark>
            {/* 考试名称 */}
            <Form.Item label="考试名称" name="examName" rules={ExamNameRules}>
              <Input />
            </Form.Item>
            {/* 考试简介 */}
            <Form.Item label="考试简介" name="examContent" rules={ExamContentRules}>
              <Input />
            </Form.Item>
            <Row>
              <Col span={12}>
                <Form.Item label="考试难度" labelCol={{ span: 8 }} wrapperCol={{ span: 10, offset: 2 }} name="examDifficulty" rules={ExamDifficultyRules}>
                  <Select>
                    <Option value={1}>简单</Option>
                    <Option value={2}>中等</Option>
                    <Option value={3}>困难</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="考试类型" labelCol={{ span: 4 }} wrapperCol={{ span: 10, offset: 2 }} name="examType" rules={ExamTypeRules}>
                  <Select>
                    <Option value={1}>课堂小测</Option>
                    <Option value={2}>单元测试</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label={<span>计时方式&nbsp;<Tooltip title="目前支持两种计时方式"><InfoCircleOutlined /></Tooltip></span>} labelCol={{ span: 4 }} wrapperCol={{ span: 5, offset: 1 }} name="examTimingMode" rules={ExamTimingModeRules}>
              <Select onChange={handleTimingModeChange}>
                <Option value={1}>倒计时</Option>
                <Option value={2}>固定时间</Option>
              </Select>
            </Form.Item>
            <Form.Item label="时间安排" labelCol={{ span: 4 }} wrapperCol={{ span: timingMode === 1 ? 5 : 12, offset: 1 }} name="examTime" rules={timingMode === 1 ? ExamCountDownRules : ExamTimeRangeRules}>
              {timingMode === 1 ? (
                <Input addonAfter={
                  <Select value={examCountDown} onChange={handleExamCountDownChange} defaultValue="m" style={{ width: 80 }}>
                    <Option value="s">秒</Option>
                    <Option value="m">分钟</Option>
                    <Option value="h">小时</Option>
                    <Option value="d">天</Option>
                  </Select>
                } />
              ) : (
                <RangePicker style={{ width: '100%' }} showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" placeholder={['开始时间', '结束时间']} />
              )}
            </Form.Item>
            <Form.Item label={<span>考试代码&nbsp;<Tooltip title="请输入六位考试代码"><InfoCircleOutlined /></Tooltip></span>} wrapperCol={{ span: 5, offset: 1 }} name="examCode" rules={ExamCodeRules}>
              <Input />
            </Form.Item>
            <Form.Item label="是否开启" name="isOpen" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Divider />
            {/* 新增题目 */}
            {topicList && topicList.map((topic, index) => (
              <Fragment key={index}>
                <div className="form__subtitle">
                  第{index + 1}题
                  <Tooltip title="删除该题目">
                    <DeleteTwoTone
                      twoToneColor="#fa4b2a"
                      style={{ marginLeft: 16, display: topicList.length > 1 ? 'inline' : 'none' }}
                      onClick={() => handleTopicDeleteClick(index)}
                    />
                  </Tooltip>
                </div>
                <Form.Item label="题目内容" name={['topicList', index, 'topicContent']} rules={TopicContentRules}>
                  <Input.TextArea />
                </Form.Item>
                <Row gutter={32}>
                  <Col span={12}>
                    <Form.Item label={<span>题目类型&nbsp;<Tooltip title="目前仅支持单选及多选"><InfoCircleOutlined /></Tooltip></span>} name={['topicList', index, 'topicType']} rules={TopicTypeRules}>
                      <Select onChange={(value) => handleTopicTypeChange(value, index)}>
                        <Option value={1}>单选</Option>
                        <Option value={2}>多选</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="正确答案" name={['topicList', index, 'topicAnswer']} rules={TopicAnswerRules}>
                      <Checkbox.Group style={{ width: '100%' }} onChange={(values) => handleTopicAnswerChange(values, index)}>
                        <Row>
                          {['A', 'B', 'C', 'D'].map((option, idx) => (
                            <Col span={6} key={idx}>
                              <Checkbox value={idx + 1}>选项{option}</Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Checkbox.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={32}>
                  {['A', 'B', 'C', 'D'].map((option, idx) => (
                    <Col span={12} key={idx}>
                      <Form.Item label={`选项${option}`} name={['topicList', index, 'topicOptions', idx]} rules={TopicOptionRules}>
                        <Input />
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </Fragment>
            ))}
            <Form.Item>
              <Button onClick={handleTopicAddClick}>新增题目</Button>
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

export default ExamModify