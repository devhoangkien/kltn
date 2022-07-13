/**
 * @file Article category page
 */

import React from 'react'
import { useShallowReactive, useRef, onMounted, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { Button, Card, Divider, Modal, Space, Spin, Tree, Typography } from 'antd'
import * as Icon from '@ant-design/icons'
import { UniversalText } from '@/components/common/UniversalText'
import { ResponsePaginationData } from '@/constants/request'
import { Category as CategoryType } from '@/constants/category'
import { getBlogCategoryUrl } from '@/transforms/url'
import {
  getAntdTreeByTree,
  CategoryTree,
  getCategories,
  deleteCategory,
  putCategory,
  createCategory,
} from '@/store/category'
import { EditModal } from './EditModal'

import styles from './style.module.less'

export const CategoryPage: React.FC = () => {
  const loading = useLoading()
  const submitting = useLoading()
  const loaded = useRef(false)
  const categories = useShallowReactive<
    ResponsePaginationData<CategoryType> & { tree: Array<CategoryTree> }
  >({ tree: [], data: [], pagination: void 0 })

  // Pop-ups
  const activeEditDataId = useRef<string | null>(null)
  const isVisibleModal = useRef(false)
  const activeEditData = useComputed(() => {
    const id = activeEditDataId.value
    return id !== null ? categories.data.find((c) => c._id === id)! : null
  })

  const closeModal = () => {
    isVisibleModal.value = false
  }
  // edit create
  const editData = (id: string) => {
    activeEditDataId.value = id
    isVisibleModal.value = true
  }
  const createNewData = () => {
    activeEditDataId.value = null
    isVisibleModal.value = true
  }

  const fetchData = () => {
    return loading.promise(getCategories({ per_page: 50 })).then((result) => {
      categories.data = result.data
      categories.tree = result.tree
      categories.pagination = result.pagination
    })
  }

  const handleDelete = (category: CategoryType) => {
    Modal.confirm({
      title: `Are you sure you want to delete category "${category.name}"?`,
      content: 'Unrecoverable after deletion',
      centered: true,
      onOk: () => {
        return deleteCategory(category._id!).then(() => {
          fetchData()
        })
      },
      okText: 'Delete',
      cancelText: 'Cancel',
    })
  }

  const handleSubmit = (category: CategoryType) => {
    if (activeEditData.value) {
      submitting
        .promise(
          putCategory({
            ...activeEditData.value,
            ...category,
          })
        )
        .then(() => {
          closeModal()
          fetchData()
        })
    } else {
      submitting.promise(createCategory(category)).then(() => {
        closeModal()
        fetchData()
      })
    }
  }

  onMounted(() => {
    fetchData().then(() => {
      // Fix for Tree
      setTimeout(() => {
        loaded.value = true
      })
    })
  })

  return (
    <Card
      title={`Category List(${categories.pagination?.total ?? '-'})`}
      bordered={false}
      className={styles.category}
      extra={
        <Button type="primary" size="small" icon={<Icon.PlusOutlined />} onClick={createNewData}>
          Create new category
        </Button>
      }
    >
      <Space className={styles.toolbar}>
        <Space>
          <Button
            icon={<Icon.ReloadOutlined />}
            loading={loading.state.value}
            onClick={() => fetchData()}
          >
            Refresh
          </Button>
        </Space>
      </Space>
      <Divider />
      <Spin spinning={loading.state.value}>
        {loaded.value && (
          <Tree
            className={styles.tree}
            checkable={false}
            blockNode={true}
            autoExpandParent={true}
            defaultExpandAll={true}
            showLine={true}
            showIcon={false}
            selectable={false}
            treeData={getAntdTreeByTree({
              tree: categories.tree,
              valuer: (c) => c._id,
            })}
            titleRender={(nodeData) => {
              const category: CategoryTree = (nodeData as any).data
              return (
                <div className={styles.categoryNode}>
                  <div className={styles.content}>
                    <Space className={styles.title}>
                      <Typography.Text strong={true}>{category.name}</Typography.Text>
                      <Divider type="vertical" />
                      <Typography.Text type="secondary">{category.slug}</Typography.Text>
                      <Divider type="vertical" />
                      <Typography.Text type="secondary">
                        {category.articles_count} articles
                      </Typography.Text>
                    </Space>
                    <div>
                      <UniversalText type="secondary" text={category.description} />
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <Button
                      size="small"
                      type="text"
                      icon={<Icon.EditOutlined />}
                      onClick={() => editData(category._id!)}
                    >
                      Edit
                    </Button>
                    <Divider type="vertical" />
                    <Button
                      size="small"
                      type="text"
                      danger={true}
                      icon={<Icon.DeleteOutlined />}
                      onClick={() => handleDelete(category)}
                    >
                      Delete
                    </Button>
                    <Divider type="vertical" />
                    <Button
                      size="small"
                      icon={<Icon.LinkOutlined />}
                      type="link"
                      target="_blank"
                      href={getBlogCategoryUrl(category.slug)}
                    >
                      Check
                    </Button>
                  </div>
                </div>
              )
            }}
          />
        )}
      </Spin>
      <EditModal
        title={activeEditData.value ? 'Edit Category' : 'New category'}
        loading={submitting.state.value}
        tree={getAntdTreeByTree({
          tree: categories.tree,
          valuer: (c) => c._id,
          disabledWhen: (c) => {
            if (c._id === activeEditData.value?._id) {
              return true
            }
            if (c.pid === activeEditData.value?._id) {
              return true
            }
            return false
          },
        })}
        categories={categories.data}
        visible={isVisibleModal}
        category={activeEditData}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </Card>
  )
}
