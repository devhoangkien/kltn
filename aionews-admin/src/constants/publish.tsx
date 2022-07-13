/**
 * @file General publish state
 */

import React from 'react'
import * as Icon from '@ant-design/icons'

/** Data release status */
export enum PublishState {
  Draft = 0, // draft
  Published = 1, // Published
  Recycle = -1, // recycle bin
}

const publishStateMap = new Map(
  [
    {
      id: PublishState.Draft,
      name: 'Draft',
      icon: <Icon.EditOutlined />,
      color: 'orange',
    },
    {
      id: PublishState.Published,
      name: 'Published',
      icon: <Icon.CheckOutlined />,
      color: 'green',
    },
    {
      id: PublishState.Recycle,
      name: 'Recycle',
      icon: <Icon.DeleteOutlined />,
      color: 'red',
    },
  ].map((item) => [item.id, item])
)

export const ps = (state: PublishState) => {
  return publishStateMap.get(state)!
}

export const publishStates = Array.from<ReturnType<typeof ps>>(publishStateMap.values())
