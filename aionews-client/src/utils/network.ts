/**
 * @file Network
 * @module util.network
 * 
 */

import axios from 'axios'

export const ping = (url: string) => {
  return axios.request({
    url,
    method: 'get',
    timeout: 1888
  })
}

export const isOutsideOfGFW = () => {
  return ping('https://www.google.com.hk')
}
