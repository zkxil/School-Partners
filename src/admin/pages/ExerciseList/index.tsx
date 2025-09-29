import React, { FC, useState, useEffect, ChangeEvent } from 'react'
import { Table, Button, Popconfirm, Tag, Input, Empty, message } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { useNavigate } from 'react-router-dom' // React Router v6
import { CustomBreadcrumb } from '@/admin/components'
import { ExerciseListProps } from '@/admin/modals/exerciseList'
import { generateDifficulty, generateExerciseType } from '@/admin/utils/common'
import { FetchConfig } from '@/admin/modals/http'
import { useService } from '@/admin/hooks'
import http from '@/admin/utils/http'
import './index.scss'

const ExerciseList: FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1) // Antd pagination 从1开始
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [fetchConfig, setFetchConfig] = useState<FetchConfig>({
    url: '', method: 'GET', params: {}, config: {}
  })
  const [fetchFlag, setFetchFlag] = useState<number>(0)
  const hasSelected: boolean = selectedRowKeys.length > 0
  const navigate = useNavigate() // React Router v6 使用 navigate

  // 初始化 fetch 配置
  useEffect(() => {
    const fetchConfig: FetchConfig = {
      url: '/exercises',
      method: 'GET',
      params: {},
      config: {}
    }
    setFetchConfig(Object.assign({}, fetchConfig))
  }, [fetchFlag])

  // 行选择回调
  const handleSelectedChange = (selectedKeys: number[]) => {
    setSelectedRowKeys(selectedKeys)
  }

  // 搜索框输入回调
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  // 编辑题库
  const handleEditClick = (id: number) => {
    navigate(`/admin/content/exercise-modify/${id}`)
  }

  // 删除单个题库
  const handleDeleteClick = async (id: number) => {
    const { data: { msg } } = await http.delete(`/exercises/${id}`)
    setFetchFlag(fetchFlag + 1) // 触发数据刷新
    setSelectedRowKeys([]) // 清空选中行
    message.success(msg)
  }

  // 批量删除
  const handleBatchDelete = async () => {
    const { data: { msg } } = await http.delete(`/exercises`, {
      data: selectedRowKeys
    })
    setFetchFlag(fetchFlag + 1)
    setSelectedRowKeys([])
    message.success(msg)
  }

  // Table 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectedChange,
  }

  // Table 列配置
  const columns: ColumnProps<ExerciseListProps>[] = [
    {
      title: '题库名称',
      dataIndex: 'exerciseName',
      key: 'exerciseName',
      width: 180,
      filteredValue: [searchValue],
      onFilter: (_, row) => row.exerciseName.toString().indexOf(searchValue) !== -1
    },
    {
      title: '题库内容',
      dataIndex: 'exerciseContent',
      key: 'exerciseContent',
      ellipsis: true,
    },
    {
      title: '题库类型',
      dataIndex: 'exerciseType',
      key: 'exerciseType',
      width: 120,
      render: exerciseType => {
        const { type, color } = generateExerciseType(exerciseType)
        return <Tag color={color}>{type}</Tag>
      },
      sorter: (a, b) => a.exerciseType - b.exerciseType
    },
    {
      title: '难易度',
      dataIndex: 'exerciseDifficulty',
      key: 'exerciseDifficulty',
      width: 100,
      render: exerciseDifficulty => {
        const { difficulty, color } = generateDifficulty(exerciseDifficulty)
        return <Tag color={color}>{difficulty}</Tag>
      },
      sorter: (a, b) => a.exerciseDifficulty - b.exerciseDifficulty
    },
    {
      title: '是否热门',
      dataIndex: 'isHot',
      key: 'isHot',
      width: 120,
      render: isHot => isHot ? '是' : '否',
      sorter: a => a.isHot ? 1 : -1
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      width: 180,
      render: (_, row) => (
        <span>
          <Button type="primary" onClick={() => handleEditClick(row.id)}>编辑</Button>
          <Popconfirm
            title="确定删除此题库吗?"
            onConfirm={() => handleDeleteClick(row.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="danger">删除</Button>
          </Popconfirm>
        </span>
      )
    }
  ]

  // 使用自定义 Hook 获取数据
  const { isLoading = false, response } = useService(fetchConfig)
  const { data = {} } = response || {}
  const { exerciseList = [], total: totalPage = 0 } = data

  return (
    <div>
      <CustomBreadcrumb list={['内容管理', '题库管理']} />
      <div className="exercise-list__container">
        <div className="exercise-list__header">
          {/* 新增题库按钮 */}
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => navigate('/admin/content/exercise-publish')}
          >
            新增题库
          </Button>

          {/* 批量删除按钮 */}
          <Popconfirm
            disabled={!hasSelected}
            title="确定删除这些题库吗?"
            onConfirm={handleBatchDelete}
            okText="确定"
            cancelText="取消"
          >
            <Button danger={true} disabled={!hasSelected}>批量删除</Button>
          </Popconfirm>

          {/* 搜索框 */}
          <Input.Search
            className="search__container"
            value={searchValue}
            placeholder="请输入要查询的题库名称"
            onChange={handleSearchChange}
            enterButton
          />
        </div>

        {/* 表格 */}
        <Table
          rowSelection={rowSelection}
          dataSource={exerciseList}
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
            emptyText: <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无数据"
            />
          }}
        />
      </div>
    </div>
  )
}

export default ExerciseList
