export type SoundType = 'dice' | 'ladder' | 'snake' | 'win'

const createSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') return

  try {
    const ctx = new window.AudioContext()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.type = type
    oscillator.frequency.value = frequency

    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

    oscillator.connect(gain)
    gain.connect(ctx.destination)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)

    oscillator.addEventListener('ended', () => {
      ctx.close()
    })
  } catch (error) {
    console.warn('Failed to play sound', error)
  }
}

export const playSound = (type: SoundType) => {
  switch (type) {
    case 'dice':
      createSound(660, 0.15, 'triangle')
      break
    case 'ladder':
      createSound(523, 0.2, 'sine')
      setTimeout(() => createSound(659, 0.2, 'sine'), 100)
      setTimeout(() => createSound(784, 0.25, 'sine'), 200)
      break
    case 'snake':
      createSound(200, 0.3, 'sawtooth')
      setTimeout(() => createSound(150, 0.3, 'sawtooth'), 150)
      break
    case 'win':
      createSound(523, 0.15, 'sine')
      setTimeout(() => createSound(659, 0.15, 'sine'), 100)
      setTimeout(() => createSound(784, 0.15, 'sine'), 200)
      setTimeout(() => createSound(1047, 0.3, 'sine'), 300)
      break
  }
}
