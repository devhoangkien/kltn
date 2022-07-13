/**
 * @file Article public state
 */

import React from 'react'
import * as Icon from '@ant-design/icons'

/** Article public status */
export enum ArticlePublic {
  Reserve = 0, // reserved status
  Public = 1, // public status
  Secret = -1, // private
}

const articlePublicMap = new Map(
  [
    {
      id: ArticlePublic.Public,
      name: 'Public',
      icon: <Icon.UnlockOutlined />,
      color: 'green',
    },
    {
      id: ArticlePublic.Secret,
      name: 'Private',
      icon: <Icon.LockOutlined />,
      color: 'red',
    },
    {
      id: ArticlePublic.Reserve,
      name: 'Reserve',
      icon: <Icon.StopOutlined />,
      color: 'orange',
    },
  ].map((item) => [item.id, item])
)

export const ap = (state: ArticlePublic) => articlePublicMap.get(state)!
export const articlePublics = Array.from<ReturnType<typeof ap>>(articlePublicMap.values())
