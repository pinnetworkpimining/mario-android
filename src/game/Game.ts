import { Player } from './Player';
import { Level } from './Level';
import { InputManager } from './InputManager';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private level: Level;
  private inputManager: InputManager;
  private lastTime: number = 0;
  private score: number = 0;
  private lives: number = 3;
  private gameRunning: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.inputManager = new InputManager();
    this.player = new Player(100, 400);
    this.level = new Level();
    
    this.setupEventListeners();
    this.inputManager.initializeTouchControls();
  }

  private setupEventListeners(): void {
    // Touch controls for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      
      // Simple touch controls - left half for left, right half for right
      if (x < this.canvas.width / 2) {
        this.inputManager.setKeyState('ArrowLeft', true);
      } else {
        this.inputManager.setKeyState('ArrowRight', true);
      }
    });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.inputManager.setKeyState('ArrowLeft', false);
      this.inputManager.setKeyState('ArrowRight', false);
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      this.inputManager.setKeyState(e.code, true);
    });

    document.addEventListener('keyup', (e) => {
      this.inputManager.setKeyState(e.code, false);
    });
  }

  public start(): void {
    this.gameRunning = true;
    this.gameLoop(0);
  }

  private gameLoop(currentTime: number): void {
    if (!this.gameRunning) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number): void {
    // Update player
    this.player.update(deltaTime, this.inputManager);
    
    // Check collisions
    this.checkCollisions();
    
    // Update UI
    this.updateUI();
  }

  private checkCollisions(): void {
    // Check if player fell off the level
    if (this.player.y > this.canvas.height) {
      this.playerDie();
    }

    // Check collisions with platforms
    this.level.checkCollisions(this.player);
  }

  private playerDie(): void {
    this.lives--;
    if (this.lives <= 0) {
      this.gameOver();
    } else {
      this.player.reset(100, 400);
    }
  }

  private gameOver(): void {
    this.gameRunning = false;
    alert('Game Over! Final Score: ' + this.score);
    // Reset game
    this.score = 0;
    this.lives = 3;
    this.player.reset(100, 400);
    this.start();
  }

  private updateUI(): void {
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    
    if (scoreElement) scoreElement.textContent = this.score.toString();
    if (livesElement) livesElement.textContent = this.lives.toString();
  }

  private render(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw level
    this.level.render(this.ctx);
    
    // Draw player
    this.player.render(this.ctx);
  }
}
