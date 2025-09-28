import { Game } from './game/Game';

let gameInstance: Game | null = null;

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Game will be initialized when start button is clicked
});

// Export function to initialize game from HTML
export function initGame() {

  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  if (canvas) {
    // Set canvas to exact screen dimensions for mobile
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    // Scale context for high DPI displays
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    gameInstance = new Game(canvas);
    // Don't auto-start, let the caller decide
    return gameInstance;
  }
  return null;
};