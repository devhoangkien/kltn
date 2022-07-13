/**
 * @file Comment list page
 */

import _ from 'lodash'
import classnames from 'classnames'
import React from 'react'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import {
  useShallowReactive,
  useRef,
  onMounted,
  useReactive,
  useWatch,
  toRaw,
  batchedUpdates,
  useComputed,
} from 'veact'
import { useLoading } from 'veact-use'
import { Button, Card, Input, Select, Divider, Modal, Space, message } from 'antd'
import * as Icon from '@ant-design/icons'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import { SortSelect } from '@/components/common/SortSelect'
import {
  getComments,
  GetCommentsParams,
  deleteComments,
  putComment,
  reviseCommentIPLocation,
  updateCommentsState,
} from '@/store/comment'
import {
  Comment as CommentType,
  CommentState,
  commentStates,
  COMMENT_GUESTBOOK_POST_ID,
  cs,
} from '@/constants/comment'
import { ResponsePaginationData } from '@/constants/request'
import { SortTypeWithHot } from '@/constants/sort'
import { scrollTo } from '@/services/scroller'
import { getBlogGuestbookUrl } from '@/transforms/url'
import { CommentListTable } from './Table'
import { EditDrawer } from './EditDrawer'

import styles from './style.module.less'

const LIST_ALL_VALUE = 'ALL'
const SELECT_ALL_VALUE = 'ALL'
const DEFAULT_FILTER_PARAMS = Object.freeze({
  postId: LIST_ALL_VALUE as number | typeof LIST_ALL_VALUE,
  state: SELECT_ALL_VALUE as typeof SELECT_ALL_VALUE | CommentState,
  sort: SortTypeWithHot.Desc,
})

