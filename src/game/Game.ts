import { Player } from './Player';
import { Level } from './Level';

import { InputSystem } from '../engine/InputSystem';
import { Camera } from './Camera';
import { AudioManager } from './AudioManager';

// Game state logging utility
class GameLogger {
  private static instance: GameLogger;
  private logs: string[] = [];

  static getInstance(): GameLogger {
    if (!GameLogger.instance) {
      GameLogger.instance = new GameLogger();
    }
    return GameLogger.instance;
  }

  log(message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO'): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level}: ${message}`;
    this.logs.push(logMessage);
    console.log(logMessage);
    
    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player = new Player(100, 100);
  private level: any;
  private inputSystem: InputSystem;
  private camera: Camera;
  private audioManager: AudioManager;
  private lastTime: number = 0;
  private score: number = 0;
  private lives: number = 3;
  private currentLevel: number = 1;
  private gameRunning: boolean = false;
  private paused: boolean = false;
  private gameWidth: number;
  private gameHeight: number;
  private logger: GameLogger;
  private gameOverShown: boolean = false;
  private levelCompleteShown: boolean = false;
  private isTransitioning: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.logger = GameLogger.getInstance();
    this.logger.log('Game constructor called');
    
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    
    // Set game dimensions for mobile landscape
    this.gameWidth = window.innerWidth;
    this.gameHeight = window.innerHeight;
    
    this.logger.log(`Game dimensions: ${this.gameWidth}x${this.gameHeight}`);
    
    this.inputSystem = new InputSystem(canvas);
    this.camera = new Camera(canvas);
    this.audioManager = new AudioManager();

    this.loadLevel(1);
    
    this.logger.log('Game initialization complete');
  }

  public async loadLevel(levelNumber: number): Promise<void> {
    this.logger.log(`Loading level ${levelNumber}`);

    // Prevent multiple level loads
    if (this.isTransitioning) {
      this.logger.log('Level transition already in progress, ignoring request');
      return;
    }

    // Reset game state flags
    this.gameOverShown = false;
    this.levelCompleteShown = false;
    this.isTransitioning = true;

    this.currentLevel = levelNumber;

    // Calculate ground position for mobile landscape
    const groundY = this.gameHeight * 0.85; // 85% down from top
    const startX = this.gameWidth * 0.1; // 10% from left edge

    try {
      switch (levelNumber) {
        case 1:
          this.level = new Level();
          this.logger.log('Level 1 loaded');
          break;
        case 2:
          const { Level2 } = await import('./Level2');
          this.level = new Level2();
          this.logger.log('Level 2 loaded');
          break;
        case 3:
          const { Level3 } = await import('./Level3');
          this.level = new Level3();
          this.logger.log('Level 3 loaded');
          break;
        case 4:
          const { Level4 } = await import('./Level4');
          this.level = new Level4();
          this.logger.log('Level 4 loaded');
          break;
        case 5:
          const { Level5 } = await import('./Level5');
          this.level = new Level5();
          this.logger.log('Level 5 loaded');
          break;
        case 6:
          const { Level6 } = await import('./Level6');
          this.level = new Level6();
          this.logger.log('Level 6 (Interactive Enemies) loaded');
          break;
        default:
          this.level = new Level();
          this.logger.log('Default level loaded');
      }

      // Place player at start position
      this.player = new Player(startX, groundY - 64); // 64 = player height

      // Set camera bounds
      this.camera.setLevelBounds(this.level.getLevelWidth(), this.level.getLevelHeight());

      // Update UI
      this.updateUI();

      this.isTransitioning = false;
      this.logger.log(`Level ${levelNumber} setup complete`);
    } catch (error) {
      this.logger.log(`Error loading level ${levelNumber}: ${error}`, 'ERROR');
      // Fallback to level 1
      this.level = new Level();
      this.player = new Player(startX, groundY - 64);
      this.camera.setLevelBounds(this.level.getLevelWidth(), this.level.getLevelHeight());
      this.updateUI();
      this.isTransitioning = false;
    }
  }


