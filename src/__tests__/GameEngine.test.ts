import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GameEngine, GameConfig } from '../engine/GameEngine'

// Mock canvas and context
const mockCanvas = {
  getContext: vi.fn(() => ({
    scale: vi.fn(),
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
    strokeText: vi.fn(),
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
  let config: GameConfig

  beforeEach(() => {
    // Reset singleton
    (GameEngine as any).instance = null
    
    config = {
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