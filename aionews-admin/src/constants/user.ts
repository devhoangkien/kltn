/**
 * @file Category constant
 */

import { GeneralKeyValue } from './general'

/** Classification */
export interface User {
  id?: number
  _id?: string
  email: string
  userName: string
  firstName: string
  lastName: string
  avatar: string
  role: string
  status: string
  password: string
  update_at: string
  create_at: string
  children?: Array<User>
  extends: Array<GeneralKeyValue>
  articles_count?: number
}
