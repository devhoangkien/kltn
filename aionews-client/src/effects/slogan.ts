/**
 * @file Slogan consoler
 * @module effect.slogan
 * 
 */

export const consoleSlogan = (slogan: string, email?: string) => {
  console.clear()
  console.log(
    `%c${slogan} %c${email || ''}`,
    'color:#666;font-size:3em;',
    'color:#666;font-size:13px;'
  )
}
