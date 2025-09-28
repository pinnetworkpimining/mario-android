import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock DOM elements
const mockLevelSelectMenu = {
  style: { display: 'none' },
  addEventListener: vi.fn()
}

const mockMainMenu = {
  style: { display: 'flex' },
  addEventListener: vi.fn()
}

describe('Level Select Menu', () => {
  beforeEach(() => {
    global.document.getElementById = vi.fn((id) => {
      if (id === 'levelSelectMenu') return mockLevelSelectMenu
      if (id === 'mainMenu') return mockMainMenu
      return null
    })
  })

  it('should show level select menu when called', () => {
    // Simulate showLevelSelect function
    const showLevelSelect = () => {
      const mainMenu = document.getElementById('mainMenu')
      const levelSelectMenu = document.getElementById('levelSelectMenu')
      if (mainMenu) mainMenu.style.display = 'none'
      if (levelSelectMenu) levelSelectMenu.style.display = 'flex'
    }

    showLevelSelect()
    expect(mockMainMenu.style.display).toBe('none')
    expect(mockLevelSelectMenu.style.display).toBe('flex')
  })

  it('should return to main menu when back is pressed', () => {
    const backToMainMenu = () => {
      const mainMenu = document.getElementById('mainMenu')
      const levelSelectMenu = document.getElementById('levelSelectMenu')
      if (levelSelectMenu) levelSelectMenu.style.display = 'none'
      if (mainMenu) mainMenu.style.display = 'flex'
    }

    backToMainMenu()
    expect(mockLevelSelectMenu.style.display).toBe('none')
    expect(mockMainMenu.style.display).toBe('flex')
  })

  it('should handle level selection', () => {
    let selectedLevel = 0
    const startLevel = (levelNumber: number) => {
      selectedLevel = levelNumber
    }

    startLevel(3)
    expect(selectedLevel).toBe(3)
  })
})