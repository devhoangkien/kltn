/**
 * @file App environment
 * @module app.environment
 * 
 */

import { getSSRSymbleStatus } from '/@/universal/context'

// app mode
export const isSSR = typeof window === 'undefined' || getSSRSymbleStatus()
export const isSPA = !isSSR

// runtime env
export const isServer = import.meta.env.SSR
export const isClient = !isServer
