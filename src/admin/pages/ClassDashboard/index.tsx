import React, { FC, ComponentType, FormEvent, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import useStore from '@/admin/hooks/useStore';
import http from '@/admin/utils/http'
import { CustomBreadcrumb } from '@/admin/components'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Form,
  Input,
  Col,
  Row,
  Switch,
  Button,
  Tooltip,
  message,
  Upload,
  Select
} from 'antd';
import { RedoOutlined, QuestionCircleOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ClassNameRules,
  ClassTagsRules,
  ClassTeacherRules
} from './formValidate'

import './index.scss'

const { Option } = Select;

interface TagInfo {
  id: number,
  tagName: string
}

interface ClassInfo {
  id: number,
  classTag: number
  classMember: number
  className: string,
  classCode: string,
  classTeacher: string,
  classAvatar: string,
  isChecked: boolean
}

const ClassDashboard: FC = () => {
  const [form] = Form.useForm()  // <-- 这里替换 Form.create
  const [classCode, setClassCode] = useState<string>('')
  const [classAvatar, setClassAvatar] = useState<string>('http://cdn.algbb.cn/emoji/32.png')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [tagList, setTagList] = useState<TagInfo[]>([])
  const [classInfo, setClassInfo] = useState<ClassInfo>({
    id: 0,
    classTag: 0,
    classMember: 0,
    className: '',
    classCode: '',
    classTeacher: '',
    classAvatar: '',
    isChecked: false
  })

  const { userInfoStore } = useStore()
  const { setIsActived } = userInfoStore

  // React Router v6 Hooks 替代 RouteComponentProps
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 15, offset: 1 }
  }

  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  useEffect(() => {
    getTagList()
    getClassInfo()
  }, [])

  const getTagList = async () => {
    const { data: { tagList } } = await http.get('/tags')
    setTagList(tagList)
  }

  const getClassInfo = async () => {
    const { data: { classInfo } } = await http.get('/classes')
    setClassCode(classInfo.classCode)
    setClassInfo(classInfo)
    form.setFieldsValue(classInfo)  // 初始化值
  }

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault()
    form.validateFields().then(async values => {
      if (!classCode) {
        form.setFields([{ name: 'classCode', errors: ['请生成课程随机码'] }])
        return
      }
      const { className, classTeacher, classTag, isChecked } = values
      const { data: { msg } } = await http.put('/classes', {
        className,
        classTeacher,
        classTag,
        classCode,
        classAvatar,
        isChecked
      })
      setIsActived(true)
      message.success(msg)
    }).catch(err => {
      console.log('Validation Failed:', err)
    })
  }

  const getBase64 = (img: File, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handleAvatarUpload = ({ file }: { file: File }) => {
    setIsLoading(true)
    getBase64(file, (imageUrl: string) => {
      setClassAvatar(imageUrl)
      setIsLoading(false)
    });
  }

  const handleRandomClick = () => {
    const randomList: string = '0123456789QWERTYUIOPASDFGHJKLZXCVBNM'
    const randomCode: string = randomList.split('').sort(() => Math.random() - 0.5).join('').slice(0, 6)
    setClassCode(randomCode)
    form.setFieldsValue({ classCode: randomCode })  // 设置值
  }

  return (
    <div>
      <CustomBreadcrumb list={['班级建设', '班级管理']} />
      <div className="class-dashboard__container">
        <div className="form__title">班级信息</div>
        <Form form={form} layout="horizontal" {...formLayout} hideRequiredMark>
          <Form.Item label="班级名称" name="className" rules={ClassNameRules}>
            <Input />
          </Form.Item>
          <Form.Item label="班级老师" name="classTeacher" rules={ClassTeacherRules}>
            <Input />
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item label="班级标签" name="classTag" labelCol={{ span: 8 }} wrapperCol={{ span: 10, offset: 2 }} rules={ClassTagsRules}>
                <Select>
                  {tagList.map((tag: TagInfo) => <Option key={tag.id} value={tag.id}>{tag.tagName}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="班级代码" name="classCode" labelCol={{ span: 4 }} wrapperCol={{ span: 10, offset: 2 }}>
                <div className="class-dashboard__code">
                  {classCode}
                  <Tooltip title="刷新">
                    <RedoOutlined className="icon" onClick={handleRandomClick} />
                  </Tooltip>
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={<span>开启审核&nbsp;<Tooltip title="是否允许任何人通过输入班级代码加入班级"><QuestionCircleOutlined /></Tooltip></span>} name="isChecked" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="班级头像" name="classAvatar">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={handleAvatarUpload}
              accept=".png,.jpg,.jpeg"
            >
              {classAvatar ? <img src={classAvatar} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 5 }}>
            <Button type="primary" size="large" onClick={handleFormSubmit}>立即提交</Button>
          </Form.Item>
        </Form>
      </div>
    </div >
  )
}

export default observer(ClassDashboard) as ComponentType
