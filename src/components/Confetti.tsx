import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
  shape: 'circle' | 'square' | 'star'
}

const COLORS = [
  '#f59e0b',
  '#ef4444',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f97316',
  '#14b8a6',
  '#fbbf24',
  '#34d399',
]

const createBurst = (
  centerX: number,
  centerY: number,
  count: number,
  startId: number,
): Particle[] => {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const velocity = Math.random() * 15 + 10
    return {
      id: startId + i,
      x: centerX,
      y: centerY,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 10 + 6,
      speedX: Math.cos(angle) * velocity,
      speedY: Math.sin(angle) * velocity,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      shape: Math.random() > 0.7 ? 'star' : Math.random() > 0.5 ? 'circle' : 'square',
    }
  })
}

export const Confetti = ({ isActive }: { isActive: boolean }) => {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!isActive) {
      // Cleanup particles when inactive
      const cleanup = () => setParticles([])
      cleanup()
      return
    }

    // Create multiple bursts from different positions
    const bursts: Particle[] = []
    let particleId = 0

    // Main center burst
    bursts.push(...createBurst(50, 50, 80, particleId))
    particleId += 80

    // Add delayed bursts for more dramatic effect
    const burstTimer1 = setTimeout(() => {
      const newBursts = createBurst(50, 50, 50, particleId)
      setParticles((prev) => [...prev, ...newBursts])
    }, 300)

    const burstTimer2 = setTimeout(() => {
      const newBursts = createBurst(50, 50, 40, particleId + 50)
      setParticles((prev) => [...prev, ...newBursts])
    }, 600)

    // Use requestAnimationFrame to set initial particles
    requestAnimationFrame(() => {
      setParticles(bursts)
    })

    // Animate particles using requestAnimationFrame for smoother rendering
    let animationFrameId: number | null = null
    let isAnimating = true
    const animate = () => {
      if (!isAnimating) return
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.speedX * 0.1,
            y: p.y + p.speedY * 0.1,
            speedX: p.speedX * 0.98, // Friction
            speedY: p.speedY + 0.4, // Gravity
            rotation: p.rotation + p.rotationSpeed,
            rotationSpeed: p.rotationSpeed * 0.98, // Slow down rotation
          }))
          .filter((p) => p.y < 120 && p.x > -20 && p.x < 120 && p.size > 0.5),
      )
      animationFrameId = requestAnimationFrame(animate)
    }
    animationFrameId = requestAnimationFrame(animate)

    return () => {
      isAnimating = false
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      clearTimeout(burstTimer1)
      clearTimeout(burstTimer2)
    }
  }, [isActive])

  if (!isActive || particles.length === 0) return null

  const renderParticle = (particle: Particle) => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      backgroundColor: particle.color,
      transform: `translate3d(-50%, -50%, 0) rotate(${particle.rotation}deg)`,
      boxShadow: `0 0 ${particle.size * 1.5}px ${particle.color}, 0 0 ${particle.size * 2.5}px ${particle.color}40`,
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
      isolation: 'isolate',
      contain: 'strict',
      imageRendering: 'crisp-edges',
      pointerEvents: 'none',
      outline: 'none',
      border: 'none',
    }

    if (particle.shape === 'circle') {
      return <div key={particle.id} className="absolute rounded-full" style={baseStyle} />
    } else if (particle.shape === 'star') {
      return (
        <div
          key={particle.id}
          className="absolute"
          style={{
            ...baseStyle,
            clipPath:
              'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          }}
        />
      )
    } else {
      return <div key={particle.id} className="absolute" style={baseStyle} />
    }
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[55] overflow-hidden"
      style={{
        willChange: 'contents',
        transform: 'translateZ(0)',
        isolation: 'isolate',
        contain: 'strict',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {particles.map(renderParticle)}
    </div>
  )
}
