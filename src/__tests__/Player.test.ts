import { describe, it, expect, beforeEach } from 'vitest'
import { Player } from '../game/Player'
import { InputManager } from '../game/InputManager'

describe('Player', () => {
  let player: Player
  let inputManager: InputManager

  beforeEach(() => {
    player = new Player(100, 400)
    inputManager = new InputManager()
  })

  it('should initialize with correct position', () => {
    expect(player.x).toBe(100)
    expect(player.y).toBe(400)
  })

  it('should move left when ArrowLeft is pressed', () => {
    inputManager.setKeyState('ArrowLeft', true)
    const initialX = player.x
    
    player.update(16, inputManager) // 16ms delta time
    
    expect(player.x).toBeLessThan(initialX)
  })

  it('should move right when ArrowRight is pressed', () => {
    inputManager.setKeyState('ArrowRight', true)
    const initialX = player.x
    
    player.update(16, inputManager)
    
    expect(player.x).toBeGreaterThan(initialX)
  })

  it('should not move horizontally when no keys are pressed', () => {
    const initialX = player.x
    player.update(16, inputManager)
    expect(player.x).toBe(initialX)
  })

  it('should jump when Space is pressed and player is on ground', () => {
    player.setOnGround(true)
    inputManager.setKeyState('Space', true)
    const initialY = player.y
    player.update(16, inputManager)
    expect(player.y).toBeLessThan(initialY)
  })

  it('should not jump when Space is pressed and player is not on ground', () => {
    player.setOnGround(false)
    inputManager.setKeyState('Space', true)
    const initialY = player.y
    player.update(16, inputManager)
  expect(player.y).toBeCloseTo(initialY, 0)
  })

  it('should apply gravity when not on ground', () => {
    player.setOnGround(false)
    const initialY = player.y
    player.update(16, inputManager)
    expect(player.y).toBeGreaterThan(initialY)
  })

  it('should lose life and handle death correctly', () => {
    const initialLives = player.getLives()
    player.loseLife()
    expect(player.getLives()).toBe(initialLives - 1)
  })

  it('should reset position correctly', () => {
    player.setPosition(300, 500)
    player.reset(100, 400)
    expect(player.x).toBe(100)
    expect(player.y).toBe(400)
    expect(player.getVelocityY()).toBe(0)
  })

  it('should get correct bounds', () => {
    const bounds = player.getBounds()
    expect(bounds.x).toBe(player.x)
    expect(bounds.y).toBe(player.y)
    expect(bounds.width).toBe(32)
    expect(bounds.height).toBe(32)
  })

  it('should set position correctly', () => {
    player.setPosition(150, 250)
    expect(player.x).toBe(150)
    expect(player.y).toBe(250)
  })
})

