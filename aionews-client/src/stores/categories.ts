/**
 * @file category state
 * @module store.category
 */

import { defineStore } from 'pinia'
import { firstUpperCase } from '/@/transforms/text'
import { UniversalKeyValue } from '/@/constants/state'
import nodepress from '/@/services/nodepress'

export type CategoryMap = Map<string, Category>
export interface Category {
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

export const categoryEnName = (category: Category) => {
  // english name
  if (!/.*[\u4e00-\u9fa5]+.*$/.test(category.name)) {
    return category.name
  }
  // english words
  if (category.slug.includes('-')) {
    return category.slug
  }
  // english word
  return firstUpperCase(category.slug)
}

export const categoryViName = (category: Category) => {
  // english name
  if (!/.*[\u4e00-\u9fa5]+.*$/.test(category.name)) {
    return category.name
  }
  // english words
  if (category.slug.includes('-')) {
    return category.slug
  }
  // english word
  return firstUpperCase(category.slug)
}

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    fetched: false,
    fetching: false,
    categories: [] as Array<Category>
  }),
  getters: {
    // sort by count
    sorted: (state) => {
      const category = [...state.categories]
      category.sort((a, b) => b.articles_count - a.articles_count)
      return category
    },
    // List of full category (self, all lowercase, all uppercase, initial capital)
    fullNameCategory: (state): CategoryMap => {
      const category = state.categories
      const categoryMap: CategoryMap = new Map()
      category.forEach((tag) => {
        categoryMap.set(tag.name, tag)
        categoryMap.set(tag.name.toLowerCase(), tag)
        categoryMap.set(tag.name.toUpperCase(), tag)
        categoryMap.set(firstUpperCase(tag.name), tag)
      })
      return categoryMap
    }
  },
  actions: {
    fetchAll() {
      if (this.fetched) {
        return Promise.resolve()
      }

      this.fetching = true
      return nodepress
        .get('/category/all')
        .then((response) => {
          this.categories = response.result
          this.fetched = true
        })
        .finally(() => {
          this.fetching = false
        })
    }
  }
})
