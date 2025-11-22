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
    gain: {
      value: 1,
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn()
    }
  })),
  createOscillator: vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn()
    },
    type: 'sine'
  })),
  destination: {},
  sampleRate: 44100,
  state: 'running',
  resume: vi.fn(() => Promise.resolve()),
  decodeAudioData: vi.fn(() => Promise.resolve({}))
}

global.AudioContext = vi.fn(() => mockAudioContext) as any
  ; (global as any).webkitAudioContext = vi.fn(() => mockAudioContext) as any

// Mock fetch for loading sounds
global.fetch = vi.fn(() => Promise.resolve({
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  json: () => Promise.resolve({}),
  text: () => Promise.resolve('')
})) as any;

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
    expect(() => audioSystem.playMusic('bgmusic')).not.toThrow()
    expect(() => audioSystem.stopMusic()).not.toThrow()
  })

  it('should load external sounds', async () => {
    await expect(audioSystem.loadSound('test', 'test.mp3')).resolves.not.toThrow()
  })

  it('should play loaded sounds', () => {
    expect(() => audioSystem.playLoadedSound('test')).not.toThrow()
  })
})