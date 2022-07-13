/**
 * @file General sort state
 */

import React from 'react'
import * as Icon from '@ant-design/icons'

const ASC = 1 // Ascending
const DESC = -1 // Descending

export enum SortTypeBase {
  Asc = ASC,
  Desc = DESC,
}

export enum SortTypeWithHot {
  Asc = ASC,
  Desc = DESC,
  Hot = 2,
}

const sortTypeMap = new Map(
  [
    {
      id: SortTypeWithHot.Desc,
      name: 'DESC',
      icon: <Icon.SortDescendingOutlined />,
    },
    {
      id: SortTypeWithHot.Asc,
      name: 'ASC',
      icon: <Icon.SortAscendingOutlined />,
    },
    {
      id: SortTypeWithHot.Hot,
      name: 'Hottest',
      icon: <Icon.FireOutlined />,
    },
  ].map((item) => [item.id, item])
)

export const st = (state: number) => sortTypeMap.get(state)!
