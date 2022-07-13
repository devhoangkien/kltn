/**
 * @file Article origin state
 */

import React from 'react'
import * as Icon from '@ant-design/icons'

/** Article Source */
export enum ArticleOrigin {
  Original = 0, // original
  Reprint = 1, // reprint
  Hybrid = 2, // mix
}

const articleOriginMap = new Map(
  [
    {
      id: ArticleOrigin.Original,
      name: 'Original',
      icon: <Icon.EditOutlined />,
      color: 'green',
    },
    {
      id: ArticleOrigin.Reprint,
      name: 'Reprint',
      icon: <Icon.CopyOutlined />,
      color: 'red',
    },
    {
      id: ArticleOrigin.Hybrid,
      name: 'Hybrid',
      icon: <Icon.PullRequestOutlined />,
      color: 'orange',
    },
  ].map((item) => [item.id, item])
)

export const ao = (state: ArticleOrigin) => articleOriginMap.get(state)!
export const articleOrigins = Array.from<ReturnType<typeof ao>>(articleOriginMap.values())
