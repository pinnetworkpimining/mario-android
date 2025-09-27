import { describe, it, expect, beforeEach } from 'vitest'
import { Projectile } from '../game/Projectile'

describe('Projectile', () => {
  let bullet: Projectile
  let bomb: Projectile
  let laser: Projectile

  beforeEach(() => {
    bullet = new Projectile(100, 100, 300, 0, 'BULLET')
    bomb = new Projectile(200, 100, 150, -100, 'BOMB')
    laser = new Projectile(300, 100, 500, 0, 'LASER')
  })

  it('should initialize with correct properties', () => {
    expect(bullet.getType()).toBe('BULLET')
    expect(bomb.getType()).toBe('BOMB')
    expect(laser.getType()).toBe('LASER')
  })

  it('should have correct bounds', () => {
    const bulletBounds = bullet.getBounds()
    expect(bulletBounds.x).toBe(100)
    expect(bulletBounds.y).toBe(100)
    expect(bulletBounds.width).toBe(8)
    expect(bulletBounds.height).toBe(4)

    const bombBounds = bomb.getBounds()
    expect(bombBounds.width).toBe(12)
    expect(bombBounds.height).toBe(12)

    const laserBounds = laser.getBounds()
    expect(laserBounds.width).toBe(16)
    expect(laserBounds.height).toBe(2)
  })

  it('should move when updated', () => {
    const initialX = bullet.x
    bullet.update(16) // 16ms
    expect(bullet.x).toBeGreaterThan(initialX)
  })

  it('should not be removed immediately', () => {
    expect(bullet.shouldRemove()).toBe(false)
    expect(bomb.shouldRemove()).toBe(false)
    expect(laser.shouldRemove()).toBe(false)
  })

  it('should be removed after life expires', () => {
    // Simulate time passing
    for (let i = 0; i < 200; i++) {
      bullet.update(16) // Total: 3200ms
    }
    expect(bullet.shouldRemove()).toBe(true)
  })

  it('should update without errors', () => {
    expect(() => bullet.update(16)).not.toThrow()
    expect(() => bomb.update(16)).not.toThrow()
    expect(() => laser.update(16)).not.toThrow()
  })
})