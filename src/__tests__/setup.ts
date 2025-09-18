import { vi } from 'vitest'

// Mock HTMLCanvasElement and CanvasRenderingContext2D
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    rect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
  })),
})

Object.defineProperty(HTMLCanvasElement.prototype, 'getBoundingClientRect', {
  value: vi.fn(() => ({
    left: 0,
    top: 0,
    width: 800,
    height: 600,
  })),
})

// Mock requestAnimationFrame
Object.defineProperty(window, 'requestAnimationFrame', {
  value: vi.fn((cb) => setTimeout(cb, 16)),
})

// Mock alert
Object.defineProperty(window, 'alert', {
  value: vi.fn(),
})

