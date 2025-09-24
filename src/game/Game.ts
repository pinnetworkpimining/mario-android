import { Player } from './Player';
import { Level } from './Level';
import { InputManager } from './InputManager';
import { TouchController } from './TouchController';
import { MobileUtils } from '../utils/MobileUtils';
import { Camera } from './Camera';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private level: Level;
  private inputManager: InputManager;
  private touchController: TouchController | null = null;
  private camera: Camera;
  private lastTime: number = 0;
  private score: number = 0;
  private lives: number = 3;
  private gameRunning: boolean = false;
  private isMobile: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.inputManager = new InputManager();
    this.level = new Level();
    this.camera = new Camera(canvas);
    this.isMobile = MobileUtils.isMobile();
    
    // Setup mobile optimizations
    if (this.isMobile) {
      MobileUtils.setupViewport();
      MobileUtils.preventZoom();
      this.setupMobileCanvas();
      this.touchController = new TouchController(
        this.canvas,
        (key: string, pressed: boolean) => this.inputManager.setKeyState(key, pressed)
      );
    }
    
    // Place Mario on the ground, centered horizontally
    const groundY = this.canvas.height - Math.round(this.canvas.height * 0.10);
    this.player = new Player(this.canvas.width * 0.08, groundY - 32); // 32 = Mario's height
    
    // Set camera level bounds
    this.camera.setLevelBounds(this.level.getLevelWidth(), this.level.getLevelHeight());
    
    this.setupEventListeners();
    
    if (!this.isMobile) {
      this.inputManager.initializeTouchControls();
    }
  }

  private setupMobileCanvas(): void {
    const { width, height, devicePixelRatio } = MobileUtils.getScreenDimensions();
    
    // Set canvas size to match screen
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    
    // Set actual canvas resolution for crisp rendering
    this.canvas.width = width * devicePixelRatio;
    this.canvas.height = height * devicePixelRatio;
    
    // Scale context to match device pixel ratio
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
    
    // Update canvas style for full screen
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '1';
  }

  private setupEventListeners(): void {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      this.inputManager.setKeyState(e.code, true);
    });

    document.addEventListener('keyup', (e) => {
      this.inputManager.setKeyState(e.code, false);
    });

    // Handle orientation changes on mobile
    if (this.isMobile) {
      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          this.setupMobileCanvas();
          this.camera.setLevelBounds(this.level.getLevelWidth(), this.level.getLevelHeight());
          if (this.touchController) {
            // Recreate touch controller with new dimensions
            this.touchController = new TouchController(
              this.canvas,
              (key: string, pressed: boolean) => this.inputManager.setKeyState(key, pressed)
            );
          }
        }, 100);
      });
    }
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
    
    // Update level (including enemies)
    this.level.update(deltaTime);
    
    // Update camera to follow player
    this.camera.followPlayer(this.player.x, this.player.y);
    
    // Check collisions
    this.checkCollisions();
    
    // Update UI
    this.updateUI();
  }

  private checkCollisions(): void {
    // Check if player fell off the level
    if (this.player.y > this.level.getLevelHeight()) {
      this.playerDie();
      if (this.isMobile) {
        MobileUtils.vibrate(200); // Vibrate on death
      }
    }

    // Check collisions with platforms
    this.level.checkCollisions(this.player);
  }

  private playerDie(): void {
    this.lives--;
    if (this.isMobile) {
      MobileUtils.vibrate([100, 50, 100]); // Pattern vibration
    }
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
    const healthElement = document.getElementById('health');
    const dateElement = document.getElementById('game-date');

    if (scoreElement) scoreElement.textContent = this.score.toString();
    if (livesElement) livesElement.textContent = this.lives.toString();
    if (healthElement) healthElement.textContent = this.player.getHealth().toString();
    if (dateElement) {
      const now = new Date();
      // Format: YYYY-MM-DD
      const formatted = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
      dateElement.textContent = formatted;
    }
  }

  private render(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Apply camera transformation
    this.camera.apply(this.ctx);
    
    // Draw level
    this.level.render(this.ctx);
    
    // Draw player
    this.player.render(this.ctx);
    
    // Restore camera transformation
    this.camera.restore(this.ctx);
    
    // Draw touch controls on mobile
    if (this.isMobile && this.touchController) {
      this.touchController.render(this.ctx);
    }
  }

  public loadLevel2(): void {
    // Dynamically import Level2 to avoid circular dependency
    import('./Level2').then(({ Level2 }) => {
      this.level = new Level2();
      this.camera.setLevelBounds(this.level.getLevelWidth(), this.level.getLevelHeight());
      this.player.reset(100, 400);
      this.start();
    });
  }

  public loadLevel3(): void {
    // Dynamically import Level3 to avoid circular dependency
    import('./Level3').then(({ Level3 }) => {
      this.level = new Level3();
      this.camera.setLevelBounds(this.level.getLevelWidth(), this.level.getLevelHeight());
      this.player.reset(100, 400);
      this.start();
    });
  }
}
