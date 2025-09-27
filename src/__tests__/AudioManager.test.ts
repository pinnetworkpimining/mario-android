import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AudioManager } from '../game/AudioManager'

// Mock Web Audio API
const mockAudioContext = {
  createBuffer: vi.fn(() => ({
    getChannelData: vi.fn(() => new Float32Array(1000))
  })),
  createBufferSource: vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    loop: false
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: { value: 1 }
  })),
  destination: {},
  sampleRate: 44100,
  state: 'running',
  resume: vi.fn(() => Promise.resolve())
}

global.AudioContext = vi.fn(() => mockAudioContext) as any
(global as any).webkitAudioContext = vi.fn(() => mockAudioContext) as any

describe('AudioManager', () => {
  let audioManager: AudioManager

  beforeEach(() => {
    audioManager = new AudioManager()
  })

  it('should initialize without errors', () => {
    expect(audioManager).toBeDefined()
  })

  it('should play sounds without errors', () => {
    expect(() => audioManager.playSound('jump')).not.toThrow()
    expect(() => audioManager.playSound('defeat')).not.toThrow()
    expect(() => audioManager.playSound('powerup')).not.toThrow()
  })

  it('should handle background music', () => {
    expect(() => audioManager.playBackgroundMusic()).not.toThrow()
    expect(() => audioManager.stopBackgroundMusic()).not.toThrow()
  })

  it('should set volume correctly', () => {
    expect(() => audioManager.setVolume(0.5)).not.toThrow()
    expect(() => audioManager.setVolume(0)).not.toThrow()
    expect(() => audioManager.setVolume(1)).not.toThrow()
  })

  it('should enable/disable audio', () => {
    expect(() => audioManager.setEnabled(false)).not.toThrow()
    expect(() => audioManager.setEnabled(true)).not.toThrow()
  })

  it('should resume context', async () => {
    await expect(audioManager.resumeContext()).resolves.not.toThrow()
  })
})