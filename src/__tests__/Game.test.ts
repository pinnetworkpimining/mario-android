import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Game } from '../game/Game'

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

describe('Game', () => {
  let game: Game

  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 600, writable: true })
    Object.defineProperty(window, 'devicePixelRatio', { value: 1, writable: true })
    
    // Mock document.getElementById
    global.document.getElementById = vi.fn((id) => {
      if (id === 'gameCanvas') return mockCanvas
      return { textContent: '' }
    })
    
    game = new Game(mockCanvas)
  })

  it('should initialize with correct default values', () => {
    expect(game).toBeDefined()
    const gameState = game.getGameState()
    expect(gameState.currentLevel).toBe(1)
    expect(gameState.score).toBe(0)
    expect(gameState.lives).toBe(3)
    expect(gameState.gameRunning).toBe(false)
    expect(gameState.paused).toBe(false)
  })

  it('should start the game correctly', () => {
    game.start()
    const gameState = game.getGameState()
    expect(gameState.gameRunning).toBe(true)
    expect(gameState.paused).toBe(false)
  })

  it('should pause and resume correctly', () => {
    game.start()
    game.pause()
    expect(game.getGameState().paused).toBe(true)
    
    game.resume()
    expect(game.getGameState().paused).toBe(false)
  })

  it('should load different levels', () => {
    // Wait for transition to complete
    setTimeout(() => {
      game.loadLevel(2)
      expect(game.getGameState().currentLevel).toBe(2)
    }, 100)
    
    setTimeout(() => {
      game.loadLevel(3)
      expect(game.getGameState().currentLevel).toBe(3)
    }, 200)
  })

  it('should add score correctly', () => {
    const initialScore = game.getGameState().score
    game.addScore(100)
    expect(game.getGameState().score).toBe(initialScore + 100)
  })

  it('should have audio manager', () => {
    const audioManager = game.getAudioManager()
    expect(audioManager).toBeDefined()
  })

  it('should track logs', () => {
    const logs = game.getLogs()
    expect(Array.isArray(logs)).toBe(true)
    expect(logs.length).toBeGreaterThan(0)
  })

  it('should stop the game correctly', () => {
    game.start()
    game.stop()
    expect(game.getGameState().gameRunning).toBe(false)
  })
})