/**
 * @file Random number
 * @module util.random
 * 
 */

export const randomNumber = (max: number): number => {
  return Math.floor(Math.random() * max) + 1
}
