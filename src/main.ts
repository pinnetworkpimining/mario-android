import { GameEngine, GameConfig } from './engine/GameEngine';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { Logger, LogLevel } from './engine/Logger';

let gameEngine: GameEngine | null = null;

document.addEventListener('DOMContentLoaded', async () => {
  const logger = Logger.getInstance();
  logger.setLogLevel(LogLevel.INFO);
  
  try {
    // Check for landscape orientation
    if (window.innerHeight > window.innerWidth) {
      showOrientationMessage();
      return;
    }
    
    await initializeGame();
  } catch (error) {
    logger.error('Failed to initialize game', error);
    showErrorMessage('Failed to initialize game. Please refresh the page.');
  }
});

async function initializeGame(): Promise<void> {
  const logger = Logger.getInstance();
  logger.info('Initializing Cyber Runner...');

  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Game canvas not found');
  }
  
  const config: GameConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    targetFPS: 60,
    debug: false,
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  };
  
  gameEngine = GameEngine.getInstance(canvas, config);
  
  // Register scenes
  const mainMenuScene = new MainMenuScene();
  const gameScene = new GameScene();
  const levelSelectScene = new LevelSelectScene();
  
  gameEngine.getSceneManager().registerScene(mainMenuScene);
  gameEngine.getSceneManager().registerScene(gameScene);
  gameEngine.getSceneManager().registerScene(levelSelectScene);
  
  // Load initial scene
  await gameEngine.getSceneManager().loadScene('MainMenu');
  
  // Start the game engine
  gameEngine.start();
  
  // Hide loading screen and show game
  hideLoadingScreen();
  
  logger.info('Game initialized successfully');
}

function showOrientationMessage(): void {
  const message = document.createElement('div');
  message.className = 'orientation-message';
  message.innerHTML = `
    <div class="orientation-icon">📱</div>
    <h2>Please Rotate Your Device</h2>
    <p>This game is designed for landscape mode</p>
  `;
  document.body.appendChild(message);
  
  // Listen for orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      if (window.innerWidth > window.innerHeight) {
        document.body.removeChild(message);
        initializeGame();
      }
    }, 500);
  });
}

function showErrorMessage(message: string): void {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <h2>⚠️ Error</h2>
    <p>${message}</p>
    <button onclick="location.reload()">Retry</button>
  `;
  document.body.appendChild(errorDiv);
}

function hideLoadingScreen(): void {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }
  
  const gameCanvas = document.getElementById('gameCanvas');
  if (gameCanvas) {
    gameCanvas.style.display = 'block';
  }
}

// Handle window resize
window.addEventListener('resize', () => {
  if (gameEngine) {
    const config = gameEngine.getConfig();
    config.width = window.innerWidth;
    config.height = window.innerHeight;
    
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = config.width * dpr;
      canvas.height = config.height * dpr;
      canvas.style.width = config.width + 'px';
      canvas.style.height = config.height + 'px';
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }
  }
});

// Export for global access (needed for HTML buttons)
(window as any).gameEngine = gameEngine;