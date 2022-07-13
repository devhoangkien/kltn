import React from 'react'
import { Ref, useWatch, useRef } from 'veact'
import { useLoading } from 'veact-use'
import {
  Form,
  Typography,
  Input,
  InputNumber,
  Button,
  Divider,
  Select,
  Drawer,
  Space,
  Spin,
} from 'antd'
import * as Icon from '@ant-design/icons'
import { UniversalText } from '@/components/common/UniversalText'
import { UniversalEditor } from '@/components/common/UniversalEditor/lazy'
import { FormDataKeyValue } from '@/components/common/FormDataKeyValue'
import { IPLocation } from '@/components/common/IPLocation'
import { getArticle } from '@/store/article'
import { Article } from '@/constants/article'
import { Comment, commentStates, COMMENT_GUESTBOOK_POST_ID } from '@/constants/comment'
import { stringToYMD } from '@/transforms/date'
import { getBlogURLByPostID } from '@/transforms/url'
import { parseBrowser, parseOS } from '@/transforms/ua'
import { CommentAvatar } from './Avatar'

export interface EditDrawerProps {
  loading: boolean
  visible: Ref<boolean>
  comment: Ref<Comment | null>
  onSubmit(comment: Comment): void
  onCancel(): void
}

export const EditDrawer: React.FC<EditDrawerProps> = (props) => {
  const [form] = Form.useForm<Comment>()
  const loadingComment = useLoading()
  const commentArticle = useRef<Article | null>(null)
  const handleSubmit = () => {
    form.validateFields().then((formValue) => {
      props.onSubmit(formValue)
    })
  }

  const fetchArticle = (articleId: number) => {
    loadingComment.promise(getArticle(articleId)).then((result) => {
      commentArticle.value = result
    })
  }

  useWatch(props.visible, (visible) => {
    if (visible) {
      const targetComment = props.comment.value
      form.setFieldsValue(targetComment || {})
      if (targetComment) {
        if (targetComment.post_id !== COMMENT_GUESTBOOK_POST_ID) {
          fetchArticle(targetComment.post_id)
        }
      }
    } else {
      form.resetFields()
    }
  })

  return (
    <Drawer
      width="46rem"
      title="Comment details"
      visible={props.visible.value}
      onClose={props.onCancel}
      destroyOnClose={true}
    >
      <Spin spinning={props.loading}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          scrollToFirstError={true}
          colon={false}
          form={form}
        >
          <Form.Item label="ID">
            <Typography.Text copyable={true}>{props.comment.value?.id}</Typography.Text>
            <Divider type="vertical" />
            <Typography.Text copyable={true}>{props.comment.value?._id}</Typography.Text>
          </Form.Item>
          <Form.Item label="Posted on">{stringToYMD(props.comment.value?.create_at!)}</Form.Item>
          <Form.Item label="Updated on">{stringToYMD(props.comment.value?.update_at!)}</Form.Item>
          <Form.Item label="Avatar">
            <CommentAvatar size="large" comment={props.comment.value!} />
          </Form.Item>
          <Form.Item
            name={['author', 'name']}
            label="User's Nickname"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input prefix={<Icon.UserOutlined />} />
          </Form.Item>
          <Form.Item
            name={['author', 'email']}
            label="User Email"
            rules={[
              {
                message: 'Please enter your email',
                type: 'email',
              },
            ]}
          >
            <Input prefix={<Icon.MailOutlined />} placeholder="email" type="email" />
          </Form.Item>
          <Form.Item
            name={['author', 'site']}
            label="User URL"
            rules={[
              {
                message: 'Please enter the correct URL',
                type: 'url',
              },
            ]}
          >
            <Input
              prefix={<Icon.LinkOutlined />}
              type="url"
              placeholder="URL"
              suffix={
                <Icon.SendOutlined
                  onClick={() => {
                    const url = props.comment.value?.author.site
                    if (url) {
                      window.open(url)
                    }
                  }}
                />
              }
            />
          </Form.Item>
          <Form.Item label="IP address">
            <UniversalText text={props.comment.value?.ip} copyable={true} />
          </Form.Item>
          <Form.Item label="IP location">
            <IPLocation data={props.comment.value?.ip_location} fullname={true} />
          </Form.Item>
          <Form.Item label="Terminal">
            {parseBrowser(props.comment.value?.agent!)}
            <Divider type="vertical" />
            {parseOS(props.comment.value?.agent!)}
          </Form.Item>
          <Form.Item name="likes" label="Liked" rules={[{ required: true, message: 'Required' }]}>
            <InputNumber addonBefore={<Icon.LikeOutlined />} placeholder="How many" />
          </Form.Item>
          <Form.Item
            name="dislikes"
            label="Disliked"
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber addonBefore={<Icon.DislikeOutlined />} placeholder="How many" />
          </Form.Item>
          <Form.Item label="Page">
            <Button
              type="link"
              target="_blank"
              icon={<Icon.LinkOutlined />}
              href={getBlogURLByPostID(props.comment.value?.post_id!)}
            >
              {props.comment.value?.post_id === COMMENT_GUESTBOOK_POST_ID
                ? 'Message board'
                : commentArticle.value?.title}
              <Divider type="vertical" />
              <span>#{props.comment.value?.id}</span>
            </Button>
          </Form.Item>
          {Boolean(props.comment.value?.pid) && (
            <Form.Item label="Parent comment">
              <Typography.Text strong>#{props.comment.value?.pid}</Typography.Text>
            </Form.Item>
          )}
          <Form.Item name="state" label="Status" rules={[{ required: true, message: 'Please select a status' }]}>
            <Select
              placeholder="Select status"
              options={commentStates.map((state) => {
                return {
                  value: state.id,
                  label: (
                    <Space>
                      {state.icon}
                      {state.name}
                    </Space>
                  ),
                }
              })}
            />
          </Form.Item>
          <Form.Item
            label="Comments"
            name="content"
            rules={[{ required: true, message: 'Please enter comment' }]}
          >
            <UniversalEditor
              disabledMinimap={true}
              disabledCacheDraft={true}
              minRows={14}
              maxRows={18}
            />
          </Form.Item>
          <Form.Item
            label="Custom extension"
            extra="You can add custom extended attributes for the current comment"
            shouldUpdate={true}
          >
            <FormDataKeyValue fieldName="extends" />
          </Form.Item>
          <Form.Item label=" ">
            <Button
              icon={<Icon.CheckOutlined />}
              type="primary"
              loading={props.loading}
              onClick={handleSubmit}
            >
              Submit an update
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  )
}
