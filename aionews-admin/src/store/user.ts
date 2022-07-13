/**
 * @file User store
 */

import nodepress from '@/services/nodepress'
import { User } from '@/constants/user'
import { ResponsePaginationData, GeneralPaginateQueryParams } from '@/constants/request'

export const USER_API_PATH = '/user'

/** get User parameter */
export interface GetUserParams extends GeneralPaginateQueryParams {
  /** search keyword */
  keyword?: string
}

/** get list of Users */
export function getUsers(params: GetUserParams = {}) {
  return nodepress
    .get<ResponsePaginationData<User>>(USER_API_PATH, { params })
    .then((response) => response.result)
}

/** Create labels */
export function createUser(user: User) {
  return nodepress.post(USER_API_PATH, user).then((response) => response.result)
}

/** Edit users */
export function putUser(user: User) {
  return nodepress.put(`${USER_API_PATH}?id=${user._id}`, user).then((response) => response.result)
}

/** remove user */
export function deleteUser(userId: string) {
  return nodepress.delete(`${USER_API_PATH}/${userId}`).then((response) => response.result)
}

/** Delete user in bulk */
export function deleteUsers(userIds: string[]) {
  return nodepress
    .delete(USER_API_PATH, { data: { user_ids: userIds } })
    .then((response) => response.result)
}
