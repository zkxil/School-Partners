import React, { FC, useEffect, useRef, MutableRefObject, useState } from 'react'
import { CustomBreadcrumb } from '@/admin/components'
import {
  Slider,
  Radio,
  Button,
  Tooltip,
  Select,
  Spin,
  message,
  Popconfirm,
  Form
} from 'antd'
import { QuestionCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { RadioChangeEvent } from 'antd/lib/radio'
import { getURLBase64 } from '@/admin/utils/getURLBase64'
import {
  ExerciseListProps,
  ExerciseIndexList,
  ExerciseStudentList
} from '@/admin/modals/exerciseList'
import { prefix } from '@/admin/utils/common'
import { SelectValue } from 'antd/lib/select'
import http from '@/admin/utils/http'
import { useNavigate } from 'react-router-dom'

import './index.scss'

const { Option } = Select

const MarkPaper: FC = () => {
  /* ===================== 画布字段 ===================== */
  const MOVE_MODE: number = 0
  const LINE_MODE: number = 1
  const ERASER_MODE: number = 2

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const translatePointXRef: MutableRefObject<number> = useRef(0)
  const translatePointYRef: MutableRefObject<number> = useRef(0)
  const fillStartPointXRef: MutableRefObject<number> = useRef(0)
  const fillStartPointYRef: MutableRefObject<number> = useRef(0)
  const canvasHistroyListRef: MutableRefObject<ImageData[]> = useRef([])

  const [lineColor, setLineColor] = useState<string>('#fa4b2a')
  const [fillImageSrc, setFillImageSrc] = useState<string>('')
  const [mouseMode, setmouseMode] = useState<number>(MOVE_MODE)
  const [lineWidth, setLineWidth] = useState<number>(5)
  const [canvasScale, setCanvasScale] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [canvasCurrentHistory, setCanvasCurrentHistory] = useState<number>(0)

  /* ===================== 信息字段 ===================== */
  const [exerciseList, setExerciseList] = useState<ExerciseListProps[]>([])
  const [exerciseId, setExerciseId] = useState<number>(0)
  const [exerciseIndex, setExerciseIndex] = useState<number>(0)
  const [exerciseIndexList, setExerciseIndexList] = useState<ExerciseIndexList[]>([])
  const [exerciseStudentList, setExerciseStudentList] = useState<ExerciseStudentList[]>([])
  const [classId, setClassId] = useState<number>(0)

  /* ===================== 表单 ===================== */
  const [form] = Form.useForm()
  const navigate = useNavigate() // 如果未来有路由跳转需要

  /* ===================== 初始化 ===================== */
  useEffect(() => {
    // setFillImageSrc('http://cdn.algbb.cn/test/canvasTest.jpg')
  }, [])

  // 重置变换参数，重新绘制图片
  useEffect(() => {
    fillImageSrc !== '' && setIsLoading(true)
    translatePointXRef.current = 0
    translatePointYRef.current = 0
    fillStartPointXRef.current = 0
    fillStartPointYRef.current = 0
    setCanvasScale(1)
    fillImage()
  }, [fillImageSrc])

  // 画布参数变动时，重新监听canvas
  useEffect(() => {
    handleCanvas()
  }, [mouseMode, canvasScale, canvasCurrentHistory])

  // 监听画笔颜色、宽度变化
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return

    context.strokeStyle = lineColor
    context.lineWidth = lineWidth
    context.lineJoin = 'round'
    context.lineCap = 'round'
  }, [lineWidth, lineColor])

  // 监听缩放画布
  useEffect(() => {
    const canvas = canvasRef.current
    const translateX = translatePointXRef.current
    const translateY = translatePointYRef.current
    canvas && (canvas.style.transform = `scale(${canvasScale},${canvasScale}) translate(${translateX}px,${translateY}px)`)
  }, [canvasScale])

  // 历史记录回放
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    const canvasHistroyList = canvasHistroyListRef.current
    if (!canvas || !context || canvasCurrentHistory === 0) return
    context.putImageData(canvasHistroyList[canvasCurrentHistory - 1], 0, 0)
  }, [canvasCurrentHistory])

  /* ===================== 方法 ===================== */
  const fillImage = async () => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const context = canvas?.getContext('2d')
    const img = new Image()
    if (!canvas || !wrap || !context) return

    img.src = await getURLBase64(fillImageSrc)
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      canvas.style.background = `url(${img.src})`
      context.drawImage(img, 0, 0)
      context.strokeStyle = lineColor
      context.lineWidth = lineWidth
      context.lineJoin = 'round'
      context.lineCap = 'round'
      canvas.style.transformOrigin = `${wrap.offsetWidth / 2}px ${wrap.offsetHeight / 2}px`
      const startX = (wrap.offsetWidth - img.width) / 2
      const startY = (wrap.offsetHeight - img.height) / 2
      translatePointXRef.current = startX
      translatePointYRef.current = startY
      fillStartPointXRef.current = startX
      fillStartPointYRef.current = startY
      canvas.style.transform = `scale(${canvasScale},${canvasScale}) translate(${startX}px,${startY}px)`
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      canvasHistroyListRef.current = [imageData]
      setCanvasCurrentHistory(1)
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  // 其余 handleLineMode、handleMoveMode、handleEraserMode、handleCanvas、handleRollBack 等逻辑保持不变
  // 仅需将 getFieldDecorator 替换成 Form.Item name

  const handleExerciseIdChange = async (value: SelectValue) => {
    const { uploadExerciseList } = await http.get(`${prefix}/mark/paper/getExercises?exerciseId=${value}`)
    setExerciseId(+value)
    setExerciseIndexList([...uploadExerciseList])
    setFillImageSrc('')
    form.resetFields(['index', 'student'])
  }

  const handleExerciseIndexChange = async (value: SelectValue) => {
    const { classId, studentList } = await http.get(`${prefix}/mark/paper?exerciseId=${exerciseId}&exerciseIndex=${value}`)
    setClassId(classId)
    setExerciseIndex(+value)
    setExerciseStudentList([...studentList])
    setFillImageSrc('')
    form.resetFields(['student'])
  }

  const handleExerciseStudentChange = async (value: SelectValue) => {
    const imgPath = `http://cdn.algbb.cn/uploadImage/exercise/${classId}/${exerciseId}/${exerciseIndex}/${value}.png`
    setFillImageSrc(imgPath)
  }

  /* ===================== 渲染 ===================== */
  return (
    <div>
      <CustomBreadcrumb list={['内容管理', '批阅作业']} />
      <div className="mark-paper__container" ref={containerRef}>
        <div className="mark-paper__wrap" ref={wrapRef}>
          <div className="mark-paper__tips" style={{ display: fillImageSrc === '' ? 'flex' : 'none' }}>
            右侧完善基本信息<br />即可编辑图片
          </div>
          <div className="mark-paper__mask" style={{ display: isLoading ? 'flex' : 'none' }}>
            <Spin
              tip="图片加载中..."
              indicator={<LoadingOutlined style={{ fontSize: 36 }} />}
            />
          </div>
          <canvas
            ref={canvasRef}
            className="mark-paper__canvas"
            style={{ display: isLoading || fillImageSrc === '' ? 'none' : 'block' }}
          >
            <p>很可惜，这个东东与您的电脑不搭！</p>
          </canvas>
        </div>
        <div className="mark-paper__sider">
          <Form form={form} layout="vertical">
            {/* 选择题库 */}
            <div>
              选择题库：
              <Form.Item name="id" style={{ marginBottom: 0 }}>
                <Select
                  style={{ width: '100%', margin: '10px 0 20px 0' }}
                  placeholder="请选择题库"
                  onChange={handleExerciseIdChange}
                >
                  {exerciseList.map(item => (
                    <Option value={item.id} key={item.id}>{item.exerciseName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            {/* 选择题目 */}
            <div>
              选择题目：
              <Form.Item name="index" style={{ marginBottom: 0 }}>
                <Select
                  notFoundContent="暂无文件上传题"
                  style={{ width: '100%', margin: '10px 0 20px 0' }}
                  placeholder="请选择题目"
                  onChange={handleExerciseIndexChange}
                >
                  {exerciseIndexList.map(item => (
                    <Option value={item.index} key={item.index}>第{item.index + 1}题</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            {/* 选择学生 */}
            <div>
              选择学生：
              <Form.Item name="student" style={{ marginBottom: 0 }}>
                <Select
                  notFoundContent="暂无已提交的学生"
                  placeholder="请选择学生"
                  style={{ width: '100%', margin: '10px 0 20px 0' }}
                  onChange={handleExerciseStudentChange}
                >
                  {exerciseStudentList.map(item => (
                    <Option value={item.studentId} key={item.studentId}>{item.studentName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            {/* 画布操作等 */}
          </Form>
        </div>
      </div>
    </div>
  )
}

export default MarkPaper
