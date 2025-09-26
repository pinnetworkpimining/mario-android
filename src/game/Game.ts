import { Player } from './Player';
import { Level } from './Level';
import { Level2 } from './Level2';
import { Level3 } from './Level3';
import { Level4 } from './Level4';
import { Level5 } from './Level5';
import { InputManager } from './InputManager';
import { TouchController } from './TouchController';
import { Camera } from './Camera';
import { AudioManager } from './AudioManager';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private level: any;
  private inputManager: InputManager;
  private touchController: TouchController;
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

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    
    // Set game dimensions for mobile landscape
    this.gameWidth = window.innerWidth;
    this.gameHeight = window.innerHeight;
    
    this.inputManager = new InputManager();
    this.camera = new Camera(canvas);
    this.audioManager = new AudioManager();
    
    // Initialize touch controller for mobile
    this.touchController = new TouchController(
      this.canvas,
      (key: string, pressed: boolean) => this.inputManager.setKeyState(key, pressed)
    );
    
    this.loadLevel(1);
    this.setupEventListeners();
  }

  private loadLevel(levelNumber: number): void {
    this.currentLevel = levelNumber;
    
    // Calculate ground position for mobile landscape
    const groundY = this.gameHeight * 0.85; // 85% down from top
    const startX = this.gameWidth * 0.1; // 10% from left edge
    
    switch (levelNumber) {
      case 1:
        this.level = new Level();
        break;
      case 2:
        this.level = new Level2();
        break;
      case 3:
        this.level = new Level3();
        break;
      case 4:
        this.level = new Level4();
        break;
      case 5:
        this.level = new Level5();
        break;
      default:
        this.level = new Level();
    }
    
    // Place player at start position
    this.player = new Player(startX, groundY - 64); // 64 = player height
    
    // Set camera bounds
    this.camera.setLevelBounds(this.level.getLevelWidth(), this.level.getLevelHeight());
    
    // Update UI
    this.updateUI();
  }

  private setupEventListeners(): void {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        this.togglePause();
        return;
      }
      this.inputManager.setKeyState(e.code, true);
    });

    document.addEventListener('keyup', (e) => {
      this.inputManager.setKeyState(e.code, false);
    });

    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleResize();
      }, 100);
    });

    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  private handleResize(): void {
    this.gameWidth = window.innerWidth;
    this.gameHeight = window.innerHeight;
    
    this.canvas.width = this.gameWidth * window.devicePixelRatio;
    this.canvas.height = this.gameHeight * window.devicePixelRatio;
    this.canvas.style.width = this.gameWidth + 'px';
    this.canvas.style.height = this.gameHeight + 'px';
    
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Recreate touch controller with new dimensions
    this.touchController = new TouchController(
      this.canvas,
      (key: string, pressed: boolean) => this.inputManager.setKeyState(key, pressed)
    );
  }

  public start(): void {
    this.gameRunning = true;
    this.paused = false;
    this.audioManager.playBackgroundMusic();
    this.gameLoop(0);
  }

  public pause(): void {
    this.paused = true;
  }

  public resume(): void {
    this.paused = false;
  }

  public stop(): void {
    this.gameRunning = false;
    this.audioManager.stopBackgroundMusic();
  }

  public restart(): void {
    this.loadLevel(this.currentLevel);
    this.start();
  }

  private togglePause(): void {
    this.paused = !this.paused;
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
    this.player.update(deltaTime, this.inputManager);
    
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
      this.playerDie();
    }

    // Check collisions with level
    this.level.checkCollisions(this.player);
    
    // Check level completion
    if (this.level.isCompleted && this.level.isCompleted()) {
      this.completeLevel();
    }
  }

  private playerDie(): void {
    this.lives--;
    this.audioManager.playSound('hurt');
    
    if (this.lives <= 0) {
      this.gameOver();
    } else {
      // Reset player position
      const groundY = this.gameHeight * 0.85;
      const startX = this.gameWidth * 0.1;
      this.player.reset(startX, groundY - 64);
    }
  }

  private completeLevel(): void {
    this.audioManager.playSound('levelcomplete');
    this.score += 1000;
    
    if (this.currentLevel < 5) {
      this.showMessage(`Level ${this.currentLevel} Complete!`, () => {
        this.loadLevel(this.currentLevel + 1);
      });
    } else {
      this.showMessage('🎉 GAME COMPLETED! 🎉', () => {
        this.goToMenu();
      });
    }
  }

  private gameOver(): void {
    this.audioManager.playSound('gameover');
    this.audioManager.stopBackgroundMusic();
    
    this.showMessage(`Game Over! Final Score: ${this.score}`, () => {
      this.goToMenu();
    });
  }

  private showMessage(text: string, callback?: () => void): void {
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
    this.touchController.render(this.ctx);
    
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
    this.score += points;
    this.audioManager.playSound('coin');
  }

  public getAudioManager(): AudioManager {
    return this.audioManager;
  }
}