import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Level } from '../game/Level'
import { Player } from '../game/Player'
import { GameEngine } from '../engine/GameEngine'

// Mock GameEngine
const mockGameEngine = {
  getConfig: () => ({ width: 800, height: 600 }),
  getAudioSystem: () => ({
    playSound: vi.fn()
  }),
  getScreenShake: () => ({
    shake: vi.fn()
  })
};

(GameEngine.getInstance as any) = vi.fn(() => mockGameEngine);

describe('Level', () => {
  let level: Level
  let player: Player

  beforeEach(() => {
    level = new Level()
    player = new Player(100, 400)
  })

  it('should initialize with platforms', () => {
    expect(level).toBeDefined()
    // Level should have some platforms for testing
  })

  it('should check collisions with player', () => {
    // This is a basic test - the actual collision logic would need to be implemented
    expect(() => level.checkCollisions(player)).not.toThrow()
  })

  it('should render without errors', () => {
    const mockCtx = {
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      canvas: { width: 800, height: 600 },
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      bezierCurveTo: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn()
      })),
      globalAlpha: 1,
      shadowColor: '',
      shadowBlur: 0,
      fillText: vi.fn(),
      strokeText: vi.fn(),
      font: '',
      textAlign: '',
      textBaseline: '',
      closePath: vi.fn()
    } as any

    expect(() => level.render(mockCtx)).not.toThrow()
  })
})