export const CommentPage: React.FC = () => {
  // params
  const location = useLocation()
  const { post_id } = queryString.parse(location.search)
  const postIdParam = post_id ? Number(post_id) : undefined

  // comments
  const loading = useLoading()
  const submitting = useLoading()
  const comment = useShallowReactive<ResponsePaginationData<CommentType>>({
    data: [],
    pagination: undefined,
  })

  // filter parameter
  const serarchKeyword = useRef('')
  const filterParams = useReactive({
    ...DEFAULT_FILTER_PARAMS,
    postId: postIdParam || DEFAULT_FILTER_PARAMS.postId,
  })
  const updatePostId = (postId: number | string) => {
    filterParams.postId = Number(postId)
  }

  // Multiple choice
  const selectedIds = useRef<Array<string>>([])
  const selectComments = useComputed(() =>
    comment.data.filter((c) => selectedIds.value.includes(c._id!))
  )
  const handleSelect = (ids: any[]) => {
    selectedIds.value = ids
  }

  // edit
  const activeEditDataIndex = useRef<number | null>(null)
  const isVisibleModal = useRef(false)
  const activeEditData = useComputed(() => {
    const index = activeEditDataIndex.value
    return index !== null ? comment.data[index] : null
  })
  const closeModal = () => {
    isVisibleModal.value = false
  }
  const editData = (index: number) => {
    activeEditDataIndex.value = index
    isVisibleModal.value = true
  }

  const fetchData = (params?: GetCommentsParams) => {
    const getParams = {
      ...params,
      sort: filterParams.sort,
      post_id: filterParams.postId !== LIST_ALL_VALUE ? filterParams.postId : undefined,
      state: filterParams.state !== SELECT_ALL_VALUE ? filterParams.state : undefined,
      keyword: Boolean(serarchKeyword.value) ? serarchKeyword.value : undefined,
    }

    loading.promise(getComments(getParams)).then((response) => {
      comment.data = response.data
      comment.pagination = response.pagination
      scrollTo(document.body)
    })
  }

  const resetParamsAndRefresh = () => {
    serarchKeyword.value = ''
    if (_.isEqual(toRaw(filterParams), DEFAULT_FILTER_PARAMS)) {
      fetchData()
    } else {
      batchedUpdates(() => {
        filterParams.state = DEFAULT_FILTER_PARAMS.state
        filterParams.sort = DEFAULT_FILTER_PARAMS.sort
        filterParams.postId = DEFAULT_FILTER_PARAMS.postId
      })
    }
  }

  const refreshData = () => {
    fetchData({
      page: comment.pagination?.current_page,
      per_page: comment.pagination?.per_page,
    })
  }

  const handleDelete = (comments: Array<CommentType>) => {
    Modal.confirm({
      title: `Are you sure you want to delete ${comments.length} comments completely?`,
      content: 'This behavior is physical deletion and cannot be recovered!',
      centered: true,
      onOk: () =>
        deleteComments(
          comments.map((c) => c._id!),
          _.uniq(comments.map((c) => c.post_id))
        ).then(() => {
          refreshData()
        }),
      okText: 'Delete',
      cancelText: 'Cancel',
    })
  }

  const handleStateChange = (comments: Array<CommentType>, state: CommentState) => {
    Modal.confirm({
      title: `Are you sure you want to update ${comments.length} comments to state " ${cs(state).name
        } "?`,
      content: 'Action is irreversible',
      centered: true,
      onOk: () =>
        updateCommentsState(
          comments.map((c) => c._id!),
          _.uniq(comments.map((c) => c.post_id)),
          state
        ).then(() => {
          refreshData()
        }),
      okText: 'Update',
      cancelText: 'Cancel',
    })
  }

  const handleSubmit = (comment: CommentType) => {
    submitting
      .promise(
        putComment({
          ...activeEditData.value,
          ...comment,
        })
      )
      .then(() => {
        closeModal()
        refreshData()
      })
  }

  const ipLocationTask = useShallowReactive({
    done: [] as string[],
    fail: [] as string[],
    todo: [] as string[],
    running: false,
  })

  const doIPLocationTask = () => {
    const doRevise = async (commentID: string) => {
      try {
        await reviseCommentIPLocation(commentID)
        ipLocationTask.done.push(commentID)
      } catch (error) {
        ipLocationTask.fail.push(commentID)
      } finally {
        ipLocationTask.todo = ipLocationTask.todo.slice().filter((id) => id !== commentID)
      }
    }

    if (ipLocationTask.todo.length) {
      ipLocationTask.running = true
      doRevise(ipLocationTask.todo[0]).then(() => {
        // Delay 3 seconds
        window.setTimeout(() => doIPLocationTask(), 3000)
      })
    } else {
      ipLocationTask.running = false
      const messages = [
        'mission over',
        `done: ${ipLocationTask.done.length}`,
        `fail: ${ipLocationTask.fail.length}`,
      ]
      message.info(messages.join(','))
    }
  }

  const handleReviseComemntsIPLocation = () => {
    const todoCommentIDs = comment.data
      .filter((c) => Boolean(c.ip) && !c.ip_location?.region_code)
      .map((c) => c._id!)
    if (todoCommentIDs.length) {
      ipLocationTask.todo.push(...todoCommentIDs)
      doIPLocationTask()
      message.info(`Start task, a total of ${todoCommentIDs.length} data`)
    } else {
      message.info('No data to correct')
    }
  }

  useWatch(filterParams, () => fetchData())

  onMounted(() => {
    fetchData()
  })

  return (
    <Card
      title={`Comment list(${comment.pagination?.total ?? '-'})`}
      bordered={false}
      className={styles.comment}
      extra={
        <Space>
          <Button.Group>
            {ipLocationTask.running && (
              <Button
                size="small"
                onClick={() => {
                  Modal.info({
                    title: 'Mission Details',
                    content: JSON.stringify(ipLocationTask, null, 2),
                    onOk() {
                      this.okText = 'OK'
                    },
                    onCancel() {
                      this.cancelText = 'Cancel'
                    },
                  })
                }}
              >
                TODO: {ipLocationTask.todo.length}
                <Divider type="vertical" />
                DONE: {ipLocationTask.done.length}
                <Divider type="vertical" />
                FAIL: {ipLocationTask.fail.length}
              </Button>
            )}
            <Button
              size="small"
              icon={<Icon.GlobalOutlined />}
              disabled={ipLocationTask.running}
              loading={ipLocationTask.running}
              onClick={() => handleReviseComemntsIPLocation()}
            >
              Correct the data on this page IP location
            </Button>
          </Button.Group>
          <Button
            type="primary"
            size="small"
            target="_blank"
            icon={<Icon.RocketOutlined />}
            href={getBlogGuestbookUrl()}
          >
            Message board
          </Button>
        </Space>
      }
    >
      <Space align="center" className={styles.toolbar}>
        <Space>
          <Select
            className={classnames(styles.select, styles.type)}
            loading={loading.state.value}
            value={filterParams.postId}
            onChange={(postId) => {
              filterParams.postId = postId
            }}
            options={[
              {
                value: LIST_ALL_VALUE,
                label: 'All comments',
              },
              {
                value: COMMENT_GUESTBOOK_POST_ID,
                label: 'Leave a comment',
              },
            ]}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <div className={styles.postIdInput}>
                  <Input.Search
                    allowClear={true}
                    size="small"
                    type="number"
                    className={styles.input}
                    placeholder="POST_ID"
                    enterButton={<span>GO</span>}
                    onSearch={updatePostId}
                  />
                </div>
              </div>
            )}
          />
          <Select
            className={styles.select}
            loading={loading.state.value}
            value={filterParams.state}
            onChange={(state) => {
              filterParams.state = state
            }}
            options={[
              { label: 'All status', value: SELECT_ALL_VALUE },
              ...commentStates.map((state) => {
                return {
                  value: state.id,
                  label: (
                    <Space>
                      {state.icon}
                      {state.name}
                    </Space>
                  ),
                }
              }),
            ]}
          />
          <SortSelect
            className={styles.select}
            withHot={true}
            loading={loading.state.value}
            value={filterParams.sort}
            onChange={(sort) => {
              filterParams.sort = sort
            }}
          />
          <Input.Search
            className={styles.search}
            placeholder="Enter comment content, author information search"
            loading={loading.state.value}
            onSearch={() => fetchData()}
            value={serarchKeyword.value}
            onChange={(event) => {
              serarchKeyword.value = event.target.value
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
            disabled={!selectedIds.value.length}
            options={[
              {
                label: 'Back to draft',
                icon: <Icon.EditOutlined />,
                onClick: () => handleStateChange(selectComments.value, CommentState.Auditing),
              },
              {
                label: 'Published',
                icon: <Icon.CheckOutlined />,
                onClick: () => handleStateChange(selectComments.value, CommentState.Published),
              },
              {
                label: 'Spam',
                icon: <Icon.StopOutlined />,
                onClick: () => handleStateChange(selectComments.value, CommentState.Spam),
              },
              {
                label: 'Recycle Bin',
                icon: <Icon.DeleteOutlined />,
                onClick: () => handleStateChange(selectComments.value, CommentState.Deleted),
              },
              {
                label: 'Remove completely',
                icon: <Icon.DeleteOutlined />,
                onClick: () => handleDelete(selectComments.value),
              },
            ]}
          >
            Bulk operations
          </DropdownMenu>
        </Space>
      </Space>
      <Divider />
      <CommentListTable
        loading={loading.state.value}
        selectedIds={selectedIds.value}
        onSelecte={handleSelect}
        data={comment.data}
        pagination={comment.pagination!}
        onPostId={updatePostId}
        onDetail={(_, index) => editData(index)}
        onDelete={(comment) => handleDelete([comment])}
        onUpdateState={(comment, state) => handleStateChange([comment], state)}
        onPagination={(page, pageSize) => fetchData({ page, per_page: pageSize })}
      />
      <EditDrawer
        loading={submitting.state.value}
        visible={isVisibleModal}
        comment={activeEditData}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </Card>
  )
}
