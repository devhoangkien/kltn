/**
 * @file copyright
 * @module effect.copyright
 * 
 */

import { META } from '/@/config/app.config'

declare global {
  interface Window {
    __isEnabledCopyrighter: boolean
  }
}

export const enableCopyrighter = () => {
  window.__isEnabledCopyrighter = true
}

export const disableCopyrighter = () => {
  window.__isEnabledCopyrighter = false
}

export const initCopyrighter = () => {
  enableCopyrighter()

  const copyText = () => {
    return [
      '',
      'Copyright belongs to the author.',
      'For commercial reprints, please contact the author for authorization, and for non-commercial reprints, please indicate the source.',
      `Author: ${META.author}`,
      'Link: ' + location.href,
      `Source: ${META.title}`,
      ''
    ].join('\n')
  }

  const buildText = (content) => content + copyText()
  const buildHtml = (content) => content + copyText()

  document.addEventListener('copy', (event) => {
    if (!window.getSelection) return
    if (window.__isEnabledCopyrighter) {
      const content = window.getSelection()?.toString()
      event.clipboardData?.setData('text/plain', buildText(content))
      event.clipboardData?.setData('text/html', buildHtml(content))
      event.preventDefault()
    }
  })
}
