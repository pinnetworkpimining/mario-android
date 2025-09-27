import { describe, it, expect, beforeEach } from 'vitest'
import { InteractiveEnemy } from '../game/InteractiveEnemy'

describe('InteractiveEnemy', () => {
  let shooter: InteractiveEnemy
  let bomber: InteractiveEnemy
  let sniper: InteractiveEnemy

  beforeEach(() => {
    shooter = new InteractiveEnemy(100, 100, 'SHOOTER')
    bomber = new InteractiveEnemy(200, 100, 'BOMBER')
    sniper = new InteractiveEnemy(300, 100, 'SNIPER')
  })

  it('should initialize with correct properties for different types', () => {
    expect(shooter.getType()).toBe('SHOOTER')
    expect(bomber.getType()).toBe('BOMBER')
    expect(sniper.getType()).toBe('SNIPER')
  })

  it('should have correct bounds', () => {
    const bounds = shooter.getBounds()
    expect(bounds.x).toBe(100)
    expect(bounds.y).toBe(100)
    expect(bounds.width).toBe(48)
    expect(bounds.height).toBe(48)
  })

  it('should not shoot immediately after creation', () => {
    expect(shooter.shouldShoot()).toBe(false)
    expect(bomber.shouldShoot()).toBe(false)
    expect(sniper.shouldShoot()).toBe(false)
  })

  it('should take damage and be defeated', () => {
    expect(shooter.isDefeated()).toBe(false)
    
    // Shooter has 3 health
    shooter.takeDamage()
    expect(shooter.isDefeated()).toBe(false)
    
    shooter.takeDamage()
    expect(shooter.isDefeated()).toBe(false)
    
    shooter.takeDamage()
    expect(shooter.isDefeated()).toBe(true)
  })

  it('should have different detection ranges', () => {
    expect(shooter.getDetectionRange()).toBe(300)
    expect(bomber.getDetectionRange()).toBe(200)
    expect(sniper.getDetectionRange()).toBe(500)
  })

  it('should update without errors', () => {
    expect(() => shooter.update(16)).not.toThrow()
    expect(() => bomber.update(16)).not.toThrow()
    expect(() => sniper.update(16)).not.toThrow()
  })
})