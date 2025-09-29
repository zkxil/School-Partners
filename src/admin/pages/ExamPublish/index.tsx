import React, { FC, useState, Fragment } from 'react'
import { CustomBreadcrumb } from '@/admin/components'
import { useNavigate } from 'react-router-dom' // React Router v6
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
  DatePicker
} from 'antd'
import { InfoCircleOutlined, DeleteTwoTone } from '@ant-design/icons'
import {
  ExamNameRules,
  ExamDifficultyRules,
  ExamTypeRules,
  ExamContentRules,
  ExamTimingModeRules,
  ExamTimeRangeRules,
  ExamCountDownRules,
  TopicContentRules,
  TopicTypeRules,
  TopicOptionRules,
  TopicAnswerRules
} from './formValidate'
import http from '@/admin/utils/http'
import './index.scss'

const { Option } = Select
const { RangePicker } = DatePicker

interface FormLayout {
  labelCol: object,
  wrapperCol: object,
  labelAlign?: 'left' | 'right' | undefined
}

interface TopicList {
  topicType: number
  topicAnswer: number[]
  topicContent: string
  topicOptions: any[]
}

const ExamPublish: FC = () => {
  const [form] = Form.useForm()
  const [topicList, setTopicList] = useState<TopicList[]>([{
    topicType: 1,
    topicAnswer: [],
    topicContent: '',
    topicOptions: []
  }])
  const [timingMode, setTimingMode] = useState<number>(1)
  const [examCountDown, setExamCountDown] = useState<string>('m')
  const navigate = useNavigate()

  const formLayout: FormLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 15, offset: 1 }
  }

  // 提交表单
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields()
      const { examName, examContent, examType, examDifficulty, examTime } = values

      // 根据计时方式处理时间
      const time = timingMode === 1
        ? examTime + examCountDown
        : examTime.map((t: any) => t.valueOf())

      // 处理题目选项
      const finalTopicList = topicList.map(topic => ({
        ...topic,
        topicOptions: topic.topicOptions.map((option, idx) => ({ id: idx + 1, option }))
      }))

      const { data: { msg } } = await http.post('/exams', {
        examName,
        examContent,
        examType,
        examDifficulty,
        examTimingMode: timingMode,
        examTime: time,
        topicList: finalTopicList
      })
      message.success(msg)
      navigate('/admin/content/exam-list')
    } catch (error) {
      console.log('表单校验失败或提交失败', error)
    }
  }

  // 新增题目
  const handleTopicAddClick = () => {
    setTopicList([...topicList, {
      topicType: 1,
      topicAnswer: [1],
      topicContent: '',
      topicOptions: [],
    }])
  }

  // 删除题目
  const handleTopicDeleteClick = (index: number) => {
    const newList = [...topicList]
    newList.splice(index, 1)
    setTopicList(newList)
    form.setFieldValue('topicList', newList)
  }

  // 判断是否多选
  const isMultiple = (index: number): boolean => {
    return topicList[index].topicType === 2
  }

  // 题目答案变化
  const handleTopicAnswerChange = (checkedValues: number[], index: number) => {
    const newList = [...topicList]
    const len = checkedValues.length
    if (!isMultiple(index) && len > 1) {
      checkedValues.splice(0, len - 1)
    }
    newList[index].topicAnswer = [...checkedValues]
    setTopicList(newList)
    form.setFieldValue('topicList', newList)
  }

  // 题目类型变化
  const handleTopicTypeChange = (value: number, index: number) => {
    const newList = [...topicList]
    const len = newList[index].topicAnswer.length
    if (value === 1 && len > 1) {
      newList[index].topicAnswer.splice(0, len - 1)
    }
    newList[index].topicType = value
    setTopicList(newList)
    form.setFieldValue('topicList', newList)
  }

  // 计时方式变化
  const handleTimingModeChange = (value: number) => {
    setTimingMode(value)
    form.setFieldValue('examTime', null) // 不清空表单值会引起 RangePicker 报错
    setExamCountDown('m')
  }

  // 倒计时单位变化
  const handleExamCountDownChange = (value: string) => {
    setExamCountDown(value)
  }

  return (
    <div>
      <CustomBreadcrumb list={['内容管理', '新增考试']} />
      <div className="exam-publish__container">
        <div className="form__title">考试信息</div>
        <Form form={form} layout="horizontal" {...formLayout} hideRequiredMark>
          <Form.Item name="examName" label="考试名称" rules={ExamNameRules}>
            <Input />
          </Form.Item>
          <Form.Item name="examContent" label="考试简介" rules={ExamContentRules}>
            <Input />
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item
                name="examDifficulty"
                label="考试难度"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10, offset: 2 }}
                rules={ExamDifficultyRules}
                initialValue={1}
              >
                <Select>
                  <Option value={1}>简单</Option>
                  <Option value={2}>中等</Option>
                  <Option value={3}>困难</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="examType"
                label="考试类型"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 10, offset: 2 }}
                rules={ExamTypeRules}
                initialValue={1}
              >
                <Select>
                  <Option value={1}>课堂小测</Option>
                  <Option value={2}>单元测试</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="examTimingMode"
            label={
              <span>
                计时方式&nbsp;
                <Tooltip title="目前支持两种计时方式">
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 5, offset: 1 }}
            rules={ExamTimingModeRules}
            initialValue={1}
          >
            <Select onChange={handleTimingModeChange}>
              <Option value={1}>倒计时</Option>
              <Option value={2}>固定时间</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="examTime"
            label="时间安排"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: timingMode === 1 ? 5 : 12, offset: 1 }}
            rules={timingMode === 1 ? ExamCountDownRules : ExamTimeRangeRules}
          >
            {timingMode === 1 ? (
              <Input
                addonAfter={
                  <Select value={examCountDown} onChange={handleExamCountDownChange} defaultValue="m" style={{ width: 80 }}>
                    <Option value="s">秒</Option>
                    <Option value="m">分钟</Option>
                    <Option value="h">小时</Option>
                    <Option value="d">天</Option>
                  </Select>
                }
              />
            ) : (
              <RangePicker
                style={{ width: '100%' }}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['开始时间', '结束时间']}
              />
            )}
          </Form.Item>

          <Divider />

          <Form.Item label="新增题目">
            {topicList.map((_, index: number) => (
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
                <Form.Item
                  name={['topicList', index, 'topicContent']}
                  label="题目内容"
                  rules={TopicContentRules}
                >
                  <Input.TextArea />
                </Form.Item>

                <Row gutter={32}>
                  <Col span={12}>
                    <Form.Item
                      name={['topicList', index, 'topicType']}
                      label={
                        <span>
                          题目类型&nbsp;
                          <Tooltip title="目前仅支持单选及多选">
                            <InfoCircleOutlined />
                          </Tooltip>
                        </span>
                      }
                      rules={TopicTypeRules}
                      initialValue={1}
                    >
                      <Select onChange={(value: number) => handleTopicTypeChange(value, index)}>
                        <Option value={1}>单选</Option>
                        <Option value={2}>多选</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['topicList', index, 'topicAnswer']}
                      label="正确答案"
                      rules={TopicAnswerRules}
                      initialValue={[1]}
                    >
                      <Checkbox.Group
                        style={{ width: '100%' }}
                        onChange={(values: number[]) => handleTopicAnswerChange(values, index)}
                      >
                        <Row>
                          {['A', 'B', 'C', 'D'].map((option: string, idx: number) => (
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
                  {['A', 'B', 'C', 'D'].map((option: string, idx: number) => (
                    <Col span={12} key={idx}>
                      <Form.Item
                        name={['topicList', index, 'topicOptions', idx]}
                        label={`选项${option}`}
                        rules={TopicOptionRules} // 改用数组形式存储选项，大于两个选项时候则允许提交
                      >
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
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 5 }}>
            <Button type="primary" size="large" onClick={handleFormSubmit}>立即提交</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default ExamPublish
