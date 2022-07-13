/**
 * @file BFF server config
 * @module config.bff
 * 
 */

export const BFF_TUNNEL_PREFIX = '/_tunnel'
export const BFF_PROXY_PREFIX = '/_proxy'
export const BFF_PROXY_ALLOWLIST = ['https://aio.news', 'https://cdn.aio.news']

export const getBFFServerPort = () => Number(process.env.PORT || 3000)
