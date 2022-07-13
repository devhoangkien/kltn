/**
 * @file Announcement store
 * 
 */

import nodepress from '@/services/nodepress'
import { Announcement } from '@/constants/announcement'
import { PublishState } from '@/constants/publish'
import { ResponsePaginationData, GeneralPaginateQueryParams } from '@/constants/request'

export const ANNOUNCEMENT_API_PATH = '/announcement'

/** Get announcement parameters */
export interface GetAnnouncementsParams extends GeneralPaginateQueryParams {
  /** search keyword */
  keyword?: string
  /** Post status */
  state?: PublishState
}
/** Get a list of announcements */
export function getAnnouncements(params: GetAnnouncementsParams = {}) {
  return nodepress
    .get<ResponsePaginationData<Announcement>>(ANNOUNCEMENT_API_PATH, { params })
    .then((response) => response.result)
}

/** Add announcement */
export function createAnnouncement(announcement: Announcement): Promise<any> {
  return nodepress
    .post<Announcement>(ANNOUNCEMENT_API_PATH, announcement)
    .then((response) => response.result)
}

/** Update announcement */
export function putAnnouncement(announcement: Announcement): Promise<any> {
  return nodepress
    .put<Announcement>(`${ANNOUNCEMENT_API_PATH}/${announcement._id}`, announcement)
    .then((response) => response.result)
}

/** delete announcement */
export function deleteAnnouncement(id: string) {
  return nodepress
    .delete<Announcement>(`${ANNOUNCEMENT_API_PATH}/${id}`)
    .then((response) => response.result)
}

/** Bulk delete announcements */
export function deleteAnnouncements(ids: Array<string>) {
  return nodepress
    .delete<any>(ANNOUNCEMENT_API_PATH, { data: { announcement_ids: ids } })
    .then((response) => response.result)
}
