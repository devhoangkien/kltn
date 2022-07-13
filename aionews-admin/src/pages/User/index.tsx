/**
 * @file User list page
 */

import React from 'react'
import { useShallowReactive, useRef, onMounted, useReactive, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { Table, Button, Card, Input, Divider, Spin, Modal, Space, ConfigProvider } from 'antd'
import * as Icon from '@ant-design/icons'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import { getUsers, GetUserParams, deleteUser, deleteUsers, putUser, createUser } from '@/store/user'
import { ResponsePaginationData } from '@/constants/request'
import { User } from '@/constants/user'
import { scrollTo } from '@/services/scroller'
import { getBlogUserUrl } from '@/transforms/url'
import { EditModal } from './EditModal'

import styles from './style.module.less'

export const UserPage: React.FC = () => {
  const loading = useLoading()
  const submitting = useLoading()
  const user = useShallowReactive<ResponsePaginationData<User>>({
    data: [],
    pagination: undefined,
  })

  // Multiple choice
  const selectedIDs = useRef<Array<string>>([])
  const handleSelect = (ids: any[]) => {
    selectedIDs.value = ids
  }

  // filter parameter
  const filterParams = useReactive({
    keyword: '',
  })

  // Pop-ups
  const activeEditDataIndex = useRef<number | null>(null)
  const isVisibleModal = useRef(false)
  const activeEditData = useComputed(() => {
    const index = activeEditDataIndex.value
    return index !== null ? user.data[index] : null
  })
  const closeModal = () => {
    isVisibleModal.value = false
  }
  // Edit
  const editData = (index: number) => {
    activeEditDataIndex.value = index
    isVisibleModal.value = true
  }
  const createNewData = () => {
    activeEditDataIndex.value = null
    isVisibleModal.value = true
  }

  const fetchData = (params?: GetUserParams) => {
    const getParams = { ...params }
    if (!!filterParams.keyword) {
      getParams.keyword = filterParams.keyword
    }

    loading.promise(getUsers(getParams)).then((response) => {
      user.data = response.data
      user.pagination = response.pagination
      scrollTo(document.body)
    })
  }

  const resetParamsAndRefresh = () => {
    filterParams.keyword = ''
    fetchData()
  }

  const refreshData = () => {
    fetchData({
      page: user.pagination?.current_page,
      per_page: user.pagination?.per_page,
    })
  }

  const handleDelete = (user: User) => {
    Modal.confirm({
      title: `Are you sure you want to delete user "${user.email}" ?`,
      content: `Can't recover after deleting`,
      centered: true,
      onOk: () =>
        deleteUser(user._id!).then(() => {
          refreshData()
        }),
      okText: 'Delete',
      cancelText: 'Cancel',
    })
  }

  const handleDeleteList = () => {
    const ids = selectedIDs.value
    Modal.confirm({
      title: `Are you sure you want to delete the users ${ids.length}?`,
      content: `Can't recover after deleting`,
      centered: true,
      onOk: () =>
        deleteUsers(ids).then(() => {
          refreshData()
        }),
      okText: 'Delete',
      cancelText: 'Cancel',
    })
  }

  const handleSubmit = (user: User) => {
    if (activeEditData.value) {
      submitting
        .promise(
          putUser({
            ...activeEditData.value,
            ...user,
          })
        )
        .then(() => {
          closeModal()
          refreshData()
        })
    } else {
      submitting.promise(createUser(user)).then(() => {
        closeModal()
        refreshData()
      })
    }
  }
  const tableEmpty = () => {}
  onMounted(() => {
    fetchData()
  })

  return (
    <Card
      title={`User list (${user.pagination?.total ?? '-'}）`}
      bordered={false}
      className={styles.user}
      extra={
        <Button type="primary" size="small" icon={<Icon.PlusOutlined />} onClick={createNewData}>
          New User
        </Button>
      }
    >
      <Space className={styles.toolbar}>
        <Space>
          <Input.Search
            className={styles.search}
            placeholder="Enter a keyword to search"
            loading={loading.state.value}
            onSearch={() => fetchData()}
            value={filterParams.keyword}
            onChange={(event) => {
              filterParams.keyword = event.target.value
            }}
          />
          <Button
            icon={<Icon.ReloadOutlined />}
            loading={loading.state.value}
            onClick={resetParamsAndRefresh}
          >
            Reset
          </Button>
        </Space>
        <Space>
          <DropdownMenu
            disabled={!selectedIDs.value.length}
            options={[
              {
                label: 'Delete',
                icon: <Icon.DeleteOutlined />,
                onClick: handleDeleteList,
              },
            ]}
          >
            Bulk operations
          </DropdownMenu>
        </Space>
      </Space>
      <Divider />
      <Spin spinning={loading.state.value}>
        <ConfigProvider renderEmpty={tableEmpty}>
          <Table<User>
            rowKey="_id"
            dataSource={user.data}
            rowSelection={{
              selectedRowKeys: selectedIDs.value,
              onChange: handleSelect,
            }}
            pagination={{
              pageSizeOptions: ['10', '20', '50'],
              current: user.pagination?.current_page,
              pageSize: user.pagination?.per_page,
              total: user.pagination?.total,
              showSizeChanger: false,
              onChange(page, pageSize) {
                return fetchData({ page, per_page: pageSize })
              },
            }}
            columns={[
              {
                title: 'ID',
                width: 60,
                dataIndex: 'id',
              },
              {
                title: 'UserName',
                dataIndex: 'userName',
                width: 140,
              },
              {
                title: 'Email',
                dataIndex: 'email',
                width: 180,
              },
              {
                title: 'Level',
                dataIndex: 'level',
                width: 50,
              },
              {
                title: 'Point',
                dataIndex: 'point',
                width: 50,
              },
              {
                title: 'Vip',
                dataIndex: 'vip',
                width: 50,
              },
              {
                title: 'Status',
                width: 50,
                align: 'right',
                dataIndex: 'status',
              },
              {
                title: 'Action',
                width: 200,
                align: 'right',
                dataIndex: 'actions',
                render: (_, user, index) => (
                  <Button.Group>
                    <Button
                      size="small"
                      type="text"
                      icon={<Icon.EditOutlined />}
                      onClick={() => editData(index)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      type="text"
                      danger={true}
                      icon={<Icon.DeleteOutlined />}
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="small"
                      type="link"
                      target="_blank"
                      icon={<Icon.LinkOutlined />}
                      href={getBlogUserUrl(user.userName)}
                    >
                      View
                    </Button>
                  </Button.Group>
                ),
              },
            ]}
          />
        </ConfigProvider>
      </Spin>
      <EditModal
        title={activeEditData.value ? 'Edit user' : 'New user'}
        loading={submitting.state.value}
        visible={isVisibleModal}
        user={activeEditData}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </Card>
  )
}
