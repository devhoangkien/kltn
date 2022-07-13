import React from 'react'
import { useNavigate } from 'react-router-dom'
import { onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Form, Input, Button, Spin, Divider, notification } from 'antd'
import * as Icon from '@ant-design/icons'

import { RouteKey, rc } from '@/routes'
import { ImageUploader } from '@/components/common/ImageUploader'
import { Auth } from '@/constants/auth'
import { scrollTo } from '@/services/scroller'
import { removeToken } from '@/services/token'
import { useAdminState } from '@/state/admin'
import { putAuth } from '@/store/auth'
import styles from './style.module.less'

export interface BaseFormProps {
  labelSpan: number
  wrapperSpan: number
}

export const AuthForm: React.FC<BaseFormProps> = (props) => {
  const navigate = useNavigate()
  const submitting = useLoading()
  const adminAuth = useAdminState()
  const [form] = Form.useForm<Auth>()

  const fetchNewAdminAuth = () => {
    adminAuth.refresh().then(form.setFieldsValue)
  }

  const updateAdminAuth = (_adminAuth: Auth) => {
    return submitting.promise(putAuth(_adminAuth)).then(() => {
      if (_adminAuth.new_password) {
        notification.info({
          message: 'Changed the new password, will jump to the login page...',
        })
        setTimeout(() => {
          removeToken()
          navigate(rc(RouteKey.Hello).path)
        }, 1688)
      } else {
        fetchNewAdminAuth()
      }
    })
  }

  const handleSubmit = () => {
    form.validateFields().then((newAdminAuth) => {
      Reflect.deleteProperty(newAdminAuth, 'rel_new_password')
      updateAdminAuth({
        ...adminAuth.data,
        ...newAdminAuth,
      }).then(() => {
        scrollTo(document.body)
      })
    })
  }

  // Verify repeated password entry
  const validatePassword = async () => {
    const password = form.getFieldValue('password')
    const newPassword = form.getFieldValue('new_password')
    const reallyNewPassword = form.getFieldValue('rel_new_password')
    if (!password && !newPassword && !reallyNewPassword) {
      return
    }
    if (newPassword !== reallyNewPassword || password === newPassword) {
      throw new Error()
    }
  }

  onMounted(() => {
    fetchNewAdminAuth()
  })

  return (
    <Spin spinning={submitting.state.value}>
      <Form
        colon={false}
        scrollToFirstError={true}
        className={styles.form}
        form={form}
        labelCol={{ span: props.labelSpan }}
        wrapperCol={{ span: props.wrapperSpan }}
      >
        <Form.Item
          name="avatar"
          label="Avatar"
          required={true}
          wrapperCol={{ span: 6 }}
          rules={[{ required: true, message: 'Please upload a picture' }]}
        >
          <ImageUploader disabledMarkdown={true} />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          required={true}
          rules={[{ required: true, message: 'Please enter a nickname' }]}
        >
          <Input placeholder="Nick name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          required={true}
          rules={[{ required: true, message: 'Please enter a Email' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="userName"
          label="User name"
          required={true}
          rules={[{ required: true, message: 'Please enter a user name' }]}
        >
          <Input placeholder="User name" />
        </Form.Item>
        <Form.Item
          name="slogan"
          label="Signature"
          required={true}
          rules={[{ required: true, message: 'Please enter a signature' }]}
        >
          <Input placeholder="Sign" />
        </Form.Item>
        <Divider />
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              message: 'Make sure the old and new passwords are inconsistent and valid',
              validator: validatePassword,
            },
          ]}
        >
          <Input.Password placeholder="Old Password" autoComplete="password" />
        </Form.Item>
        <Form.Item
          name="new_password"
          label="New Password"
          rules={[
            {
              message: 'Make sure the old and new passwords are inconsistent and valid',
              validator: validatePassword,
            },
          ]}
        >
          <Input.Password placeholder="New password" autoComplete="new_password" />
        </Form.Item>
        <Form.Item
          name="rel_new_password"
          label="Confirm the new password"
          rules={[
            {
              message: 'Make sure the old and new passwords are inconsistent and valid',
              validator: validatePassword,
            },
          ]}
        >
          <Input.Password placeholder="Confirm the new password" autoComplete="rel_new_password" />
        </Form.Item>
        <Form.Item label=" ">
          <Button
            icon={<Icon.CheckOutlined />}
            type="primary"
            loading={submitting.state.value}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  )
}
