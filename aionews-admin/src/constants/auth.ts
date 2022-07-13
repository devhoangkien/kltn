/**
 * @file Auth constant
 */
export type AdminId = string | number
export interface Auth {
  id?: string
  _id?: string
  name: string
  email: string
  userName: string
  role: string
  slogan: string
  avatar: string
  // optional
  password?: string
  new_password?: string
}
