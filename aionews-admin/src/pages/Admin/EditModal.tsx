import React from 'react'
import { Ref, useWatch } from 'veact'
import { Form, Input, Modal, Divider, Typography, Card, Spin } from 'antd'

import { FormDataKeyValue } from '@/components/common/FormDataKeyValue'
import { User as UserType } from '@/constants/user'
import { stringToYMD } from '@/transforms/date'
import { ImageUploader } from '@/components/common/ImageUploader'

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
}

export interface EditModalProps {
  title: string
  loading: boolean
  visible: Ref<boolean>
  user: Ref<UserType | null>
  onSubmit(user: UserType): void
  onCancel(): void
}

export const EditModal: React.FC<EditModalProps> = (props) => {
  const [form] = Form.useForm<UserType>()
  const handleSubmit = () => {
    form.validateFields().then(props.onSubmit)
  }

  useWatch(props.visible, (visible) => {
    if (!visible) {
      form.resetFields()
    } else {
      form.setFieldsValue(
        props.user.value || {
          extends: [
            {
              name: 'icon',
              value: 'icon-tag',
            },
          ],
        }
      )
    }
  })

  return (
    <Modal
      title={props.title}
      confirmLoading={props.loading}
      visible={props.visible.value}
      onCancel={props.onCancel}
      onOk={handleSubmit}
      centered={true}
      width={680}
      okText="Confirm"
      cancelText="Cancel"
    >
      <Form {...formLayout} colon={false} form={form}>
        {props.user.value && (
          <>
            <Form.Item label="ID">
              <Typography.Text copyable={true}>{props.user.value?.id}</Typography.Text>
              <Divider type="vertical" />
              <Typography.Text copyable={true}>{props.user.value?._id}</Typography.Text>
            </Form.Item>
            <Form.Item label="Created on">{stringToYMD(props.user.value?.create_at)}</Form.Item>
            <Form.Item label="Updated on">{stringToYMD(props.user.value?.update_at)}</Form.Item>
          </>
        )}
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please enter email ' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="userName"
          label="UserName"
          rules={[{ required: true, message: 'Please enter content' }]}
        >
          <Input placeholder="UserName" />
        </Form.Item>
        <Form.Item name="slogan" label="Slogan" rules={[{ required: true, message: 'Slogan' }]}>
          <Input placeholder="Slogan" />
        </Form.Item>
        <Form.Item name="name" label="name" rules={[{ required: true, message: 'LastName' }]}>
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item name="avatar" label="URL Avatar">
          <Input placeholder="Url" />
        </Form.Item>
        <Form.Item name="role" label="Role">
          <Input placeholder="role" />
        </Form.Item>
        {/* <Form.Item
          label="Custom Expansion"
          extra="You can add custom extended attributes to the current tag such as:icon、background"
          shouldUpdate={true}
        >
          <FormDataKeyValue fieldName="extends" />
        </Form.Item> */}
        <h3>Update password</h3>
        <Form.Item name="password" label="New Password">
          <Input placeholder="New Password" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
