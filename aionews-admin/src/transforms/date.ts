/**
 * @file date handling
 */

import moment from 'moment'

/** Moment → second timestamp */
export const momentToTimestamp = (moment: moment.Moment) => moment.unix()

/** second timestamp → Moment */
export const timestampToMoment = (timestamp: number) => moment.unix(timestamp)

/** timestamp → YMD */
export const timestampToYMD = (timestamp: number) => {
  return moment(timestamp)?.format('YYYY-MM-DD HH:mm:ss')
}

/** time string → YMD */
export const stringToYMD = (timestamp: string) => {
  return moment(timestamp)?.format('YYYY-MM-DD HH:mm:ss')
}
