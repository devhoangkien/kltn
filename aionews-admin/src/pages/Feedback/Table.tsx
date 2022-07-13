import React from 'react'
import { Table, Button, Typography, Popover, Space, Statistic } from 'antd'
import * as Icon from '@ant-design/icons'
import { Placeholder } from '@/components/common/Placeholder'
import { UniversalText } from '@/components/common/UniversalText'
import { IPLocation } from '@/components/common/IPLocation'
import { Pagination } from '@/constants/request'
import { Feedback, getMarkedByBoolean } from '@/constants/feedback'
import { parseBrowser, parseOS } from '@/transforms/ua'
import { stringToYMD } from '@/transforms/date'

import styles from './style.module.less'

export interface FeedbackListTableProps {
  loading: boolean
  data: Array<Feedback>
  pagination: Pagination
  selectedIds: Array<string>
  onTargetID(id: number): any
  onSelecte(ids: Array<any>): any
  onPagination(page: number, pageSize?: number): any
  onDetail(feedback: Feedback, index: number): any
  onDelete(feedback: Feedback, index: number): any
}
export const FeedbackListTable: React.FC<FeedbackListTableProps> = (props) => {
  return (
    <Table<Feedback>
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
          title: 'TID',
          width: 40,
          dataIndex: 'tid',
        },
        {
          title: 'Marked',
          width: 60,
          align: 'center',
          dataIndex: 'marked',
          render: (_, feedback) => getMarkedByBoolean(feedback.marked).icon,
        },
        {
          title: 'Score',
          width: 80,
          align: 'center',
          dataIndex: 'emotion',
          render: (_, feedback) => (
            <Statistic prefix={feedback.emotion_emoji} value={feedback.emotion} />
          ),
        },
        {
          title: 'Content',
          dataIndex: 'content',
          render: (_, feedback) => (
            <Typography.Paragraph
              className={styles.content}
              ellipsis={{ rows: 3, expandable: true }}
            >
              {feedback.content}
            </Typography.Paragraph>
          ),
        },
        {
          title: 'Remark',
          width: 180,
          dataIndex: 'remark',
          render: (_, feedback) => (
            <Placeholder data={feedback.remark || null}>
              {(remark) => (
                <Typography.Paragraph
                  className={styles.content}
                  ellipsis={{ rows: 3, expandable: true }}
                >
                  {remark}
                </Typography.Paragraph>
              )}
            </Placeholder>
          ),
        },
        {
          title: 'Posted on',
          width: 200,
          dataIndex: 'agent',
          render(_, feedback) {
            return (
              <Space direction="vertical">
                <Popover
                  title="Terminal information"
                  placement="right"
                  content={
                    <div>
                      <Typography.Paragraph>
                        <UniversalText prefix="User:" text={feedback.user_name} />
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        <UniversalText prefix="Email:" text={feedback.user_email} copyable={true} />
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        <UniversalText prefix="Source:" text={feedback.origin} copyable={true} />
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        <UniversalText prefix="IP:" text={feedback.ip || void 0} copyable={true} />
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        Location: <IPLocation data={feedback.ip_location} />
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        Browser: {parseBrowser(feedback.user_agent)}
                      </Typography.Paragraph>
                      <div>System: {parseOS(feedback.user_agent)}</div>
                    </div>
                  }
                >
                  <span>
                    <UniversalText
                      prefix={<Icon.UserOutlined />}
                      text={feedback.user_name}
                      placeholder="Anonymous"
                    />
                  </span>
                </Popover>

                <UniversalText
                  prefix={<Icon.ClockCircleOutlined />}
                  text={stringToYMD(feedback.create_at!)}
                />
              </Space>
            )
          },
        },
        {
          title: 'Action',
          width: 120,
          dataIndex: 'actions',
          render: (_, feedback, index) => (
            <Space direction="vertical">
              <Button
                size="small"
                type="text"
                block={true}
                icon={<Icon.EditOutlined />}
                onClick={() => props.onDetail(feedback, index)}
              >
                Details
              </Button>
              <Button
                size="small"
                type="text"
                danger={true}
                block={true}
                icon={<Icon.DeleteOutlined />}
                onClick={() => props.onDelete(feedback, index).onCancel().onOk()}
              >
                Delete
              </Button>
            </Space>
          ),
        },
      ]}
    />
  )
}
