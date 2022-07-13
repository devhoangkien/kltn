/**
 * @file Announcement page
 */

import React from 'react'
import {
  useShallowReactive,
  useRef,
  onMounted,
  useReactive,
  batchedUpdates,
  useWatch,
  useComputed,
} from 'veact'
import {
  Table,
  Button,
  Card,
  Input,
  Tag,
  Select,
  Divider,
  Spin,
  Modal,
  Space,
  ConfigProvider,
} from 'antd'
import * as Icon from '@ant-design/icons'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import {
  getAnnouncements,
  GetAnnouncementsParams,
  deleteAnnouncement,
  deleteAnnouncements,
  putAnnouncement,
  createAnnouncement,
} from '@/store/announcement'
import { Announcement as AnnouncementType } from '@/constants/announcement'
import { ResponsePaginationData } from '@/constants/request'
import { PublishState, ps } from '@/constants/publish'
import { useLoading } from 'veact-use'
import { scrollTo } from '@/services/scroller'
import { stringToYMD } from '@/transforms/date'
import { EditModal } from './EditModal'
import styles from './style.module.less'

export const STATE_IDS = [PublishState.Draft, PublishState.Published]

const SELECT_ALL_VALUE = 'ALL'

export const AnnouncementPage: React.FC = () => {
  const loading = useLoading()
  const submitting = useLoading()
  const announcement = useShallowReactive<ResponsePaginationData<AnnouncementType>>({
    data: [],
    pagination: undefined,
  })

  const tableEmpty = () => {
    ;<p>No Data</p>
  }

  // Multiple choice
  const selectedIDs = useRef<Array<string>>([])
  const handleSelect = (ids: any[]) => {
    selectedIDs.value = ids
  }

  // filter parameter
  const filterParams = useReactive({
    state: SELECT_ALL_VALUE as typeof SELECT_ALL_VALUE | PublishState,
    keyword: '',
  })

  // Pop-ups
  const activeEditDataIndex = useRef<number | null>(null)
  const isVisibleModal = useRef(false)
  const activeEditData = useComputed(() => {
    const index = activeEditDataIndex.value
    return index !== null ? announcement.data[index] : null
  })
  const closeModal = () => {
    isVisibleModal.value = false
  }
  // edit create
  const editData = (index: number) => {
    activeEditDataIndex.value = index
    isVisibleModal.value = true
  }
  const createNewData = () => {
    activeEditDataIndex.value = null
    isVisibleModal.value = true
  }

  const fetchData = (params?: GetAnnouncementsParams) => {
    const getParams: GetAnnouncementsParams = {
      ...params,
      state: filterParams.state !== SELECT_ALL_VALUE ? filterParams.state : undefined,
      keyword: Boolean(filterParams.keyword) ? filterParams.keyword : undefined,
    }

    loading.promise(getAnnouncements(getParams)).then((response) => {
      batchedUpdates(() => {
        announcement.data = response.data
        announcement.pagination = response.pagination
      })
      scrollTo(document.body)
    })
  }

  const resetParamsAndRefresh = () => {
    filterParams.keyword = ''
    if (filterParams.state === SELECT_ALL_VALUE) {
      fetchData()
    } else {
      filterParams.state = SELECT_ALL_VALUE
    }
  }

  const refreshData = () => {
    fetchData({
      page: announcement.pagination?.current_page,
      per_page: announcement.pagination?.per_page,
    })
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete the announcement?',
      content: 'Unrecoverable after deletion',
      centered: true,
      onOk: () =>
        deleteAnnouncement(id).then(() => {
          refreshData()
        }),
      okText: 'Confirm',
      cancelText: 'Cancel',
    })
  }

  const handleDeleteList = () => {
    const ids = selectedIDs.value
    Modal.confirm({
      title: `Are you sure you want to delete ${ids.length} announcements?`,
      content: 'Unrecoverable after deletion',
      centered: true,
      onOk: () =>
        deleteAnnouncements(ids).then(() => {
          refreshData()
        }),
      okText: 'Confirm',
      cancelText: 'Cancel',
    })
  }

  const handleSubmit = (announcement: AnnouncementType) => {
    if (activeEditData.value) {
      submitting
        .promise(
          putAnnouncement({
            ...activeEditData.value,
            ...announcement,
          })
        )
        .then(() => {
          closeModal()
          refreshData()
        })
    } else {
      submitting.promise(createAnnouncement(announcement)).then(() => {
        closeModal()
        refreshData()
      })
    }
  }

  useWatch(
    () => filterParams.state,
    () => fetchData()
  )

  onMounted(() => {
    fetchData()
  })

  return (
    <Card
      title={`Announcement list (${announcement.pagination?.total ?? '-'}）`}
      bordered={false}
      className={styles.announcement}
      extra={
        <Button type="primary" size="small" icon={<Icon.PlusOutlined />} onClick={createNewData}>
          Make a new announcement
        </Button>
      }
    >
      <Space align="center" className={styles.toolbar}>
        <Space>
          <Select
            className={styles.selec}
            loading={loading.state.value}
            value={filterParams.state}
            onChange={(state) => {
              filterParams.state = state
            }}
            options={[
              { label: 'All status', value: SELECT_ALL_VALUE },
              ...STATE_IDS.map((state) => {
                const target = ps(state)
                return {
                  value: target.id,
                  label: (
                    <Space>
                      {target.icon}
                      {target.name}
                    </Space>
                  ),
                }
              }),
            ]}
          />
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
            onClick={() => resetParamsAndRefresh()}
          >
            Reset
          </Button>
        </Space>
        <Space>
          <DropdownMenu
            disabled={!selectedIDs.value.length}
            options={[
              {
                label: 'Batch deletion',
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
          <Table<AnnouncementType>
            rowKey="_id"
            dataSource={announcement.data}
            rowSelection={{
              selectedRowKeys: selectedIDs.value,
              onChange: handleSelect,
            }}
            pagination={{
              pageSizeOptions: ['10', '20', '50'],
              current: announcement.pagination?.current_page,
              pageSize: announcement.pagination?.per_page,
              total: announcement.pagination?.total,
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
                title: 'Content',
                dataIndex: 'content',
              },
              {
                title: 'Release time',
                dataIndex: 'create_at',
                width: 180,
                render: (_, ann) => stringToYMD(ann.create_at),
              },
              {
                title: 'Status',
                width: 120,
                dataIndex: 'state',
                render: (_, ann) => {
                  const state = ps(ann.state)
                  return (
                    <Tag icon={state.icon} color={state.color}>
                      {state.name}
                    </Tag>
                  )
                },
              },
              {
                title: 'Actions',
                width: 160,
                dataIndex: 'actions',
                render: (_, ann, index) => (
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
                      onClick={() => handleDelete(ann._id!)}
                    >
                      Delete
                    </Button>
                  </Button.Group>
                ),
              },
            ]}
          />
        </ConfigProvider>
      </Spin>
      <EditModal
        title={activeEditData.value ? 'Edit' : 'New announcement'}
        loading={submitting.state.value}
        visible={isVisibleModal}
        announcement={activeEditData}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </Card>
  )
}
