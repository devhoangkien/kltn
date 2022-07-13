/**
 * @file Auth store
 */

import { AdminId, Auth } from '@/constants/auth'
import { GeneralPaginateQueryParams } from '@/constants/request'
import nodepress from '@/services/nodepress'
import { profile } from 'console'
export interface GetAdminParams extends GeneralPaginateQueryParams {
  /** search keyword */
  keyword?: string
}
export const AUTH_API_PATH = {
  AUTH: '/auth',
  LOGIN: '/auth/login',
  CHECK_TOKEN: '/auth/check',
  RENEWAL_TOKEN: '/auth/renewal',
  ADMIN: '/auth/admin',
}
/** Get administrator information */
export function getAdminInfo() {
  const tokenAdmin = localStorage.getItem('id_token')
  return nodepress
    .get<Auth>(`${AUTH_API_PATH.ADMIN}/profile?token=${tokenAdmin}`)
    .then((response) => response.result)
}

export function getAdminList() {
  return nodepress.get<Auth>(AUTH_API_PATH.ADMIN).then((response) => response.result)
}

/** Create labels */
export function createAdmin(user: Auth) {
  return nodepress.post(AUTH_API_PATH.ADMIN, user).then((response) => response.result)
}

/** Edit users */
export function putAdmin(user: Auth) {
  return nodepress
    .patch(`${AUTH_API_PATH.ADMIN}?id=${user._id}`, user)
    .then((response) => response.result)
}

/** Update administrator information (including platform password) */
export function putAuth(auth: Auth) {
  return nodepress
    .patch<Auth>(`${AUTH_API_PATH.ADMIN}?id=${auth._id}`, {
      ...auth,
      password: auth.password,
      new_password: auth.new_password,
    })
    .then((response) => response.result)
}

/** remove user */
export function deleteAdmin(userId: string) {
  return nodepress.delete(`${AUTH_API_PATH.ADMIN}/${userId}`).then((response) => response.result)
}

/** Delete user in bulk */
export function deleteUsers(userIds: string[]) {
  return nodepress
    .delete(AUTH_API_PATH.ADMIN, { data: { user_ids: userIds } })
    .then((response) => response.result)
}

/** Check Token validity */
export function checkTokenValidity() {
  return nodepress.post<void>(AUTH_API_PATH.CHECK_TOKEN).then((response) => response.result)
}

export interface TokenResult {
  token: any
  access_token: string
  expires_in: number
}

/** Log in */
export function authLogin(email: string, password: string) {
  return nodepress
    .post<TokenResult>(AUTH_API_PATH.LOGIN, { email, password })
    .then((response) => response.result)
}

/** Renew Token */
export function renewalToken() {
  return nodepress
    .post<TokenResult>(AUTH_API_PATH.RENEWAL_TOKEN)
    .then((response) => response.result)
}