  private handleResize(): void {
    this.logger.log('Handling resize event');

    this.gameWidth = window.innerWidth;
    this.gameHeight = window.innerHeight;

    this.canvas.width = this.gameWidth * window.devicePixelRatio;
    this.canvas.height = this.gameHeight * window.devicePixelRatio;
    this.canvas.style.width = this.gameWidth + 'px';
    this.canvas.style.height = this.gameHeight + 'px';

    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  public start(): void {
    this.logger.log('Starting game');
    this.gameRunning = true;
    this.paused = false;
    this.audioManager.playBackgroundMusic();
    this.gameLoop(0);
  }

  public pause(): void {
    this.logger.log('Game paused');
    this.paused = true;
  }

  public resume(): void {
    this.logger.log('Game resumed');
    this.paused = false;
  }

  public stop(): void {
    this.logger.log('Game stopped');
    this.gameRunning = false;
    this.audioManager.stopBackgroundMusic();
  }

  public restart(): void {
    this.logger.log('Restarting game');
    this.loadLevel(this.currentLevel);
    this.start();
  }

  private togglePause(): void {
    this.paused = !this.paused;
    this.logger.log(`Game ${this.paused ? 'paused' : 'unpaused'}`);
  }

  private gameLoop(currentTime: number): void {
    if (!this.gameRunning) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    if (!this.paused) {
      this.update(deltaTime);
    }
    
    this.render();

    requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number): void {
    // Update player
    this.player.update(deltaTime, this.inputSystem);
    
    // Update level
    this.level.update(deltaTime);
    
    // Update camera to follow player
    this.camera.followPlayer(this.player.x, this.player.y);
    
    // Check collisions
    this.checkCollisions();
    
    // Update UI
    this.updateUI();
    
    // Play ambient sounds occasionally
    if (Math.random() < 0.001) { // 0.1% chance per frame
      this.audioManager.playSound('bird');
    }
  }

  private checkCollisions(): void {
    // Check if player fell off the level
    if (this.player.y > this.level.getLevelHeight()) {
      this.logger.log('Player fell off level');
      this.playerDie();
    }

    // Check collisions with level
    this.level.checkCollisions(this.player);
    
    // Check level completion
    if (this.level.isCompleted && this.level.isCompleted() && !this.levelCompleteShown) {
      this.logger.log(`Level ${this.currentLevel} completed`);
      this.completeLevel();
    }
  }

  private playerDie(): void {
    if (this.gameOverShown) return; // Prevent multiple calls
    
    this.logger.log('Player died');
    this.lives--;
    this.audioManager.playSound('hurt');
    
    if (this.lives <= 0) {
      this.gameOver();
    } else {
      // Reset player position
      const groundY = this.gameHeight * 0.85;
      const startX = this.gameWidth * 0.1;
      this.player.reset(startX, groundY - 64);
      this.logger.log('Player respawned');
    }
  }

  private completeLevel(): void {
    if (this.levelCompleteShown) return; // Prevent multiple calls
    this.levelCompleteShown = true;
    
    this.logger.log(`Level ${this.currentLevel} complete`);
    this.audioManager.playSound('levelcomplete');
    this.score += 1000;
    
    if (this.currentLevel < 6) {
      this.showMessage(`Level ${this.currentLevel} Complete!`, () => {
        this.logger.log(`Transitioning to level ${this.currentLevel + 1}`);
        setTimeout(() => {
          this.loadLevel(this.currentLevel + 1);
          this.start(); // Ensure game starts after level load
        }, 500);
      });
    } else {
      this.logger.log('All levels completed - Game won!');
      this.showMessage('🎉 GAME COMPLETED! 🎉', () => {
        this.goToMenu();
      });
    }
  }

  private gameOver(): void {
    if (this.gameOverShown) return; // Prevent multiple calls
    this.gameOverShown = true;
    
    this.logger.log('Game over');
    this.audioManager.playSound('gameover');
    this.audioManager.stopBackgroundMusic();
    
    this.showMessage(`Game Over! Final Score: ${this.score}`, () => {
      this.goToMenu();
    });
  }

  private showMessage(text: string, callback?: () => void): void {
    this.logger.log(`Showing message: ${text}`);
    
    const message = document.createElement('div');
    message.className = 'game-message';
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
      if (callback) callback();
    }, 3000);
  }

  private goToMenu(): void {
    this.logger.log('Returning to main menu');
    this.stop();
    (window as any).goToMenu();
  }

  private updateUI(): void {
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const healthElement = document.getElementById('health');
    const levelElement = document.getElementById('level');

    if (scoreElement) scoreElement.textContent = this.score.toString();
    if (livesElement) livesElement.textContent = this.lives.toString();
    if (healthElement) healthElement.textContent = this.player.getHealth().toString();
    if (levelElement) levelElement.textContent = this.currentLevel.toString();
  }

  private render(): void {
    // Clear canvas with mobile-optimized background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.gameHeight);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    
    // Apply camera transformation
    this.camera.apply(this.ctx);
    
    // Draw level
    this.level.render(this.ctx);
    
    // Draw player
    this.player.render(this.ctx);
    
    // Restore camera transformation
    this.camera.restore(this.ctx);

    // Draw touch controls
    this.inputSystem.renderTouchControls(this.ctx);

    // Draw pause overlay if paused
    if (this.paused) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      
      this.ctx.fillStyle = 'white';
      this.ctx.font = `${this.gameHeight * 0.08}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PAUSED', this.gameWidth / 2, this.gameHeight / 2);
    }
  }

  public addScore(points: number): void {
    this.logger.log(`Score added: ${points}`);
    this.score += points;
    this.audioManager.playSound('coin');
  }

  public getAudioManager(): AudioManager {
    return this.audioManager;
  }

  // Debug methods for developers
  public getGameState(): any {
    return {
      currentLevel: this.currentLevel,
      score: this.score,
      lives: this.lives,
      gameRunning: this.gameRunning,
      paused: this.paused,
      playerPosition: { x: this.player.x, y: this.player.y },
      playerHealth: this.player.getHealth()
    };
  }

  public getLogs(): string[] {
    return this.logger.getLogs();
  }
}