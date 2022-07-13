/**
 * @file amplitude player
 * @module effect.amplitude
 * 
 */

import amplitude from 'amplitudejs'
import { onClient } from '/@/universal'

declare global {
  interface Window {
    Amplitude: any
    AmplitudeCore: any
  }
}

onClient(() => {
  window.Amplitude = window.Amplitude || amplitude
})

export default amplitude
