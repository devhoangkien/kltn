/**
 * @file Article store
 */

import nodepress from '@/services/nodepress'
import { PublishState } from '@/constants/publish'
import { SortTypeWithHot } from '@/constants/sort'
import { ArticleId, Article } from '@/constants/article'
import { ArticleOrigin } from '@/constants/article/origin'
import { ArticlePublic } from '@/constants/article/public'
import { ResponsePaginationData, GeneralPaginateQueryParams } from '@/constants/request'

export const ARTICLE_API_PATH = '/article'

/** Get article parameters */
export interface GetArticleParams extends GeneralPaginateQueryParams {
  sort?: SortTypeWithHot
  state?: PublishState
  public?: ArticlePublic
  origin?: ArticleOrigin
  keyword?: string
  tag_slug?: string
  category_slug?: string
}
/** Get a list of articles */
export function getArticles(params: GetArticleParams = {}) {
  return nodepress
    .get<ResponsePaginationData<Article>>(ARTICLE_API_PATH, { params })
    .then((response) => response.result)
}

/** Get article details */
export function getArticle(articleID: ArticleId) {
  return nodepress
    .get<Article>(`${ARTICLE_API_PATH}/${articleID}`)
    .then((response) => response.result)
}

/** Create an article */
export function createArticle(article: Article) {
  return nodepress.post<Article>(ARTICLE_API_PATH, article).then((response) => response.result)
}

/** modify articles */
export function putArticle(article: Article) {
  return nodepress
    .put<Article>(`${ARTICLE_API_PATH}/${article._id}`, article)
    .then((response) => response.result)
}

/** Bulk edit article status */
export function patchArticlesState(articleIds: ArticleId[], state: PublishState) {
  return nodepress
    .patch(ARTICLE_API_PATH, { article_ids: articleIds, state })
    .then((response) => response.result)
}

/** Delete articles in bulk */
export function deleteArticles(articleIds: ArticleId[]) {
  return nodepress
    .delete(ARTICLE_API_PATH, { data: { article_ids: articleIds } })
    .then((response) => response.result)
}
