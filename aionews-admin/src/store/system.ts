/**
 * @file System store
 */

import nodepress from '@/services/nodepress'
import { Option } from '@/constants/option'

export const OPTION_API_PATH = '/option'
export const ARCHIVE_API_PATH = '/archive'
export const EXPANSION_API_PATH = {
  UPLOAD: '/expansion/upload',
  STATISTIC: '/expansion/statistic',
  GOOGLE_TOKEN: '/expansion/google-token',
  DATA_BASE_BACKUP: '/expansion/database-backup',
}

export interface Statistics {
  [key: string]: number
}
/** Get site-wide statistics */
export function getStatistics() {
  return nodepress.get<Statistics>(EXPANSION_API_PATH.STATISTIC).then((response) => response.result)
}

export interface ArticleCalendarItem {
  date: string
  count: number
}
/** Get article authoring calendar information */
export function getArticleCalendar() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return nodepress
    .get<Array<ArticleCalendarItem>>('/article/calendar', { params: { timezone } })
    .then((response) => response.result)
}

/** Obtain GA Token */
export function getGAToken(): Promise<string> {
  return nodepress
    .get<any>(EXPANSION_API_PATH.GOOGLE_TOKEN)
    .then(({ result: credentials }) => credentials.access_token as string)
}

/** 更新 Archive 缓存 */
export function updateArchiveCache() {
  return nodepress.patch<void>(ARCHIVE_API_PATH).then((response) => response.result)
}

/** 更新数据库备份 */
export function updateDatabaseBackup() {
  return nodepress.patch(EXPANSION_API_PATH.DATA_BASE_BACKUP).then((response) => response.result)
}

/** Get system configuration */
export function getOption() {
  return nodepress.get<Option>(OPTION_API_PATH).then((response) => response.result)
}

/** Update system configuration */
export function putOption(option: Option) {
  return nodepress.patch<Option>(OPTION_API_PATH, option).then((response) => response.result)
}

/** Upload static files */
export async function uploadStaticToNodePress(options: {
  file: File
  name: string
  onProgress?: (progress: number) => void
}) {
  const param = new FormData()
  param.append('file', options.file)
  param.append('name', options.name)
  return nodepress
    .post<{
      url: string
      key: string
      size: number
    }>(EXPANSION_API_PATH.UPLOAD, param, {
      onUploadProgress: ({ loaded, total }) => {
        const progress = (loaded / total) * 100
        options.onProgress?.(progress)
      },
    })
    .then((response) => response.result)
}
