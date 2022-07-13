/**
 * @file BFF Server helper
 * @module server.helper
 * 
 */

import path from 'path'
import { isDev } from '@/environment'

// MARK: 
export const NODEPRESS_API = `https://api.aio.news`

export const ROOT_PATH = process.cwd()
export const DIST_PATH = path.join(ROOT_PATH, 'dist')
export const PRDO_CLIENT_PATH = path.join(DIST_PATH, 'client')
export const PRDO_SERVER_PATH = path.join(DIST_PATH, 'server')

export const PUBLIC_PATH = isDev ? path.join(ROOT_PATH, 'public') : PRDO_CLIENT_PATH
