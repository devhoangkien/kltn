import React from 'react'
import { Ref, useWatch } from 'veact'
import { Form, Input, Modal, Divider, Typography } from 'antd'

import { FormDataKeyValue } from '@/components/common/FormDataKeyValue'
import { Tag as TagType } from '@/constants/tag'
import { stringToYMD } from '@/transforms/date'

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
}

export interface EditModalProps {
  title: string
  loading: boolean
  visible: Ref<boolean>
  tag: Ref<TagType | null>
  onSubmit(tag: TagType): void
  onCancel(): void
}

export const EditModal: React.FC<EditModalProps> = (props) => {
  const [form] = Form.useForm<TagType>()
  const handleSubmit = () => {
    form.validateFields().then(props.onSubmit)
  }

  useWatch(props.visible, (visible) => {
    if (!visible) {
      form.resetFields()
    } else {
      form.setFieldsValue(
        props.tag.value || {
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
      okText="Submit"
      cancelText="Cancel"
    >
      <Form {...formLayout} colon={false} form={form}>
        {props.tag.value && (
          <>
            <Form.Item label="ID">
              <Typography.Text copyable={true}>{props.tag.value?.id}</Typography.Text>
              <Divider type="vertical" />
              <Typography.Text copyable={true}>{props.tag.value?._id}</Typography.Text>
            </Form.Item>
            <Form.Item label="Created on">{stringToYMD(props.tag.value?.create_at)}</Form.Item>
            <Form.Item label="Updated on">{stringToYMD(props.tag.value?.update_at)}</Form.Item>
          </>
        )}
        <Form.Item
          name="name"
          label="Name"
          extra="This will be the name it displays on the site"
          rules={[{ required: true, message: 'Please enter content' }]}
        >
          <Input placeholder="Tag Name" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="Tag slug"
          extra="This will be the url for the tag"
          rules={[{ required: true, message: 'Please enter content' }]}
        >
          <Input placeholder="Tag slug" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter content' }]}
        >
          <Input.TextArea rows={4} placeholder="Description" />
        </Form.Item>
        <Form.Item
          label="Custom extension"
          extra="You can add custom extension properties for the current label, such as: icon, background"
          shouldUpdate={true}
        >
          <FormDataKeyValue fieldName="extends" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
