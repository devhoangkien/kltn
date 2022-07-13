import React from 'react'
import { Link } from 'react-router-dom'
import { Table, Button, Typography, Card, Tag, Space, ConfigProvider } from 'antd'
import * as Icon from '@ant-design/icons'
import { RouteKey, rc } from '@/routes'
import { Pagination } from '@/constants/request'
import { Article } from '@/constants/article'
import { ao } from '@/constants/article/origin'
import { ap } from '@/constants/article/public'
import { PublishState, ps } from '@/constants/publish'
import { stringToYMD } from '@/transforms/date'
import { getBlogArticleUrl } from '@/transforms/url'

export interface ArticleListTableProps {
  loading: boolean
  data: Array<Article>
  pagination: Pagination
  selectedIds: Array<string>
  onSelecte(ids: Array<any>): any
  onPagination(page: number, pageSize?: number): any
  onUpdateState(comment: Article, state: PublishState): any
}
const tableEmpty = () => {
  ;<p>No Data</p>
}

export const ArticleListTable: React.FC<ArticleListTableProps> = (props) => {
  return (
    <ConfigProvider renderEmpty={tableEmpty}>
      <Table<Article>
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
            title: 'Article',
            width: 350,
            dataIndex: 'content',
            render: (_, comment) => (
              <Card
                size="small"
                bordered={false}
                bodyStyle={{
                  minHeight: '100px',
                  backdropFilter: 'blur(2px)',
                }}
                style={{
                  maxWidth: '400px',
                  margin: '1rem 0',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  minHeight: '100px',
                  backgroundImage: `url("${comment.thumb}")`,
                  backgroundBlendMode: 'soft-light',
                }}
              >
                <Card.Meta
                  title={
                    <Typography.Title style={{ marginTop: '5px' }} level={5}>
                      {comment.title}
                    </Typography.Title>
                  }
                  description={
                    <Typography.Paragraph
                      type="secondary"
                      style={{ marginBottom: '5px' }}
                      ellipsis={{ rows: 2, expandable: true }}
                    >
                      {comment.description}
                    </Typography.Paragraph>
                  }
                />
              </Card>
            ),
          },
          {
            title: 'Categorize',
            width: 30,
            dataIndex: 'create_at',
            render(_, article) {
              return (
                <Space direction="vertical">
                  {article.category.map((category) => (
                    <Space size="small" key={category._id}>
                      <Icon.FolderOpenOutlined />
                      {category.name}
                    </Space>
                  ))}
                  <Space size="small" wrap={true}>
                    {article.tag.map((tag) => (
                      <Tag icon={<Icon.TagOutlined />} key={tag._id}>
                        {tag.name}
                      </Tag>
                    ))}
                  </Space>
                </Space>
              )
            },
          },
          {
            title: 'Followed',
            width: 150,
            dataIndex: 'create_at',
            render(_, article) {
              return (
                <Space direction="vertical">
                  <Space size="small">
                    <Icon.EyeOutlined />
                    {article.meta?.views} views
                  </Space>
                  <Space size="small">
                    <Icon.HeartOutlined />
                    {article.meta?.likes} likes
                  </Space>
                  <Space size="small">
                    <Icon.CommentOutlined />
                    {article.meta?.comments} comments
                  </Space>
                </Space>
              )
            },
          },
          {
            title: 'Time',
            width: 230,
            dataIndex: 'create_at',
            render(_, article) {
              return (
                <Space direction="vertical">
                  <span> Create:{stringToYMD(article.create_at!)}</span>
                  <span> Update:{stringToYMD(article.update_at!)}</span>
                </Space>
              )
            },
          },
          {
            title: 'State',
            width: 120,
            dataIndex: 'state',
            render: (_, article) => {
              const _state = ps(article.state)
              const _public = ap(article.public)
              const _origin = ao(article.origin)
              return (
                <Space direction="vertical">
                  {[_state, _public, _origin].map((s) => (
                    <Tag icon={s.icon} color={s.color} key={s.id}>
                      {s.name}
                    </Tag>
                  ))}
                </Space>
              )
            },
          },
          {
            title: 'Action',
            width: 110,
            dataIndex: 'actions',
            render: (_, article) => (
              <Space direction="vertical">
                <Link to={rc(RouteKey.ArticleEdit).pather!(article._id!)}>
                  <Button size="small" type="text" block={true} icon={<Icon.EditOutlined />}>
                    Article details
                  </Button>
                </Link>
                {article.state === PublishState.Draft && (
                  <Button
                    size="small"
                    type="text"
                    block={true}
                    icon={<Icon.CheckOutlined />}
                    onClick={() => props.onUpdateState(article, PublishState.Published)}
                  >
                    <Typography.Text type="success">Publish release</Typography.Text>
                  </Button>
                )}
                {article.state === PublishState.Published && (
                  <Button
                    size="small"
                    type="text"
                    block={true}
                    danger={true}
                    icon={<Icon.DeleteOutlined />}
                    onClick={() => props.onUpdateState(article, PublishState.Recycle)}
                  >
                    Recycle Bin
                  </Button>
                )}
                {article.state === PublishState.Recycle && (
                  <Button
                    size="small"
                    type="text"
                    block={true}
                    icon={<Icon.RollbackOutlined />}
                    onClick={() => props.onUpdateState(article, PublishState.Draft)}
                  >
                    <Typography.Text type="warning">Back to draft</Typography.Text>
                  </Button>
                )}
                <Button
                  size="small"
                  block={true}
                  type="link"
                  target="_blank"
                  icon={<Icon.LinkOutlined />}
                  href={getBlogArticleUrl(article.id!)}
                >
                  View page
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </ConfigProvider>
  )
}
