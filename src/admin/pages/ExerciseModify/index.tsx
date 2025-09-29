import React, { FC, Fragment, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CustomBreadcrumb } from '@/admin/components'
import {
  Form,
  Input,
  Select,
  Col,
  Row,
  Switch,
  Divider,
  Button,
  Checkbox,
  Tooltip,
  message,
  Spin
} from 'antd'
import { LoadingOutlined, InfoCircleOutlined, DeleteTwoTone } from '@ant-design/icons'
import http from '@/admin/utils/http'
import {
  ExerciseNameRules,
  ExerciseDifficultyRules,
  ExerciseTypeRules,
  TopicContentRules,
  ExerciseContentRules,
  TopicTypeRules,
  TopicOptionRules,
  TopicAnswerRules
} from './formValidate'
import './index.scss'

const { Option } = Select

interface TopicList {
  topicType: number
  topicAnswer: number[]
  topicContent: string
  topicOptions: any[]
  isUpload: boolean
}

interface ExerciseInfo {
  exerciseName: string
  exerciseContent: string
  exerciseDifficulty: number
  exerciseType: number
  isHot: boolean
  isPublic: boolean
}

const ExerciseModify: FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [topicList, setTopicList] = useState<TopicList[]>([{
    topicType: 1,
    topicAnswer: [],
    topicContent: '',
    topicOptions: [],
    isUpload: false
  }])
  const [exerciseInfo, setExerciseInfo] = useState<ExerciseInfo>({
    exerciseName: '',
    exerciseContent: '',
    exerciseDifficulty: 1,
    exerciseType: 1,
    isHot: false,
    isPublic: false
  })
  const [modifyExerciseName, setModifyExerciseName] = useState('')

  const [form] = Form.useForm() // hooks 形式表单
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()

  // 获取题库详情
  useEffect(() => {
    const setExerciseDetail = async () => {
      try {
        const { data } = await http.get(`/exercises/${params.id}`)
        const {
          exerciseName,
          exerciseContent,
          exerciseDifficulty,
          exerciseType,
          isHot,
          isPublic,
          topicList
        } = data

        // 处理选项数组
        topicList.forEach((_: any, index: number) => {
          topicList[index].topicOptions = topicList[index].topicOptions.map((item: any) => item.option)
        })

        setModifyExerciseName(exerciseName)
        setTopicList([...topicList])
        form.setFieldsValue({ topicList: [...topicList] })
        setExerciseInfo({
          exerciseName,
          exerciseContent,
          exerciseDifficulty,
          exerciseType,
          isHot,
          isPublic
        })
        setIsLoading(false)
      } catch (e) {
        /* 当通过url直接访问页面时候，若题库不存在则跳转回列表页面 */
        navigate('/admin/content/exercise-list')
      }
    }
    setExerciseDetail()
  }, [])

  // 提交表单
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields()
      const { exerciseName, exerciseContent, exerciseType, exerciseDifficulty, isHot, isPublic, topicList } = values
      topicList.forEach((topic: TopicList) => {
        topic.topicOptions = topic.topicOptions.map((option: string, id: number) => ({ id: id + 1, option }))
      })
      const { data: { msg } } = await http.put(`/exercises/${params.id}`, {
        exerciseName,
        exerciseContent,
        exerciseType,
        exerciseDifficulty,
        isHot,
        isPublic,
        topicList
      })
      message.success(msg)
      navigate('/admin/content/exercise-list')
    } catch (err) {
      // 校验失败
    }
  }

  // 新增题目
  const handleTopicAddClick = () => {
    const currentTopicList = [...topicList, {
      topicType: 1,
      topicAnswer: [1],
      topicContent: '',
      topicOptions: [],
      isUpload: false
    }]
    setTopicList(currentTopicList)
  }

  // 删除题目
  const handleTopicDeleteClick = (index: number) => {
    const currentTopicList = [...topicList]
    currentTopicList.splice(index, 1)
    setTopicList(currentTopicList)
    form.setFieldsValue({ topicList: currentTopicList })
  }

  // 改变题目答案
  const handleTopicAnswerChange = (checkedValues: any[], index: number) => {
    const currentTopicList = [...topicList]
    if (currentTopicList[index].topicType !== 2 && checkedValues.length > 1) {
      checkedValues.splice(0, checkedValues.length - 1)
    }
    currentTopicList[index].topicAnswer = [...checkedValues]
    setTopicList(currentTopicList)
    form.setFieldsValue({ topicList: currentTopicList })
  }

  // 改变题目类型
  const handleTopicTypeChange = (value: number, index: number) => {
    const currentTopicList = [...topicList]
    currentTopicList[index].isUpload = value === 3
    if (value === 1 && currentTopicList[index].topicAnswer.length > 1) {
      currentTopicList[index].topicAnswer = [currentTopicList[index].topicAnswer[0]]
    }
    setTopicList(currentTopicList)
    form.setFieldsValue({ topicList: currentTopicList })
  }

  const isMultiple = (index: number) => topicList[index].topicType === 2

  return (
    <div>
      <CustomBreadcrumb list={['内容管理', '题库管理', modifyExerciseName]} />
      <div className="exercise-modify__container">
        <Spin spinning={isLoading} size="large" tip="加载中..." indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
          <div className="form__title">题库信息</div>
          <Form form={form} layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 15, offset: 1 }} hideRequiredMark>
            <Form.Item label="题库名称" name="exerciseName" rules={ExerciseNameRules} initialValue={exerciseInfo.exerciseName}>
              <Input />
            </Form.Item>
            <Form.Item label="题库简介" name="exerciseContent" rules={ExerciseContentRules} initialValue={exerciseInfo.exerciseContent}>
              <Input />
            </Form.Item>

            {/* 难度 & 类型 & 热门 & 是否公开 */}
            <Row>
              <Col span={12}>
                <Form.Item label="题库难度" labelCol={{ span: 8 }} wrapperCol={{ span: 10, offset: 2 }} name="exerciseDifficulty" rules={ExerciseDifficultyRules} initialValue={exerciseInfo.exerciseDifficulty}>
                  <Select>
                    <Option value={1}>简单</Option>
                    <Option value={2}>中等</Option>
                    <Option value={3}>困难</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="题库类型" labelCol={{ span: 4 }} wrapperCol={{ span: 10, offset: 2 }} name="exerciseType" rules={ExerciseTypeRules} initialValue={exerciseInfo.exerciseType}>
                  <Select>
                    <Option value={1}>免费</Option>
                    <Option value={2}>会员</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="题库热门" labelCol={{ span: 8 }} wrapperCol={{ span: 10, offset: 2 }} name="isHot" valuePropName="checked" initialValue={exerciseInfo.isHot}>
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="是否公开" labelCol={{ span: 4 }} wrapperCol={{ span: 10, offset: 2 }} name="isPublic" valuePropName="checked" initialValue={exerciseInfo.isPublic}>
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            {/* 题目列表 */}
            {topicList.map((topic: TopicList, index: number) => (
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

                <Form.Item label="题目内容" name={['topicList', index, 'topicContent']} rules={TopicContentRules} initialValue={topic.topicContent}>
                  <Input.TextArea />
                </Form.Item>

                <Row gutter={32}>
                  <Col span={12}>
                    <Form.Item style={{ display: 'none' }} name={['topicList', index, 'isUpload']}>
                      <span />
                    </Form.Item>
                    <Form.Item label={<span>题目类型&nbsp;<Tooltip title="目前支持单选、多选及文件上传题"><InfoCircleOutlined /></Tooltip></span>} name={['topicList', index, 'topicType']} rules={TopicTypeRules} initialValue={topic.topicType}>
                      <Select onChange={(value: number) => handleTopicTypeChange(value, index)}>
                        <Option value={1}>单选</Option>
                        <Option value={2}>多选</Option>
                        <Option value={3}>文件上传题</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12} hidden={topic.isUpload}>
                    <Form.Item label="正确答案" name={['topicList', index, 'topicAnswer']} rules={topic.isUpload ? [{ required: false }] : TopicAnswerRules} initialValue={topic.topicAnswer}>
                      <Checkbox.Group style={{ width: '100%' }} onChange={(values: number[]) => handleTopicAnswerChange(values, index)}>
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

                <Row gutter={32} hidden={topic.isUpload}>
                  {['A', 'B', 'C', 'D'].map((option: string, idx: number) => (
                    <Col span={12} key={idx}>
                      <Form.Item label={`选项${option}`} name={['topicList', index, 'topicOptions', idx]} rules={topic.isUpload ? [{ required: false }] : TopicOptionRules} initialValue={topic.topicOptions[idx]}>
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

export default ExerciseModify
