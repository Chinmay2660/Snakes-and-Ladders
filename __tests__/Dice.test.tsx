import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'

import { Dice } from '../src/components/Dice'

describe('Dice component', () => {
  it('invokes roll handler on click', () => {
    const onRoll = jest.fn()
    render(<Dice value={3} onRoll={onRoll} />)
    fireEvent.click(screen.getByRole('button', { name: /roll dice/i }))
    expect(onRoll).toHaveBeenCalled()
  })

  it('supports keyboard activation', () => {
    const onRoll = jest.fn()
    render(<Dice value={null} onRoll={onRoll} />)
    const display = screen.getByRole('img')
    fireEvent.keyDown(display, { key: 'Enter' })
    expect(onRoll).toHaveBeenCalledTimes(1)
  })
})
