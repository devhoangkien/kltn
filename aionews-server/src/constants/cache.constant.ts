/**
 * @file Global cache constant
 * @description Constant key for global cache
 * @module constant/cache
 * 
 */

export const CACHE_PREFIX = '__nodepress_cache_'
export const OPTION = CACHE_PREFIX + 'option'
export const ALL_TAGS = CACHE_PREFIX + 'all-tags'
export const HOTTEST_ARTICLES = CACHE_PREFIX + 'hottest-articles'
export const ARCHIVE = CACHE_PREFIX + 'archive'
export const TODAY_VIEWS = CACHE_PREFIX + 'today-views'
export const ALL_USERS = CACHE_PREFIX + 'all-users'

export const getDisqusCacheKey = (key: string) => {
  return `${CACHE_PREFIX}-disqus-${key}`
}
