/**
 * @file Article edit page
 *
 */

import React, { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Modal, Button, Space, Badge, message } from 'antd'
import * as Icon from '@ant-design/icons'
import { RouteKey, rc } from '@/routes'
import { getUEditorCache } from '@/components/common/UniversalEditor/lazy'
import { Article } from '@/constants/article'
import { SortTypeWithHot } from '@/constants/sort'
import { scrollTo } from '@/services/scroller'
import { getArticle, putArticle, deleteArticles } from '@/store/article'
import { getComments, CommentTree } from '@/store/comment'
import { getBlogArticleUrl } from '@/transforms/url'
import { ArticleEditor } from '../Editor'
import { ArticleComment } from './Comment'

export const ArticleEdit: React.FC = () => {
  const { article_id: articleID } = useParams<'article_id'>()
  const navigate = useNavigate()
  const fetching = useLoading()
  const submitting = useLoading()
  const article = useRef<Article | null>(null)
  const articleCacheID = useMemo(() => rc(RouteKey.ArticleEdit).pather!(articleID), [articleID])

  // Modal
  const isVisibleCommentModal = useRef<boolean>(false)
  const openCommentModal = () => {
    isVisibleCommentModal.value = true
  }
  const closeCommentModal = () => {
    isVisibleCommentModal.value = false
  }

  // Comment
  const commentLoading = useLoading()
  const commentCount = useRef<number>(0)
  const comments = useRef<Array<CommentTree>>([])
  const fetchComments = (articleId: number) => {
    commentLoading
      .promise(getComments({ per_page: 50, sort: SortTypeWithHot.Asc, post_id: articleId }))
      .then((result) => {
        commentCount.value = result.pagination?.total!
        comments.value = result.tree
      })
  }

  const fetchUpdateArticle = (_article: Article) => {
    return submitting.promise(putArticle(_article)).then((result) => {
      article.value = result
      scrollTo(document.body)
    })
  }

  const fetchDeleteArticle = () => {
    return submitting.promise(deleteArticles([article.value?._id!])).then(() => {
      navigate(rc(RouteKey.ArticleList).path)
      scrollTo(document.body)
    })
  }

  const handleManageComment = () => {
    navigate({
      pathname: rc(RouteKey.Comment).path,
      search: `post_id=${article.value?.id!}`,
    })
  }

  const handleDelete = () => {
    Modal.confirm({
      title: `Are you sure you want to completely delete the article "${article!.value!.title}"?`,
      content: 'This behavior is physical deletion and cannot be recovered!',
      onOk: fetchDeleteArticle,
      okButtonProps: {
        danger: true,
        type: 'ghost',
      },
      okText: 'Confirm',
      cancelText: 'Cancel',
    })
  }

  onMounted(async () => {
    try {
      const _article = await fetching.promise(getArticle(articleID!))
      fetchComments(_article.id!)
      const localContent = getUEditorCache(articleCacheID)
      if (Boolean(localContent) && localContent !== _article.content) {
        Modal.confirm({
          title:
            'There are unsaved articles in the local cache, do you want to overwrite the remote data?',
          content: 'If the coverage is wrong, refresh it yourself!',
          okText: 'Local override remote',
          cancelText: 'Use remote data',
          centered: true,
          okButtonProps: {
            danger: true,
          },
          onOk() {
            article.value = { ..._article, content: localContent || '' }
          },
          onCancel() {
            article.value = _article
          },
        })
      } else {
        article.value = _article
      }
    } catch (error: any) {
      Modal.error({
        centered: true,
        title: 'Article request failed',
        content: String(error.message),
      })
    }
  })

  return (
    <>
      <ArticleEditor
        title="Edit article"
        article={article}
        editorCacheID={articleCacheID}
        loading={fetching.state.value}
        submitting={submitting.state.value}
        onSubmit={fetchUpdateArticle}
        extra={
          <Space>
            <Button
              type="dashed"
              size="small"
              danger={true}
              icon={<Icon.DeleteOutlined />}
              disabled={fetching.state.value}
              onClick={() => message.warn('Double click to delete')}
              onDoubleClick={handleDelete}
            >
              Delete article
            </Button>
            <Badge count={commentCount.value}>
              <Button
                type="ghost"
                size="small"
                icon={<Icon.CommentOutlined />}
                disabled={fetching.state.value}
                onClick={openCommentModal}
              >
                Article Comments
              </Button>
            </Badge>
            <Button.Group>
              <Button size="small" icon={<Icon.HeartOutlined />} disabled={true}>
                {article.value?.meta?.likes} like
              </Button>
              <Button size="small" icon={<Icon.EyeOutlined />} disabled={true}>
                {article.value?.meta?.views} views
              </Button>
              <Button
                size="small"
                icon={<Icon.RocketOutlined />}
                target="_blank"
                href={getBlogArticleUrl(article.value?.id!)}
              />
            </Button.Group>
          </Space>
        }
      />
      <ArticleComment
        visible={isVisibleCommentModal.value}
        loading={commentLoading.state.value}
        count={commentCount.value}
        comments={comments.value}
        onClose={closeCommentModal}
        onManage={handleManageComment}
        onRefresh={() => fetchComments(article.value?.id!)}
      />
    </>
  )
}
