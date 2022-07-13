/**
 * @file sticky event hack lib
 * @module effect.sticky
 * 
 */

import StickyEvents from 'sticky-events'

declare global {
  interface Window {
    $StickyEvents: any
  }
}

export const exportStickyEventsToGlobal = () => {
  window.$StickyEvents = StickyEvents
}
