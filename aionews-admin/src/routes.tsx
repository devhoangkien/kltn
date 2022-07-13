/**
 * @file App route config
  
 */

import React from 'react'
import { generatePath } from 'react-router-dom'
import * as Icon from '@ant-design/icons'

export enum RouteKey {
  Hello,
  Dashboard,
  Profile,
  Announcement,
  Category,
  Tag,
  User,
  Admin,
  Comment,
  Disqus,
  DisqusThread,
  DisqusPost,
  DisqusSync,
  Feedback,
  Article,
  ArticleList,
  ArticlePost,
  ArticleEdit,
}

export interface RouteConfig {
  id: RouteKey
  name: string
  path: string
  subPath?: string
  icon?: React.ReactElement
  pather?(...args: Array<any>): string
}
export const routeMap: ReadonlyMap<RouteKey, RouteConfig> = new Map(
  [
    {
      id: RouteKey.Hello,
      name: 'Đăng nhập',
      path: '/login',
    },
    {
      id: RouteKey.Dashboard,
      name: 'Bảng điều khiển',
      path: '/dashboard',
      icon: <Icon.DashboardOutlined />,
    },
    {
      id: RouteKey.Profile,
      name: 'Cài đặt',
      path: '/setting',
      icon: <Icon.SettingOutlined />,
    },
    {
      id: RouteKey.Announcement,
      name: 'QL Thông báo',
      path: '/announcement',
      icon: <Icon.BulbOutlined />,
    },
    {
      id: RouteKey.Category,
      name: 'QL thể loại',
      path: '/category',
      icon: <Icon.FolderOpenOutlined />,
    },
    {
      id: RouteKey.Tag,
      name: 'QL thẻ',
      path: '/tag',
      icon: <Icon.TagsOutlined />,
    },
    {
      id: RouteKey.User,
      name: 'QL người dùng',
      path: '/user',
      icon: <Icon.UserOutlined />,
    },

    {
      id: RouteKey.Admin,
      name: 'QL quản trị viên',
      path: '/admin',
      icon: <Icon.UserOutlined />,
    },
    {
      id: RouteKey.Comment,
      name: 'QL bình luận',
      path: '/comment',
      icon: <Icon.CommentOutlined />,
    },
    {
      id: RouteKey.Feedback,
      name: 'QL phản hồi',
      path: '/feedback',
      icon: <Icon.AlertOutlined />,
    },
    {
      id: RouteKey.Disqus,
      name: 'QL Disqus',
      path: '/disqus',
      icon: <Icon.MessageOutlined />,
    },
    {
      id: RouteKey.DisqusPost,
      name: 'Bài viết',
      path: '/disqus/posts',
      subPath: 'posts',
      icon: <Icon.MessageOutlined />,
    },
    {
      id: RouteKey.DisqusThread,
      name: 'Chủ đề',
      path: '/disqus/threads',
      subPath: 'threads',
      icon: <Icon.AppstoreOutlined />,
    },
    {
      id: RouteKey.DisqusSync,
      name: 'Đồng bộ',
      path: '/disqus/synchronize',
      subPath: 'synchronize',
      icon: <Icon.CloudSyncOutlined />,
    },
    {
      id: RouteKey.Article,
      name: 'QL bài viết',
      path: '/article',
      icon: <Icon.CoffeeOutlined />,
    },
    {
      id: RouteKey.ArticleList,
      name: 'Danh sách',
      path: '/article/list',
      subPath: 'list',
      icon: <Icon.OrderedListOutlined />,
    },
    {
      id: RouteKey.ArticlePost,
      name: 'Bài viết mới',
      path: '/article/post',
      subPath: 'post',
      icon: <Icon.EditOutlined />,
    },
    {
      id: RouteKey.ArticleEdit,
      name: 'Sửa bài viết',
      path: '/article/edit/:article_id',
      subPath: 'edit/:article_id',
      icon: <Icon.EditOutlined />,
      pather(article_id: string) {
        return generatePath(this.path, { article_id })
      },
    },
  ].map((route) => [route.id, route])
)

export const rc = (routeKey: RouteKey): RouteConfig => {
  return routeMap.get(routeKey)!
}
export const rcByPath = (routePath: string) => {
  return Array.from(routeMap.values()).find((route) => route.path === routePath)
}
export const isRoute = (routePath: string, routeKey: RouteKey) => {
  return routeMap.get(routeKey)?.path === routePath
}
