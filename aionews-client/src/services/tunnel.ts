/**
 * @file SSR BFF API Tunnel
 * @module service.tunnel
 * 
 */

import axios, { AxiosInstance } from 'axios'
import { BFF_TUNNEL_PREFIX, getBFFServerPort } from '/@/config/bff.config'
import { TunnelModule } from '/@/constants/tunnel'
import { isServer } from '/@/app/environment'

const tunnel = axios.create({
  baseURL: BFF_TUNNEL_PREFIX,
  proxy: isServer && {
    host: 'localhost',
    port: getBFFServerPort()
  }
})

tunnel.interceptors.response.use((response) => response.data)

export default {
  $: tunnel,
  request: <T = any>(...args: Parameters<AxiosInstance['request']>): Promise<T> => {
    return tunnel.request(...args)
  },
  dispatch: <T = any>(module: TunnelModule, params?: any): Promise<T> => {
    return tunnel.get(module, { params })
  }
}
