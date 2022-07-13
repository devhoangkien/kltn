/**
 * @file Universal state
 * @module store.universal
 */

import { defineStore } from 'pinia'
import { getJSON, setJSON, remove } from '/@/utils/storage'
import nodepress from '/@/services/nodepress'


export const USER_API_PATH = '/user/login'

export interface User {
  id: number
  _id: string
  email: string
  userName: string
  avatar: string
  password: string
  level: number
  point: number
  vip: number
  update_at: string
  create_at: string
}
export const useLoginStore = defineStore('user', {
  state: () => ({
    user: null as null | User
  }),
  getters: {
    isLoggedIn() {
      return !!this.user
    }
  },
  actions: {
    async login(email: string, password: string) {
      const res = await nodepress.post(USER_API_PATH, { email, password })
      if (res.status === 200) {
        this.user = res.data
        // setJSON(UNIVERSAL_STORGAE_KEY, this.state)
      }
      return res
    }
  }
})
