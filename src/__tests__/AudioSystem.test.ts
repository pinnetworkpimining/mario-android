import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AudioSystem } from '../engine/AudioSystem'

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
;(global as any).webkitAudioContext = vi.fn(() => mockAudioContext) as any

describe('AudioSystem', () => {
  let audioSystem: AudioSystem

  beforeEach(() => {
    audioSystem = new AudioSystem()
  })

  it('should initialize without errors', () => {
    expect(audioSystem).toBeDefined()
  })

  it('should play sounds without errors', () => {
    expect(() => audioSystem.playSound('jump')).not.toThrow()
    expect(() => audioSystem.playSound('defeat')).not.toThrow()
    expect(() => audioSystem.playSound('powerup')).not.toThrow()
  })

  it('should handle background music', () => {
    expect(() => audioSystem.playMusic()).not.toThrow()
    expect(() => audioSystem.stopMusic()).not.toThrow()
  })

  it('should set volumes correctly', () => {
    expect(() => audioSystem.setMasterVolume(0.5)).not.toThrow()
    expect(() => audioSystem.setMusicVolume(0.3)).not.toThrow()
    expect(() => audioSystem.setSfxVolume(0.8)).not.toThrow()
  })

  it('should enable/disable audio', () => {
    expect(() => audioSystem.setEnabled(false)).not.toThrow()
    expect(() => audioSystem.setEnabled(true)).not.toThrow()
  })

  it('should resume context', async () => {
    await expect(audioSystem.resumeContext()).resolves.not.toThrow()
  })

  it('should update without errors', () => {
    expect(() => audioSystem.update(16)).not.toThrow()
  })

  it('should return config', () => {
    const config = audioSystem.getConfig()
    expect(config).toBeDefined()
    expect(typeof config.masterVolume).toBe('number')
    expect(typeof config.enabled).toBe('boolean')
  })
})