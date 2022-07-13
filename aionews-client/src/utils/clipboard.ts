/**
 * @file Clipboard util
 * @module util.clipboard
 * 
 */

import { enableCopyrighter, disableCopyrighter } from '/@/effects/copyright'

export const read = () => navigator.clipboard.readText()
export const copy = (text: string) => {
  disableCopyrighter()
  // https://www.w3.org/TR/clipboard-apis/#async-clipboard-api
  // MARK: only https site
  return window.navigator.clipboard?.writeText(text).finally(() => {
    enableCopyrighter()
  })
}

export default { copy, read }
