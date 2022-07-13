/**
 * @file Tags state
 * @module store.tag
 * 
 */

import { defineStore } from 'pinia'
import { firstUpperCase } from '/@/transforms/text'
import { UniversalKeyValue } from '/@/constants/state'
import nodepress from '/@/services/nodepress'

export type TagMap = Map<string, Tag>
export interface Tag {
  id: number
  _id: string
  name: string
  slug: string
  description: string
  update_at: string
  create_at: string
  extends: UniversalKeyValue[]
  articles_count: number
}

export const tagEnName = (tag: Tag) => {
  // english name
  if (!/.*[\u4e00-\u9fa5]+.*$/.test(tag.name)) {
    return tag.name
  }
  // english words
  if (tag.slug.includes('-')) {
    return tag.slug
  }
  // english word
  return firstUpperCase(tag.slug)
}

export const tagViName = (tag: Tag) => {
  // english name
  if (!/.*[\u4e00-\u9fa5]+.*$/.test(tag.name)) {
    return tag.name
  }
  // english words
  if (tag.slug.includes('-')) {
    return tag.slug
  }
  // english word
  return firstUpperCase(tag.slug)
}

export const useTagStore = defineStore('tag', {
  state: () => ({
    fetched: false,
    fetching: false,
    tags: [] as Array<Tag>
  }),
  getters: {
    // sort by count
    sorted: (state) => {
      const tags = [...state.tags]
      tags.sort((a, b) => b.articles_count - a.articles_count)
      return tags
    },
    // List of full tags (self, all lowercase, all uppercase, initial capital)
    fullNameTags: (state): TagMap => {
      const tags = state.tags
      const tagMap: TagMap = new Map()
      tags.forEach((tag) => {
        tagMap.set(tag.name, tag)
        tagMap.set(tag.name.toLowerCase(), tag)
        tagMap.set(tag.name.toUpperCase(), tag)
        tagMap.set(firstUpperCase(tag.name), tag)
      })
      return tagMap
    }
  },
  actions: {
    fetchAll() {
      if (this.fetched) {
        return Promise.resolve()
      }

      this.fetching = true
      return nodepress
        .get('/tag/all')
        .then((response) => {
          this.tags = response.result
          this.fetched = true
        })
        .finally(() => {
          this.fetching = false
        })
    }
  }
})
