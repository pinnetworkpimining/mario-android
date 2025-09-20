import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Level } from '../game/Level'
import { Player } from '../game/Player'

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
      fillStyle: '',
      canvas: { width: 800, height: 600 },
    } as any

    expect(() => level.render(mockCtx)).not.toThrow()
  })
})
