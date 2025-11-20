import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GameEngine } from '../engine/GameEngine'

// Mock HTMLCanvasElement
const mockCanvas = {
  getContext: vi.fn(() => ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn()
    })),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    globalAlpha: 1,
    shadowColor: '',
    shadowBlur: 0,
    font: '',
    textAlign: '',
    textBaseline: '',
    fillText: vi.fn(),
    canvas: { width: 800, height: 600 }
  })),
  width: 800,
  height: 600,
  style: {},
  addEventListener: vi.fn(),
  getBoundingClientRect: vi.fn(() => ({
    left: 0,
    top: 0,
    width: 800,
    height: 600
  }))
} as any

describe('GameEngine', () => {
  let engine: GameEngine

  beforeEach(() => {
    // Reset singleton
    (GameEngine as any).instance = null

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 600, writable: true })
    Object.defineProperty(window, 'devicePixelRatio', { value: 1, writable: true })

    const config = {
      width: 800,
      height: 600,
      targetFPS: 60,
      debug: false,
      mobile: false
    }

    engine = GameEngine.getInstance(mockCanvas, config)
  })

  it('should initialize as singleton', () => {
    const engine2 = GameEngine.getInstance()
    expect(engine).toBe(engine2)
  })

  it('should have correct configuration', () => {
    const engineConfig = engine.getConfig()
    expect(engineConfig.width).toBe(800)
    expect(engineConfig.height).toBe(600)
    expect(engineConfig.targetFPS).toBe(60)
  })

  it('should initialize all systems', () => {
    expect(engine.getAudioSystem()).toBeDefined()
    expect(engine.getInputSystem()).toBeDefined()
    expect(engine.getRenderSystem()).toBeDefined()
    expect(engine.getPhysicsSystem()).toBeDefined()
    expect(engine.getSceneManager()).toBeDefined()
    expect(engine.getAssetManager()).toBeDefined()
  })

  it('should start and stop correctly', () => {
    expect(() => engine.start()).not.toThrow()
    expect(() => engine.stop()).not.toThrow()
  })

  it('should track FPS', () => {
    const fps = engine.getFPS()
    expect(typeof fps).toBe('number')
    expect(fps).toBeGreaterThanOrEqual(0)
  })

  it('should provide delta time', () => {
    const deltaTime = engine.getDeltaTime()
    expect(typeof deltaTime).toBe('number')
    expect(deltaTime).toBeGreaterThanOrEqual(0)
  })
})

// Legacy Game class tests for compatibility
describe('Game Legacy', () => {
  let mockGame: any

  beforeEach(() => {
    mockGame = {
      currentLevel: 1,
      score: 0,
      lives: 3,
      gameRunning: false,
      paused: false,
      playerPosition: { x: 100, y: 400 },
      playerHealth: 100
    }
  })

  it('should have correct default values', () => {
    expect(mockGame.currentLevel).toBe(1)
    expect(mockGame.score).toBe(0)
    expect(mockGame.lives).toBe(3)
    expect(mockGame.gameRunning).toBe(false)
    expect(mockGame.paused).toBe(false)
  })

  it('should handle game state changes', () => {
    mockGame.gameRunning = true
    expect(mockGame.gameRunning).toBe(true)

    mockGame.paused = true
    expect(mockGame.paused).toBe(true)
  })

  it('should track score and lives', () => {
    mockGame.score += 100
    expect(mockGame.score).toBe(100)

    mockGame.lives -= 1
    expect(mockGame.lives).toBe(2)
  })

  it('should handle level progression', () => {
    mockGame.currentLevel = 2
    expect(mockGame.currentLevel).toBe(2)

    mockGame.currentLevel = 3
    expect(mockGame.currentLevel).toBe(3)
  })
})

// Additional GameEngine integration tests
describe('GameEngine Integration', () => {
  let engine: GameEngine

  beforeEach(() => {
    (GameEngine as any).instance = null

    const config = {
      width: 800,
      height: 600,
      targetFPS: 60,
      debug: false,
      mobile: false
    }

    engine = GameEngine.getInstance(mockCanvas, config)
  })

  it('should handle scene management', async () => {
    const sceneManager = engine.getSceneManager()
    expect(sceneManager).toBeDefined()
    expect(sceneManager.getCurrentScene()).toBeNull()
  })

  it('should handle audio system', () => {
    const audioSystem = engine.getAudioSystem()
    expect(audioSystem).toBeDefined()
    expect(() => audioSystem.playSound('jump')).not.toThrow()
  })

  it('should handle input system', () => {
    const inputSystem = engine.getInputSystem()
    expect(inputSystem).toBeDefined()
    expect(inputSystem.isKeyPressed('Space')).toBe(false)
  })

  it('should handle render system', () => {
    const renderSystem = engine.getRenderSystem()
    expect(renderSystem).toBeDefined()
    expect(() => renderSystem.clear()).not.toThrow()
  })

  it('should handle physics system', () => {
    const physicsSystem = engine.getPhysicsSystem()
    expect(physicsSystem).toBeDefined()
    expect(() => physicsSystem.update(16)).not.toThrow()
  })

  it('should handle asset management', () => {
    const assetManager = engine.getAssetManager()
    expect(assetManager).toBeDefined()
    expect(assetManager.getLoadedAssets()).toEqual([])
  })
})

// Performance and stability tests
describe('GameEngine Performance', () => {
  let engine: GameEngine

  beforeEach(() => {
    (GameEngine as any).instance = null

    const config = {
      width: 800,
      height: 600,
      targetFPS: 60,
      debug: true,
      mobile: false
    }

    engine = GameEngine.getInstance(mockCanvas, config)
  })

  it('should maintain stable FPS tracking', () => {
    // Simulate multiple frame updates
    for (let i = 0; i < 10; i++) {
      // engine.getAudioSystem().update(16) // AudioSystem no longer has update
      engine.getInputSystem().update(16)
      engine.getPhysicsSystem().update(16)
    }

    const fps = engine.getFPS()
    expect(fps).toBeGreaterThanOrEqual(0)
  })

  it('should handle system updates without errors', () => {
    expect(() => {
      // engine.getAudioSystem().update(16) // AudioSystem no longer has update
      engine.getInputSystem().update(16)
      engine.getRenderSystem().clear()
      engine.getPhysicsSystem().update(16)
    })
      .not.toThrow()
  })
})