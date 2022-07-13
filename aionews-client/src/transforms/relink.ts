/**
 * @file Site inner link transformer
 * @module transform.relink
 * 
 */

import { TagMap } from '/@/stores/tag'
import { getTagFlowRoute } from './route'

export default (text: string, tagMap: TagMap) => {
  const tagNames = Object.keys(tagMap).sort((prev, next) => next.length - prev.length)
  const tagRegexp = eval(`/${tagNames.join('|')}/ig`)

  // Do not process if it is a URL
  try {
    new URL(text)
    return text
  } catch (error) {
    return text.replace(tagRegexp, (tagText) => {
      const foundTag = tagMap.get(tagText)

      if (!foundTag || text[0] === '#') {
        return tagText
      }

      const slug = foundTag.slug
      const path = getTagFlowRoute(slug)
      const command = `window.$app.config.globalProperties.$router.push({ path: \'${path}\' });return false`
      return `<a href=\"${path}\" title=\"${foundTag.description}\" onclick=\"${command}\">${tagText}</a>`
    })
  }
}
