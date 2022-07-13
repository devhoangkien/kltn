/**
 * @file Global http request and response interface
 */

/** Common request parameters */
export interface GeneralQueryParams {
  [key: string]: number | string | void
}

/** General page turning request parameters */
export interface GeneralPaginateQueryParams extends GeneralQueryParams {
  page?: number
  per_page?: number
}

/** Page turning parameters */
export interface Pagination {
  current_page: number
  total_page: number
  per_page: number
  total: number
}

/** data body structure */
export interface ResponseData<T> {
  data: T
}

/** data body structure */
export interface ResponsePaginationData<T> {
  data: T[]
  pagination?: Pagination
}
