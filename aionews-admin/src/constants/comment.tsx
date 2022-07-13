/**
 * @file Comment constant
 */

import React from 'react'
import * as Icon from '@ant-design/icons'
import { GeneralKeyValue, IPLocation } from './general'

/** message board */
export const COMMENT_GUESTBOOK_POST_ID = 0

/** single comment */
export interface Comment {
  id: number
  _id: string
  pid: number
  post_id: number
  content: string
  agent: string
  state: CommentState
  likes: number
  dislikes: number
  author: {
    name: string
    site?: string
    email?: string
    email_hash: string | null
  }
  ip: string | null
  ip_location: IPLocation | null
  update_at?: string
  create_at?: string
  extends: Array<GeneralKeyValue>
}

/** Comment status */
export enum CommentState {
  Auditing = 0, // pending review
  Published = 1, // through normal
  Deleted = -1, // deleted
  Spam = -2, // spam
}

const commentStateMap = new Map(
  [
    {
      id: CommentState.Auditing,
      name: 'Auditing',
      icon: <Icon.EditOutlined />,
      color: 'blue',
    },
    {
      id: CommentState.Published,
      name: 'Publish',
      icon: <Icon.CheckOutlined />,
      color: 'green',
    },
    {
      id: CommentState.Spam,
      name: 'Spam ',
      icon: <Icon.StopOutlined />,
      color: 'red',
    },
    {
      id: CommentState.Deleted,
      name: 'Delete',
      icon: <Icon.DeleteOutlined />,
      color: 'orange',
    },
  ].map((item) => [item.id, item])
)

export const cs = (state: CommentState) => {
  return commentStateMap.get(state)!
}

export const commentStates = Array.from<ReturnType<typeof cs>>(commentStateMap.values())
