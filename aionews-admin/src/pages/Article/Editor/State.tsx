import React from 'react'
import { Button, Form, Select, Divider, Space, Radio, FormInstance } from 'antd'
import * as Icon from '@ant-design/icons'
import { publishStates } from '@/constants/publish'
import { articleOrigins } from '@/constants/article/origin'
import { articlePublics } from '@/constants/article/public'
import { articleLanguages } from '@/constants/article/language'
import { StateFormModel } from '.'

const requiredRule = {
  message: 'required',
  required: true,
}

export interface StateFormProps {
  form: FormInstance<StateFormModel>
  submitting: boolean
  onSubmit(): void
}
export const StateForm: React.FC<StateFormProps> = (props) => {
  return (
    <Form
      scrollToFirstError={true}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 13, offset: 1 }}
      colon={false}
      form={props.form}
    >
      <Form.Item required={true} name="state" label="Status" rules={[requiredRule]}>
        <Select
          placeholder="Article publication status"
          options={publishStates.map((state) => {
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
      <Form.Item required={true} name="origin" label="Source" rules={[requiredRule]}>
        <Select
          placeholder="Article Source"
          options={articleOrigins.map((state) => {
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
      <Form.Item required={true} name="public" label="Type" rules={[requiredRule]}>
        <Select
          placeholder="Article disclosure type"
          options={articlePublics.map((state) => {
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
      <Form.Item required={true} name="lang" label="Language" rules={[requiredRule]}>
        <Select
          placeholder="Article language"
          options={articleLanguages.map((state) => {
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
      <Form.Item required={true} name="disabled_comment" label="Comments" rules={[requiredRule]}>
        <Radio.Group size="small">
          <Radio.Button value={false}>
            <Icon.CheckCircleOutlined />
            &nbsp;Allow
          </Radio.Button>
          <Radio.Button value={true}>
            <Icon.StopOutlined />
            &nbsp;Disable
          </Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Divider />
      <Button
        type="primary"
        block={true}
        icon={<Icon.CheckOutlined />}
        loading={props.submitting}
        onClick={props.onSubmit}
      >
        Submit
      </Button>
    </Form>
  )
}
