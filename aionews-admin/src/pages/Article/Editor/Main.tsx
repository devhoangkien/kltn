import React from 'react'
import moment from 'moment'
import { useRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import {
  Modal,
  Spin,
  Button,
  Form,
  Select,
  Input,
  Divider,
  Space,
  Typography,
  FormInstance,
} from 'antd'
import * as Icon from '@ant-design/icons'
import { UniversalEditor, UEditorLanguage } from '@/components/common/UniversalEditor/lazy'
import { MultipleUploader } from '@/components/common/ImageUploader'
import { getTags } from '@/store/tag'
import { Tag } from '@/constants/tag'
import { BLOG_ARTICLE_URL_PREFIX } from '@/transforms/url'
import { BaseFormModel } from './'

interface TagSelectProps {
  value?: Array<string>
  onChange?(value: Array<string>): void
}
const TagSelect: React.FC<TagSelectProps> = (props) => {
  const tagsLoading = useLoading()
  const tags = useRef<Array<Tag>>([])
  const fetchTags = () => {
    tagsLoading.promise(getTags({ per_page: 50 })).then((result) => {
      tags.value = result.data
    })
  }

  const values = props.value || []
  const handleClick = (tag: Tag, checked: boolean) => {
    const tagID = tag._id!
    const tagIDs = checked ? [...values, tagID] : values.filter((t) => t !== tagID)
    props.onChange?.(tagIDs)
  }

  onMounted(() => {
    fetchTags()
  })

  return (
    <Spin spinning={tagsLoading.state.value}>
      <Space wrap={true} size={[12, 12]}>
        {!tags.value.length ? (
          <Typography.Text type="secondary">No data</Typography.Text>
        ) : (
          tags.value.map((tag) => {
            const isChecked = values.includes(tag._id!)
            return (
              <Button
                size="small"
                key={tag._id!}
                type={isChecked ? 'primary' : 'default'}
                icon={isChecked ? <Icon.CheckCircleOutlined /> : <Icon.TagOutlined />}
                onClick={() => handleClick(tag, !isChecked)}
              >
                {tag.name}
              </Button>
            )
          })
        )}
        <Divider type="vertical" />
        <Button
          size="small"
          type="dashed"
          icon={<Icon.ReloadOutlined />}
          loading={tagsLoading.state.value}
          onClick={fetchTags}
        >
          Refresh
        </Button>
      </Space>
    </Spin>
  )
}

export interface MainFormProps {
  form: FormInstance<BaseFormModel>
  editorCacheID?: string
}
export const MainForm: React.FC<MainFormProps> = (props) => {
  const isVisibleUploaderModal = useRef(false)

  return (
    <>
      <Form
        scrollToFirstError={true}
        colon={false}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 22 }}
        form={props.form}
      >
        <Form.Item
          label="Slug"
          name="slug"
          wrapperCol={{ span: 15 }}
          rules={[
            {
              pattern: /^[a-zA-Z0-9-_]+$/,
              message: 'Only supports English, numbers, _, -',
            },
          ]}
        >
          <Input
            addonBefore={BLOG_ARTICLE_URL_PREFIX}
            placeholder="article-title"
            allowClear={true}
          />
        </Form.Item>
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: 'Please enter a title',
            },
          ]}
        >
          <Input placeholder="Article title" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          required={true}
          rules={[
            {
              required: true,
              message: 'Please enter a title',
            },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Article description" />
        </Form.Item>
        <Form.Item
          label="Keywords"
          name="keywords"
          required={true}
          rules={[
            {
              message: 'There should be at least one keyword',
              validator(_, value: string[]) {
                return Boolean(value?.length) ? Promise.resolve() : Promise.reject()
              },
            },
          ]}
        >
          <Select placeholder="Enter the keyword and press Enter" mode="tags" />
        </Form.Item>
        <Form.Item label="Label" name="tag">
          <TagSelect />
        </Form.Item>
        <br />
        <Form.Item
          label="Content"
          name="content"
          required={true}
          rules={[
            {
              required: true,
              message: 'Please enter the content of the article',
            },
          ]}
        >
          <UniversalEditor
            formStatus={true}
            minRows={28}
            eid={props.editorCacheID}
            placeholder="Enter article content..."
            renderToolbarExtra={(language) => {
              if (language === UEditorLanguage.Markdown) {
                return (
                  <Button
                    size="small"
                    icon={<Icon.CloudUploadOutlined />}
                    onClick={() => {
                      isVisibleUploaderModal.value = true
                    }}
                  />
                )
              }
            }}
          />
        </Form.Item>
      </Form>
      <Modal
        centered={true}
        closable={false}
        visible={isVisibleUploaderModal.value}
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        title={
          <Space>
            <Icon.FileImageOutlined />
            Image uploader
          </Space>
        }
        footer={
          <Button
            block={true}
            type="link"
            onClick={() => {
              isVisibleUploaderModal.value = false
            }}
          >
            OK
          </Button>
        }
      >
        <MultipleUploader directory={`nodepress/${moment().format('YYYY-MM-DD')}`} />
      </Modal>
    </>
  )
}
