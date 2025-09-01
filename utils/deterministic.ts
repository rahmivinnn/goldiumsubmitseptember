/**
 * Deterministic seeded random number generator
 * Fixes hydration mismatches by ensuring server and client generate identical values
 */

export function seededRandom(seed: number) {
  let currentSeed = seed
  return function() {
    currentSeed = (currentSeed * 9301 + 49297) % 233280
    return currentSeed / 233280
  }
}

/**
 * Generate a deterministic seed from a string (e.g., component name + props)
 */
export function stringToSeed(str: string): number {
  let hash = 0
  if (str.length === 0) return hash
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Generate deterministic particles for animations
 */
export function generateDeterministicParticles(
  count: number,
  seed: string | number,
  options: {
    xRange?: [number, number]
    yRange?: [number, number]
    sizeRange?: [number, number]
    opacityRange?: [number, number]
    durationRange?: [number, number]
  } = {}
) {
  const {
    xRange = [0, 100],
    yRange = [0, 100],
    sizeRange = [1, 3],
    opacityRange = [0.2, 0.7],
    durationRange = [10, 20]
  } = options

  const seedValue = typeof seed === 'string' ? stringToSeed(seed) : seed
  const rng = seededRandom(seedValue)
  
  const particles = []
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: xRange[0] + rng() * (xRange[1] - xRange[0]),
      y: yRange[0] + rng() * (yRange[1] - yRange[0]),
      size: sizeRange[0] + rng() * (sizeRange[1] - sizeRange[0]),
      opacity: opacityRange[0] + rng() * (opacityRange[1] - opacityRange[0]),
      duration: durationRange[0] + rng() * (durationRange[1] - durationRange[0]),
      delay: rng() * 3,
      moveX: (rng() - 0.5) * 100,
      moveY: (rng() - 0.5) * 100
    })
  }
  return particles
}

/**
 * Generate deterministic stars for background animations
 */
export function generateDeterministicStars(
  count: number,
  seed: string | number
) {
  return generateDeterministicParticles(count, seed, {
    xRange: [0, 100],
    yRange: [0, 100],
    sizeRange: [1, 3],
    opacityRange: [0.3, 1],
    durationRange: [2, 5]
  })
}

/**
 * Generate deterministic floating dots for hero sections
 */
export function generateDeterministicDots(
  count: number,
  seed: string | number
) {
  return generateDeterministicParticles(count, seed, {
    xRange: [0, 100],
    yRange: [0, 100],
    sizeRange: [1, 2],
    opacityRange: [0.2, 0.6],
    durationRange: [3, 8]
  })
}