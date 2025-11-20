import { describe, expect, it } from '@jest/globals'

import { getPathBetween, squareToCoords } from '../src/utils/boardHelpers'

describe('boardHelpers', () => {
  it('converts square to coordinates with zig-zag layout', () => {
    const first = squareToCoords(1)
    const tenth = squareToCoords(10)
    const eleventh = squareToCoords(11)

    expect(first.column).toBe(0)
    expect(first.row).toBe(9)
    expect(tenth.column).toBe(9)
    expect(eleventh.column).toBe(9)
  })

  it('produces linear path between squares', () => {
    expect(getPathBetween(1, 3)).toEqual([2, 3])
    expect(getPathBetween(5, 3)).toEqual([4, 3])
    expect(getPathBetween(2, 2)).toEqual([])
  })
})
