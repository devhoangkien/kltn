import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import classnames from 'classnames'
import { Menu, Spin } from 'antd'
import * as Icon from '@ant-design/icons'

import { GITHUB_REPO_URL, GITHUB_REPO_NAME } from '@/config'
import { getResourceUrl } from '@/transforms/url'
import { RouteKey, rc } from '@/routes'
import { useAdminState } from '@/state/admin'

import styles from './style.module.less'
export interface AppSiderProps {
  isSiderCollapsed: boolean
}
export const AppSider: React.FC<AppSiderProps> = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const admin = useAdminState()

  return (
    <div className={styles.siderMenu}>
      <Link to={rc(RouteKey.Dashboard).path} className={styles.logo}>
        {/* <img
          alt="logo"
          className={classnames(styles.image, props.isSiderCollapsed && styles.collapsed)}
          src={getResourceUrl(
            props.isSiderCollapsed ? `/images/logo.mini.svg` : `/images/logo.svg`
          )}
        /> */}
        <h1>AIO.NEWS</h1>
      </Link>
      <Spin spinning={admin.loading.value} size="small">
        <div className={styles.userInfo}>
          <img
            src={admin.data.avatar}
            alt={admin.data.name}
            draggable={false}
            className={classnames(styles.avatar, props.isSiderCollapsed && styles.collapsed)}
          />
          {!props.isSiderCollapsed && (
            <>
              <span className={styles.name}>{admin.data.name}</span>
              <span className={styles.slogan}>{admin.data.slogan}</span>
            </>
          )}
        </div>
      </Spin>
      <Menu
        theme="dark"
        mode="inline"
        className={styles.menus}
        onClick={(event) => navigate(event.key)}
        selectedKeys={[location.pathname]}
        defaultOpenKeys={[rc(RouteKey.Article).path]}
      >
        <Menu.Item key={rc(RouteKey.Dashboard).path} icon={rc(RouteKey.Dashboard).icon}>
          {rc(RouteKey.Dashboard).name}
        </Menu.Item>
        <Menu.Item key={rc(RouteKey.Announcement).path} icon={rc(RouteKey.Announcement).icon}>
          {rc(RouteKey.Announcement).name}
        </Menu.Item>
        <Menu.Item key={rc(RouteKey.Category).path} icon={rc(RouteKey.Category).icon}>
          {rc(RouteKey.Category).name}
        </Menu.Item>
        <Menu.Item key={rc(RouteKey.Tag).path} icon={rc(RouteKey.Tag).icon}>
          {rc(RouteKey.Tag).name}
        </Menu.Item>
        <Menu.Item key={rc(RouteKey.User).path} icon={rc(RouteKey.User).icon}>
          {rc(RouteKey.User).name}
        </Menu.Item>
        <Menu.Item key={rc(RouteKey.Admin).path} icon={rc(RouteKey.Admin).icon}>
          {rc(RouteKey.Admin).name}
        </Menu.Item>
        <Menu.SubMenu
          key={rc(RouteKey.Article).path}
          icon={rc(RouteKey.Article).icon}
          title={rc(RouteKey.Article).name}
        >
          <Menu.Item key={rc(RouteKey.ArticleList).path}>{rc(RouteKey.ArticleList).name}</Menu.Item>
          <Menu.Item key={rc(RouteKey.ArticlePost).path}>{rc(RouteKey.ArticlePost).name}</Menu.Item>
        </Menu.SubMenu>
        <Menu.Item
          key={rc(RouteKey.Comment).path}
          icon={rc(RouteKey.Comment).icon}
          title={rc(RouteKey.Comment).name}
        >
          {rc(RouteKey.Comment).name}
        </Menu.Item>
        <Menu.SubMenu
          key={rc(RouteKey.Disqus).path}
          icon={rc(RouteKey.Disqus).icon}
          title={rc(RouteKey.Disqus).name}
        >
          <Menu.Item key={rc(RouteKey.DisqusPost).path}>{rc(RouteKey.DisqusPost).name}</Menu.Item>
          <Menu.Item key={rc(RouteKey.DisqusThread).path}>
            {rc(RouteKey.DisqusThread).name}
          </Menu.Item>
          <Menu.Item key={rc(RouteKey.DisqusSync).path}>{rc(RouteKey.DisqusSync).name}</Menu.Item>
        </Menu.SubMenu>
        <Menu.Item
          key={rc(RouteKey.Feedback).path}
          icon={rc(RouteKey.Feedback).icon}
          title={rc(RouteKey.Feedback).name}
        >
          {rc(RouteKey.Feedback).name}
        </Menu.Item>
        <Menu.Item key={rc(RouteKey.Profile).path} icon={rc(RouteKey.Profile).icon}>
          {rc(RouteKey.Profile).name}
        </Menu.Item>
      </Menu>
      <Menu className={styles.footerLink} mode="vertical" selectedKeys={[]}>
        <Menu.Item
          key="github"
          icon={<Icon.GithubOutlined />}
          onClick={() => window.open(GITHUB_REPO_URL)}
        >
          {GITHUB_REPO_NAME}
        </Menu.Item>
      </Menu>
    </div>
  )
}
