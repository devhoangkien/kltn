import React from 'react'
import { Ref, useWatch } from 'veact'
import { Form, Typography, Input, Button, Divider, Drawer, Spin, Radio, Statistic } from 'antd'
import * as Icon from '@ant-design/icons'
import { IPLocation } from '@/components/common/IPLocation'
import { UniversalText } from '@/components/common/UniversalText'
import { Feedback, getMarkedByBoolean } from '@/constants/feedback'
import { stringToYMD } from '@/transforms/date'
import { parseBrowser, parseOS } from '@/transforms/ua'

export interface EditDrawerProps {
  loading: boolean
  visible: Ref<boolean>
  feedback: Ref<Feedback | null>
  onSubmit(feedback: Feedback): void
  onCancel(): void
}

export const EditDrawer: React.FC<EditDrawerProps> = (props) => {
  const [form] = Form.useForm<Feedback>()
  const handleSubmit = () => {
    form.validateFields().then((formValue) => {
      props.onSubmit(formValue)
    })
  }

  useWatch(props.visible, (visible) => {
    if (visible) {
      const targetComment = props.feedback.value
      form.setFieldsValue(targetComment || {})
    } else {
      form.resetFields()
    }
  })

  const getFormElement = (feedback: Feedback) => (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 18 }}
      scrollToFirstError={true}
      colon={false}
      form={form}
    >
      <Form.Item label="ID">
        <Typography.Text copyable={true}>{feedback.id}</Typography.Text>
        <Divider type="vertical" />
        <Typography.Text copyable={true}>{feedback._id}</Typography.Text>
      </Form.Item>
      <Form.Item label="TID">
        <Typography.Text copyable={true}>{feedback.tid}</Typography.Text>
      </Form.Item>
      <Form.Item label="Posted on">{stringToYMD(feedback.create_at!)}</Form.Item>
      <Form.Item label="Updated on">{stringToYMD(feedback.update_at!)}</Form.Item>
      <Form.Item name="marked" label="whether to mark">
        <Radio.Group size="middle">
          <Radio.Button value={false}>{getMarkedByBoolean(false).icon}</Radio.Button>
          <Radio.Button value={true}>{getMarkedByBoolean(true).icon}</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="user_name" label="User's Nickname">
        <Input prefix={<Icon.UserOutlined />} />
      </Form.Item>
      <Form.Item name="user_email" label="User mailbox">
        <Input prefix={<Icon.MailOutlined />} placeholder="email" type="email" />
      </Form.Item>
      <Form.Item label="IP address">
        <UniversalText text={feedback.ip || null} copyable={true} />
      </Form.Item>
      <Form.Item label="IP location">
        <IPLocation data={feedback.ip_location} fullname={true} />
      </Form.Item>
      <Form.Item label="Terminal">
        {parseBrowser(feedback.user_agent!)}
        <Divider type="vertical" />
        {parseOS(feedback.user_agent!)}
      </Form.Item>
      <Form.Item label="Feedback rating">
        <Statistic
          prefix={feedback.emotion_emoji}
          value={`${feedback.emotion_text} (${feedback.emotion})`}
        />
      </Form.Item>
      <Form.Item
        label="Feedback content"
        name="content"
        rules={[{ required: true, message: 'Please enter content' }]}
      >
        <Input.TextArea autoSize={{ minRows: 8, maxRows: 18 }} />
      </Form.Item>
      <Form.Item label="Remark" name="remark">
        <Input.TextArea autoSize={{ minRows: 3, maxRows: 8 }} />
      </Form.Item>
      <Form.Item label=" ">
        <Button
          icon={<Icon.CheckOutlined />}
          type="primary"
          loading={props.loading}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  )

  return (
    <Drawer
      width="46rem"
      title="Feedback details"
      visible={props.visible.value}
      onClose={props.onCancel}
      destroyOnClose={true}
    >
      <Spin spinning={props.loading}>
        {props.feedback.value ? getFormElement(props.feedback.value) : null}
      </Spin>
    </Drawer>
  )
}
