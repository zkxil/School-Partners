import React, { FC, useState, useEffect, ChangeEvent } from 'react'
import {
  Table,
  Button,
  Popconfirm,
  Tag,
  Input,
  Empty,
  message,
  Switch,
  Tooltip
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { CustomBreadcrumb } from '@/admin/components'
import { generateDifficulty, generateExamType } from '@/admin/utils/common'
import { FetchConfig } from '@/admin/modals/http'
import { useService } from '@/admin/hooks'
import http from '@/admin/utils/http'

message.config({
  maxCount: 1
})
import './index.scss'

const ExamList: FC = () => {
  const navigate = useNavigate() // React Router v6 替代 history
  // 当前页从 1 开始
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [fetchConfig, setFetchConfig] = useState<FetchConfig>({
    url: '', method: 'GET', params: {}, config: {}
  })
  const [fetchFlag, setFetchFlag] = useState<number>(0)
  const [switchLoading, setSwitchLoading] = useState<number[]>([])
  const hasSelected: boolean = selectedRowKeys.length > 0

  // 触发数据请求
  useEffect(() => {
    setFetchConfig({
      url: '/exams',
      method: 'GET',
      params: {},
      config: {}
    })
  }, [fetchFlag])

  const handleSelectedChange = (selectedRowKeys: number[]) => {
    setSelectedRowKeys(selectedRowKeys)
  }

  const handleSearchChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = changeEvent
    setSearchValue(value)
  }

  const handleEditClick = (id: number) => {
    navigate(`/admin/content/exam-modify/${id}`) // v6 使用 navigate
  }

  const handleDeleteClick = async (id: number) => {
    const { data: { msg } } = await http.delete(`/exams/${id}`)
    setFetchFlag(fetchFlag + 1)
    setSelectedRowKeys([])
    message.success(msg)
  }

  const handleBatchDelete = async () => {
    const { data: { msg } } = await http.delete(`/exams`, {
      data: selectedRowKeys
    })
    setFetchFlag(fetchFlag + 1)
    setSelectedRowKeys([])
    message.success(msg)
  }

  // 切换考试开关
  const handleOpenChange = async (examId: number) => {
    setSwitchLoading(prev => [...prev, examId])
    const { data: { msg } } = await http.put(`/exams/status/${examId}`, {})
    message.success(msg)
    setFetchFlag(fetchFlag + 1)
    setSwitchLoading(prev => prev.filter(id => id !== examId))
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectedChange,
  }

  const columns: ColumnProps<any>[] = [{
    title: '考试名称',
    dataIndex: 'examName',
    key: 'examName',
    width: 220,
    filteredValue: [searchValue],
    onFilter: (_, row) => (
      row.examName.toString().indexOf(searchValue) !== -1
    )
  }, {
    title: '考试类型',
    dataIndex: 'examType',
    key: 'examType',
    width: 120,
    render: examType => generateExamType(examType),
    sorter: (a, b) => a.examType - b.examType
  }, {
    title: '难易度',
    dataIndex: 'examDifficulty',
    key: 'examDifficulty',
    width: 100,
    render: examDifficulty => {
      const { difficulty, color } = generateDifficulty(examDifficulty)
      return (
        <Tag color={color}>
          {difficulty}
        </Tag>
      )
    },
    sorter: (a, b) => a.examDifficulty - b.examDifficulty
  }, {
    title: '考试时间',
    dataIndex: 'examTime',
    key: 'examTime',
    width: 140,
    render: examTime => <p dangerouslySetInnerHTML={{ __html: examTime }}></p>,
    sorter: (a, b) => a.examTimingMode - b.examTimingMode
  }, {
    title: '考试代码',
    dataIndex: 'examCode',
    key: 'examCode',
    width: 120,
    render: (examCode) => <Tag>{examCode}</Tag>
  }, {
    title: <span>
      是否开启&nbsp;
      <Tooltip title="倒计时的考试，开启后立即开始考试">
        <InfoCircleOutlined />
      </Tooltip>
    </span>,
    dataIndex: 'isOpen',
    key: 'isOpen',
    width: 120,
    render: (isOpen, row) => (
      <Switch
        checked={isOpen}
        loading={switchLoading.includes(row.id)}
        onChange={() => handleOpenChange(row.id)}
      />
    ),
  }, {
    title: '操作',
    dataIndex: '',
    key: '',
    width: 180,
    render: (_, row) => (
      <span>
        <Button
          type="primary"
          onClick={() => handleEditClick(row.id)}>编辑</Button>
        <Popconfirm
          title="确定删除此考试吗?"
          onConfirm={() => handleDeleteClick(row.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="danger">删除</Button>
        </Popconfirm>
      </span>
    )
  }]

  const { isLoading = false, response } = useService(fetchConfig)
  const { data = {} } = response || {}
  const { examList = [], total: totalPage = 0 } = data

  return (
    <div>
      <CustomBreadcrumb list={['内容管理', '考试管理']} />
      <div className="exam-list__container">
        <div className="exam-list__header">
          <Button type="primary" style={{ marginRight: 10 }} onClick={() => { navigate('/admin/content/exam-publish') }}>新增考试</Button>
          <Popconfirm
            disabled={!hasSelected}
            title="确定删除这些考试吗?"
            onConfirm={handleBatchDelete}
            okText="确定"
            cancelText="取消"
          >
            <Button type="danger" disabled={!hasSelected}>批量删除</Button>
          </Popconfirm>

          <Input.Search
            className="search__container"
            value={searchValue}
            placeholder="请输入要查询的考试名称"
            onChange={handleSearchChange}
            enterButton
          />
        </div>
        <Table
          rowSelection={rowSelection}
          dataSource={examList}
          columns={columns}
          rowKey="id"
          scroll={{ y: "calc(100vh - 300px)" }}
          loading={{ spinning: isLoading, tip: "加载中...", size: "large" }}
          pagination={{
            pageSize: 10,
            total: totalPage,
            current: currentPage,
            onChange: (pageNo) => setCurrentPage(pageNo)
          }}
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
          }}
        />
      </div>
    </div>
  )
}

export default ExamList
