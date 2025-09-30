import { describe, it, expect, beforeEach } from 'vitest'
import { PhysicsSystem, PhysicsBody } from '../engine/PhysicsSystem'

describe('PhysicsSystem', () => {
  let physics: PhysicsSystem

  beforeEach(() => {
    physics = new PhysicsSystem()
  })

  it('should initialize correctly', () => {
    expect(physics).toBeDefined()
  })

  it('should create physics bodies', () => {
    const body = physics.createBody({
      id: 'test-body',
      position: { x: 100, y: 100 },
      bounds: { x: 100, y: 100, width: 32, height: 32 }
    })

    expect(body).toBeDefined()
    expect(body.id).toBe('test-body')
    expect(body.position.x).toBe(100)
    expect(body.position.y).toBe(100)
  })

  it('should retrieve bodies by id', () => {
    const body = physics.createBody({
      id: 'test-body',
      position: { x: 100, y: 100 },
      bounds: { x: 100, y: 100, width: 32, height: 32 }
    })

    const retrieved = physics.getBody('test-body')
    expect(retrieved).toBe(body)
  })

  it('should remove bodies', () => {
    physics.createBody({
      id: 'test-body',
      position: { x: 100, y: 100 },
      bounds: { x: 100, y: 100, width: 32, height: 32 }
    })

    physics.removeBody('test-body')
    const retrieved = physics.getBody('test-body')
    expect(retrieved).toBeUndefined()
  })

  it('should update without errors', () => {
    physics.createBody({
      id: 'test-body',
      position: { x: 100, y: 100 },
      bounds: { x: 100, y: 100, width: 32, height: 32 }
    })

    expect(() => physics.update(16)).not.toThrow()
  })

  it('should handle gravity', () => {
    const gravity = physics.getGravity()
    expect(gravity.x).toBe(0)
    expect(gravity.y).toBe(980)

    physics.setGravity(10, 500)
    const newGravity = physics.getGravity()
    expect(newGravity.x).toBe(10)
    expect(newGravity.y).toBe(500)
  })

  it('should get all bodies', () => {
    physics.createBody({
      id: 'body1',
      position: { x: 100, y: 100 },
      bounds: { x: 100, y: 100, width: 32, height: 32 }
    })

    physics.createBody({
      id: 'body2',
      position: { x: 200, y: 200 },
      bounds: { x: 200, y: 200, width: 32, height: 32 }
    })

    const allBodies = physics.getAllBodies()
    expect(allBodies).toHaveLength(2)
  })

  it('should handle collision callbacks', () => {
    const body = physics.createBody({
      id: 'test-body',
      position: { x: 100, y: 100 },
      bounds: { x: 100, y: 100, width: 32, height: 32 }
    })

    let callbackCalled = false
    physics.onCollision('test-body', () => {
      callbackCalled = true
    })

    // Callback registration should not throw
    expect(callbackCalled).toBe(false)
  })
})