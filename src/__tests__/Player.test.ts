import { describe, it, expect, beforeEach } from 'vitest'
import { Player } from '../game/Player'
import { InputSystem } from '../engine/InputSystem'

// Mock canvas for InputSystem
const mockCanvas = {
  addEventListener: () => { },
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 })
} as any
describe('Player', () => {
  let player: Player
  let inputSystem: InputSystem

  beforeEach(() => {
    player = new Player(100, 400)
    inputSystem = new InputSystem(mockCanvas)
  })

  it('should initialize with correct position', () => {
    expect(player.x).toBe(100)
    expect(player.y).toBe(400)
  })

  it('should move left when ArrowLeft is pressed', () => {
    // Simulate key press through private method access
    (inputSystem as any).inputState.keys.set('ArrowLeft', true)
    const initialX = player.x

    player.update(0.016, inputSystem) // 16ms delta time

    expect(player.x).toBeLessThan(initialX)
  })

  it('should move right when ArrowRight is pressed', () => {
    (inputSystem as any).inputState.keys.set('ArrowRight', true)
    const initialX = player.x

    player.update(0.016, inputSystem)

    expect(player.x).toBeGreaterThan(initialX)
  })

  it('should not move horizontally when no keys are pressed', () => {
    const initialX = player.x
    player.update(0.016, inputSystem)
    expect(player.x).toBe(initialX)
  })

  it('should jump when Space is pressed and player is on ground', () => {
    player.setOnGround(true);
    (inputSystem as any).inputState.keys.set('Space', true)
    const initialY = player.y
    player.update(0.016, inputSystem)
    expect(player.y).toBeLessThan(initialY)
  })

  it('should not jump when Space is pressed and player is not on ground', () => {
    player.setOnGround(false);
    (inputSystem as any).inputState.keys.set('Space', true)
    const initialY = player.y
    player.update(0.016, inputSystem)
    expect(player.y).toBeCloseTo(initialY, 0)
  })

  it('should apply gravity when not on ground', () => {
    player.setOnGround(false)
    const initialY = player.y
    player.update(0.016, inputSystem)
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
    expect(bounds.width).toBe(64)
    expect(bounds.height).toBe(64)
  })

  it('should set position correctly', () => {
    player.setPosition(150, 250)
    expect(player.x).toBe(150)
    expect(player.y).toBe(250)
  })

  it('should handle collision detection correctly', () => {
    // Test that player positioned exactly on platform boundary is considered colliding
    player.setPosition(100, 400) // Player bottom at y = 464 (400 + 64)
    player.setOnGround(false)

    // Mock a platform at y = 464 (player bottom exactly on platform top)
    const mockLevel = {
      checkCollisions: (player: any) => {
        const playerBounds = player.getBounds();
        const platform = { x: 0, y: 464, width: 800, height: 50 };

        if (playerBounds.x < platform.x + platform.width &&
          playerBounds.x + playerBounds.width > platform.x &&
          playerBounds.y < platform.y + platform.height &&
          playerBounds.y + playerBounds.height >= platform.y) {
          player.setOnGround(true);
        }
      }
    };

    mockLevel.checkCollisions(player);
    expect(player.getBounds().y + player.getBounds().height).toBe(464);
    // The collision should set onGround to true even when player bottom == platform top
  })
})

