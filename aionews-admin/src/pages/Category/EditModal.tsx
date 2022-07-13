import React from 'react'
import { Ref, useWatch } from 'veact'
import { Form, Input, Modal, TreeSelect, Typography, Divider, TreeDataNode } from 'antd'
import { FormDataKeyValue } from '@/components/common/FormDataKeyValue'
import { Category as CategoryType } from '@/constants/category'
import { stringToYMD } from '@/transforms/date'

const CATEGORY_NULL_VALUE = null as any
const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
}

export interface EditModalProps {
  title: string
  loading: boolean
  visible: Ref<boolean>
  category: Ref<CategoryType | null>
  tree: TreeDataNode[]
  categories: CategoryType[]
  onSubmit(category: CategoryType): void
  onCancel(): void
}

export const EditModal: React.FC<EditModalProps> = (props) => {
  const [form] = Form.useForm<CategoryType>()
  const handleSubmit = () => {
    form.validateFields().then(props.onSubmit)
  }

  useWatch(props.visible, (visible) => {
    if (!visible) {
      form.resetFields()
    } else {
      form.setFieldsValue(
        props.category.value || {
          pid: CATEGORY_NULL_VALUE,
          extends: [
            {
              name: 'icon',
              value: 'icon-category',
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
        {props.category.value && (
          <>
            <Form.Item label="ID">
              <Typography.Text copyable={true}>{props.category.value?.id}</Typography.Text>
              <Divider type="vertical" />
              <Typography.Text copyable={true}>{props.category.value?._id}</Typography.Text>
            </Form.Item>
            <Form.Item label="Posted on">{stringToYMD(props.category.value?.create_at)}</Form.Item>
            <Form.Item label="Updated on">{stringToYMD(props.category.value?.update_at)}</Form.Item>
          </>
        )}
        <Form.Item
          name="name"
          label="Category Name"
          extra="This will be the name it displays on the site"
          rules={[{ required: true, message: 'Please enter content' }]}
        >
          <Input placeholder="Category Name" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="Slug"
          extra="Slug is used to generate the URL for the category"
          rules={[{ required: true, message: 'Please enter slug' }]}
        >
          <Input placeholder="Slug category" />
        </Form.Item>
        <Form.Item
          name="pid"
          label="Parent category"
          extra="Parent category can be selected"
          rules={[
            {
              message: 'Please select the correct parent category',
              validator(_, value) {
                if (value === CATEGORY_NULL_VALUE) {
                  return Promise.resolve()
                }
                if (value === props.category.value?._id) {
                  return Promise.reject()
                }
                if (props.categories.some((c) => c._id === value)) {
                  return Promise.resolve()
                } else {
                  return Promise.reject()
                }
              },
            },
          ]}
        >
          <TreeSelect
            placeholder="Select parent category"
            treeDefaultExpandAll={true}
            treeData={[
              {
                label: 'None',
                key: 'null',
                value: CATEGORY_NULL_VALUE,
              },
              ...props.tree,
            ]}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter content' }]}
        >
          <Input.TextArea rows={4} placeholder="Classification description" />
        </Form.Item>
        <Form.Item
          label="Custom extension"
          extra="You can add custom extension properties for the current category, such as: icon, background"
          shouldUpdate={true}
        >
          <FormDataKeyValue fieldName="extends" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
