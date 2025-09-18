import { describe, it, expect, beforeEach } from 'vitest'
import { InputManager } from '../game/InputManager'

describe('InputManager', () => {
  let inputManager: InputManager

  beforeEach(() => {
    inputManager = new InputManager()
  })

  it('should initialize with no keys pressed', () => {
    expect(inputManager.isKeyPressed('ArrowLeft')).toBe(false)
    expect(inputManager.isKeyPressed('ArrowRight')).toBe(false)
    expect(inputManager.isKeyPressed('Space')).toBe(false)
  })

  it('should set key state correctly', () => {
    inputManager.setKeyState('ArrowLeft', true)
    expect(inputManager.isKeyPressed('ArrowLeft')).toBe(true)
    
    inputManager.setKeyState('ArrowLeft', false)
    expect(inputManager.isKeyPressed('ArrowLeft')).toBe(false)
  })

  it('should handle multiple keys independently', () => {
    inputManager.setKeyState('ArrowLeft', true)
    inputManager.setKeyState('Space', true)
    
    expect(inputManager.isKeyPressed('ArrowLeft')).toBe(true)
    expect(inputManager.isKeyPressed('Space')).toBe(true)
    expect(inputManager.isKeyPressed('ArrowRight')).toBe(false)
  })

  it('should update key state correctly', () => {
    inputManager.setKeyState('ArrowRight', true)
    expect(inputManager.isKeyPressed('ArrowRight')).toBe(true)
    
    inputManager.setKeyState('ArrowRight', false)
    expect(inputManager.isKeyPressed('ArrowRight')).toBe(false)
  })
})

