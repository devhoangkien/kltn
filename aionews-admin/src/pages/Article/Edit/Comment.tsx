/**
 * @file Article detail comment list
 */

import React from 'react'
import { Spin, Row, Button, Comment, Divider, Drawer, Empty, Tag, Typography } from 'antd'
import * as Icon from '@ant-design/icons'
import { IPLocation } from '@/components/common/IPLocation'
import { UniversalText } from '@/components/common/UniversalText'
import { CommentAvatar } from '@/pages/Comment/Avatar'
import { cs } from '@/constants/comment'
import { CommentTree } from '@/store/comment'
import { stringToYMD } from '@/transforms/date'
import { parseBrowser, parseOS } from '@/transforms/ua'

interface CommentTreeListProps {
  comments: Array<CommentTree>
}

const CommentTreeList: React.FC<CommentTreeListProps> = (props) => {
  return (
    <>
      {props.comments.map((comment) => (
        <Comment
          key={comment.id}
          datetime={stringToYMD(comment.create_at!)}
          actions={[
            <Typography.Text key="time" type={comment.likes ? 'danger' : 'secondary'}>
              <Icon.HeartOutlined />
              &nbsp;
              {comment.likes} Like
            </Typography.Text>,
            <span key="browser">{parseBrowser(comment.agent!)}</span>,
            <span key="os">{parseOS(comment.agent!)}</span>,
            <UniversalText key="ip" text={comment.ip} copyable={true} type="secondary" />,
          ]}
          author={
            <div>
              {comment.author.site ? (
                <a
                  href={comment.author.site}
                  title={comment.author.site}
                  target="_blank"
                  rel="noreferrer"
                >
                  {comment.author.name}
                </a>
              ) : (
                comment.author.name
              )}
              <Divider type="vertical" />
              <IPLocation key="ip-location" data={comment.ip_location} />
              <Divider type="vertical" />
              <Tag color={cs(comment.state).color} icon={cs(comment.state).icon}>
                {cs(comment.state).name}
              </Tag>
            </div>
          }
          avatar={<CommentAvatar size="large" comment={comment} />}
          content={<Typography.Paragraph>{comment.content}</Typography.Paragraph>}
        >
          <Divider />
          <CommentTreeList comments={comment.children || []} />
        </Comment>
      ))}
    </>
  )
}

export interface ArticleCommentProps {
  visible: boolean
  loading: boolean
  count: number
  comments: Array<CommentTree>
  onClose(): void
  onRefresh(): void
  onManage(): void
}

export const ArticleComment: React.FC<ArticleCommentProps> = (props) => {
  const { visible, loading, count, comments } = props
  return (
    <Drawer
      width="48rem"
      title={`Article comments (${count ?? '-'}）`}
      visible={visible}
      onClose={props.onClose}
      footer={
        <Row justify="space-between" align="bottom">
          <Button
            size="small"
            type="dashed"
            icon={<Icon.ReloadOutlined />}
            loading={loading}
            onClick={props.onRefresh}
          >
            Refresh
          </Button>
          <Button size="small" type="primary" icon={<Icon.EditOutlined />} onClick={props.onManage}>
            Manage Reviews
          </Button>
        </Row>
      }
    >
      <Spin spinning={loading}>
        {!count ? <Empty description="No data" /> : <CommentTreeList comments={comments} />}
      </Spin>
    </Drawer>
  )
}
