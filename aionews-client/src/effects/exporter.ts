/**
 * @file App exporter
 * @module effect.exporter
 * 
 */

import { App } from 'vue'

declare global {
  interface Window {
    $app: App
  }
}

export const exportAppToGlobal = (app: App) => {
  window.$app = app
}
