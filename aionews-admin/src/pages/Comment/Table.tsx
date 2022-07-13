import React from 'react'
import { Table, Button, Typography, Popover, Tag, Space, ConfigProvider } from 'antd'
import * as Icon from '@ant-design/icons'
import { UniversalText } from '@/components/common/UniversalText'
import { Placeholder } from '@/components/common/Placeholder'
import { IPLocation } from '@/components/common/IPLocation'
import { Pagination } from '@/constants/request'
import { Comment, CommentState, cs } from '@/constants/comment'
import { parseBrowser, parseOS } from '@/transforms/ua'
import { stringToYMD } from '@/transforms/date'
import { getBlogURLByPostID } from '@/transforms/url'
import { CommentAvatar } from './Avatar'

import styles from './style.module.less'

export interface CommentListTableProps {
  loading: boolean
  data: Array<Comment>
  pagination: Pagination
  selectedIds: Array<string>
  onPostId(id: number): any
  onSelecte(ids: Array<any>): any
  onPagination(page: number, pageSize?: number): any
  onDetail(comment: Comment, index: number): any
  onDelete(comment: Comment, index: number): any
  onUpdateState(comment: Comment, state: CommentState): any
}
const tableEmpty = () => {
  ; <p>No Data</p>
}
export const CommentListTable: React.FC<CommentListTableProps> = (props) => {
  return (
    <ConfigProvider renderEmpty={tableEmpty}>
      <Table<Comment>
        rowKey="_id"
        loading={props.loading}
        dataSource={props.data}
        rowSelection={{
          selectedRowKeys: props.selectedIds,
          onChange: props.onSelecte,
        }}
        pagination={{
          pageSizeOptions: ['10', '20', '50'],
          current: props.pagination?.current_page,
          pageSize: props.pagination?.per_page,
          total: props.pagination?.total,
          showSizeChanger: false,
          onChange: props.onPagination,
        }}
        columns={[
          {
            title: 'ID',
            width: 40,
            dataIndex: 'id',
          },
          {
            title: 'PID',
            width: 40,
            dataIndex: 'pid',
            render: (_, comment) => <UniversalText text={comment.pid} />,
          },
          {
            title: 'POST_ID',
            width: 40,
            dataIndex: 'post_id',
            render(_, comment) {
              return (
                <Button size="small" type="ghost" onClick={() => props.onPostId(comment.post_id)}>
                  {comment.post_id}
                </Button>
              )
            },
          },
          {
            title: 'Comments',
            dataIndex: 'content',
            render: (_, comment) => (
              <Typography.Paragraph
                className={styles.content}
                ellipsis={{ rows: 6, expandable: true }}
              >
                {comment.content}
              </Typography.Paragraph>
            ),
          },
          {
            title: 'Personal information',
            width: 280,
            dataIndex: 'author',
            render(_, comment) {
              return (
                <Space direction="vertical">
                  <Space>
                    <CommentAvatar comment={comment} />
                    <UniversalText text={comment.author.name} />
                  </Space>
                  <UniversalText
                    placeholder="Left blank"
                    prefix={<Icon.MailOutlined />}
                    text={comment.author.email}
                    copyable={true}
                  />
                  <Space size="small">
                    <Icon.LinkOutlined />
                    <Placeholder data={comment.author.site} placeholder="Left blank">
                      {(site) => (
                        <Popover placement="top" content={site}>
                          <Typography.Link target="_blank" rel="noreferrer" href={site}>
                            Click to open
                          </Typography.Link>
                        </Popover>
                      )}
                    </Placeholder>
                  </Space>
                </Space>
              )
            },
          },
          {
            title: 'Posted on',
            width: 210,
            dataIndex: 'agent',
            render(_, comment) {
              return (
                <Space direction="vertical">
                  <UniversalText
                    prefix={<Icon.GlobalOutlined />}
                    text={comment.ip}
                    copyable={true}
                  />
                  <Space size="small">
                    <Icon.CompassOutlined />
                    <IPLocation data={comment.ip_location} />
                  </Space>
                  <Space size="small">
                    <Icon.DesktopOutlined />
                    <Popover
                      title="Terminal information"
                      placement="right"
                      content={
                        <div>
                          <p>Browser:{parseBrowser(comment.agent)}</p>
                          <div>System:{parseOS(comment.agent)}</div>
                        </div>
                      }
                    >
                      {parseBrowser(comment.agent)}
                    </Popover>
                  </Space>
                  <UniversalText
                    prefix={<Icon.ClockCircleOutlined />}
                    text={stringToYMD(comment.create_at!)}
                  />
                </Space>
              )
            },
          },
          {
            title: 'Status',
            width: 120,
            dataIndex: 'state',
            render: (_, comment) => {
              const state = cs(comment.state)
              return (
                <Space direction="vertical">
                  <Tag icon={<Icon.LikeOutlined />} color={comment.likes > 0 ? 'red' : undefined}>
                    {comment.likes} liked
                  </Tag>
                  <Tag
                    icon={<Icon.DislikeOutlined />}
                    color={comment.dislikes > 0 ? 'gold' : undefined}
                  >
                    {comment.dislikes} disliked
                  </Tag>
                  <Tag icon={state.icon} color={state.color}>
                    {state.name}
                  </Tag>
                  <Tag icon={<Icon.LineHeightOutlined />}>{comment.content.length} Character</Tag>
                </Space>
              )
            },
          },
          {
            title: 'Action',
            width: 110,
            dataIndex: 'actions',
            render: (_, comment, index) => (
              <Space direction="vertical">
                <Button
                  size="small"
                  type="text"
                  block={true}
                  icon={<Icon.EditOutlined />}
                  onClick={() => props.onDetail(comment, index)}
                >
                  Details
                </Button>
                {comment.state === CommentState.Auditing && (
                  <Button
                    size="small"
                    type="text"
                    block={true}
                    icon={<Icon.CheckOutlined />}
                    onClick={() => props.onUpdateState(comment, CommentState.Published)}
                  >
                    <Typography.Text type="success">Published</Typography.Text>
                  </Button>
                )}
                {comment.state === CommentState.Published && (
                  <Button
                    size="small"
                    type="text"
                    block={true}
                    danger={true}
                    icon={<Icon.StopOutlined />}
                    onClick={() => props.onUpdateState(comment, CommentState.Spam)}
                  >
                    Spam
                  </Button>
                )}
                {(comment.state === CommentState.Auditing ||
                  comment.state === CommentState.Published) && (
                    <Button
                      size="small"
                      type="text"
                      block={true}
                      danger={true}
                      icon={<Icon.DeleteOutlined />}
                      onClick={() => props.onUpdateState(comment, CommentState.Deleted)}
                    >
                      Recycle Bin
                    </Button>
                  )}
                {(comment.state === CommentState.Deleted ||
                  comment.state === CommentState.Spam) && (
                    <>
                      <Button
                        size="small"
                        type="text"
                        block={true}
                        icon={<Icon.EditOutlined />}
                        onClick={() => props.onUpdateState(comment, CommentState.Auditing)}
                      >
                        <Typography.Text type="warning">Back to draft</Typography.Text>
                      </Button>
                      <Button
                        size="small"
                        type="text"
                        danger={true}
                        block={true}
                        icon={<Icon.DeleteOutlined />}
                        onClick={() => props.onDelete(comment, index)}
                      >
                        Remove completely
                      </Button>
                    </>
                  )}
                <Button
                  size="small"
                  block={true}
                  type="link"
                  target="_blank"
                  icon={<Icon.LinkOutlined />}
                  href={getBlogURLByPostID(comment.post_id)}
                >
                  Page
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </ConfigProvider>
  )
}
