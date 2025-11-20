/**
 * Main Game Scene
 * Handles the core gameplay loop
 */

import { Scene } from '../engine/SceneManager';
import { RenderSystem } from '../engine/RenderSystem';
import { GameEngine } from '../engine/GameEngine';
import { Logger } from '../engine/Logger';
import { Player } from '../game/Player';
import { Level } from '../game/Level';

export class GameScene implements Scene {
  public name: string = 'Game';
  private logger: Logger;
  private engine: GameEngine;
  private player: Player | null = null;
  private currentLevel: any = null;
  private levelNumber: number = 1;
  private score: number = 0;
  private lives: number = 3;
  private gameState: 'playing' | 'paused' | 'gameOver' | 'levelComplete' = 'playing';
  private camera: { x: number; y: number } = { x: 0, y: 0 };
  private messageTimer: number = 0;
  private currentMessage: string = '';
  private keyDownHandler: Function;

  constructor() {
    this.logger = Logger.getInstance();
    this.engine = GameEngine.getInstance();
  }

  public async load(): Promise<void> {
    this.logger.info('Loading Game scene');

    // Initialize player
    const config = this.engine.getConfig();
    const startX = config.width * 0.1;
    const startY = config.height * 0.7;

    this.player = new Player(startX, startY);

    // Load first level
    await this.loadLevel(1);

    // Setup input handlers
    this.keyDownHandler = this.handleKeyDown.bind(this);
    this.engine.getInputSystem().on('keydown', this.keyDownHandler);

    // Clear any stuck keys from menu
    this.engine.getInputSystem().clearKeys();

    this.gameState = 'playing';
  }

  public async unload(): Promise<void> {
    this.logger.info('Unloading Game scene');
    this.engine.getInputSystem().off('keydown', this.keyDownHandler);
  }

  public update(deltaTime: number): void {
    if (this.gameState !== 'playing') return;

    // Update player
    if (this.player) {
      this.player.update(deltaTime, this.engine.getInputSystem());
    }

    // Update level
    if (this.currentLevel) {
      this.currentLevel.update(deltaTime);
    }

    // Update camera
    this.updateCamera();

    // Check collisions
    this.checkCollisions();

    // Update message timer
    if (this.messageTimer > 0) {
      this.messageTimer -= deltaTime;
      if (this.messageTimer <= 0) {
        this.currentMessage = '';
      }
    }
  }

  public render(renderSystem: RenderSystem): void {
    // Apply camera transform
    renderSystem.setCamera(this.camera.x, this.camera.y);
    renderSystem.applyCameraTransform();

    // Render level
    if (this.currentLevel) {
      this.currentLevel.render(renderSystem.getContext());
    }

    // Render player
    if (this.player) {
      this.player.render(renderSystem.getContext());
    }

    // Restore camera transform
    renderSystem.restoreCameraTransform();

    // Render UI
    this.renderUI(renderSystem);

    // Render touch controls
    this.engine.getInputSystem().renderTouchControls(renderSystem.getContext());

    // Render messages
    if (this.currentMessage) {
      this.renderMessage(renderSystem);
    }
  }

  private async loadLevel(levelNumber: number): Promise<void> {
    this.logger.info(`Loading level ${levelNumber}`);
    this.levelNumber = levelNumber;

    const config = this.engine.getConfig();
    const groundY = config.height * 0.85;
    const startX = config.width * 0.1;

    try {
      // Create level based on number
      switch (levelNumber) {
        case 1:
          this.currentLevel = new Level();
          break;
        case 2:
          const { Level2 } = await import('../game/Level2');
          this.currentLevel = new Level2();
          break;
        case 3:
          const { Level3 } = await import('../game/Level3');
          this.currentLevel = new Level3();
          break;
        case 4:
          const { Level4 } = await import('../game/Level4');
          this.currentLevel = new Level4();
          break;
        case 5:
          const { Level5 } = await import('../game/Level5');
          this.currentLevel = new Level5();
          break;
        case 6:
          const { Level6 } = await import('../game/Level6');
          this.currentLevel = new Level6();
          break;
        default:
          this.currentLevel = new Level();
      }

      // Set player reference for the level
      if (this.player && this.currentLevel) {
        this.currentLevel.setPlayer(this.player);
      }

      // Reset player position
      if (this.player) {
        this.player.reset(startX, groundY - 64);
      }

      // Reset camera
      this.camera.x = 0;
      this.camera.y = 0;
    } catch (error) {
      this.logger.error(`Error loading level ${levelNumber}: ${error}`);
      // Fallback to level 1
      this.currentLevel = new Level();
      if (this.player) {
        this.player.reset(startX, groundY - 64);
      }
      this.camera.x = 0;
      this.camera.y = 0;
    }
  }

  private updateCamera(): void {
    if (!this.player) return;

    const config = this.engine.getConfig();
    const targetX = this.player.x - config.width / 2;
    const targetY = this.player.y - config.height / 2;

    // Smooth camera movement
    this.camera.x += (targetX - this.camera.x) * 0.1;
    this.camera.y += (targetY - this.camera.y) * 0.1;

    // Clamp camera to level bounds
    if (this.currentLevel) {
      const levelWidth = this.currentLevel.getLevelWidth ? this.currentLevel.getLevelWidth() : config.width * 4;
      const levelHeight = this.currentLevel.getLevelHeight ? this.currentLevel.getLevelHeight() : config.height;

      this.camera.x = Math.max(0, Math.min(this.camera.x, levelWidth - config.width));
      this.camera.y = Math.max(0, Math.min(this.camera.y, levelHeight - config.height));
    }
  }

  private checkCollisions(): void {
    if (!this.player || !this.currentLevel) return;

    // Check level collisions
    this.currentLevel.checkCollisions(this.player);

    // Check if player fell off level
    if (this.player.y > this.engine.getConfig().height + 200) {
      this.playerDie();
    }

    // Check level completion
    if (this.currentLevel.isCompleted && this.currentLevel.isCompleted()) {
      this.completeLevel();
    }
  }

  private playerDie(): void {
    this.logger.info('Player died');
    this.lives--;
    this.engine.getAudioSystem().playSound('hurt');

    if (this.lives <= 0) {
      this.gameOver();
    } else {
      // Reset player position
      const config = this.engine.getConfig();
      const startX = config.width * 0.1;
      const startY = config.height * 0.7;
      if (this.player) {
        this.player.reset(startX, startY);
      }
      this.showMessage('Try again!', 2000);
    }
  }

  private completeLevel(): void {
    if (this.gameState === 'levelComplete') return;

    this.gameState = 'levelComplete';
    this.logger.info(`Level ${this.levelNumber} completed`);
    this.engine.getAudioSystem().playSound('levelcomplete');
    this.score += 1000;

    if (this.levelNumber < 6) {
      this.showMessage(`Level ${this.levelNumber} Complete!`, 3000);
      setTimeout(async () => {
        this.gameState = 'playing';
        await this.loadLevel(this.levelNumber + 1);
      }, 3000);
    } else {
      this.showMessage('ALL LEVELS COMPLETED', 5000);
      setTimeout(async () => {
        await this.engine.getSceneManager().loadScene('MainMenu');
      }, 5000);
    }
  }

  private gameOver(): void {
    this.logger.info('Game over');
    this.gameState = 'gameOver';
    this.engine.getAudioSystem().playSound('gameover');
    this.showMessage(`Game Over! Final Score: ${this.score}`, 5000);

    setTimeout(async () => {
      await this.engine.getSceneManager().loadScene('MainMenu');
    }, 5000);
  }

  private showMessage(message: string, duration: number): void {
    this.currentMessage = message;
    this.messageTimer = duration;
  }

  private renderUI(renderSystem: RenderSystem): void {
    const config = this.engine.getConfig();

    // UI background
    renderSystem.drawWithAlpha(() => {
      renderSystem.drawRect(10, 10, 300, 100, '#000000');
    }, 0.7);

    // UI border
    renderSystem.drawRectOutline(10, 10, 300, 100, '#00ffff', 2);

    // UI text
    renderSystem.drawText(`Score: ${this.score}`, 20, 35, '20px Arial', '#ffffff');
    renderSystem.drawText(`Lives: ${this.lives}`, 20, 60, '20px Arial', '#ffffff');
    renderSystem.drawText(`Health: ${this.player?.getHealth() || 0}`, 20, 85, '20px Arial', '#ffffff');
    renderSystem.drawText(`Level: ${this.levelNumber}`, 200, 35, '20px Arial', '#ffffff');

    // Pause button
    renderSystem.drawWithAlpha(() => {
      renderSystem.drawRect(config.width - 80, 10, 70, 40, '#000000');
    }, 0.7);
    renderSystem.drawRectOutline(config.width - 80, 10, 70, 40, '#00ffff', 2);
    renderSystem.drawText('⏸️', config.width - 45, 35, '20px Arial', '#ffffff', 'center');
  }

  private renderMessage(renderSystem: RenderSystem): void {
    const config = this.engine.getConfig();
    const messageWidth = 600;
    const messageHeight = 150;
    const x = (config.width - messageWidth) / 2;
    const y = (config.height - messageHeight) / 2;

    // Message background
    renderSystem.drawWithAlpha(() => {
      renderSystem.drawGradientRect(x, y, messageWidth, messageHeight, [
        { offset: 0, color: '#1a1a2e' },
        { offset: 1, color: '#16213e' }
      ]);
    }, 0.95);

    // Message border
    renderSystem.drawRectOutline(x, y, messageWidth, messageHeight, '#00ffff', 3);

    // Message text
    renderSystem.drawText(
      this.currentMessage,
      config.width / 2,
      config.height / 2,
      'bold 32px Arial',
      '#ffffff',
      'center'
    );
  }

  private handleKeyDown(key: string): void {
    if (key === 'Escape') {
      this.togglePause();
    }
  }

  private togglePause(): void {
    if (this.gameState === 'playing') {
      this.gameState = 'paused';
      this.showMessage('PAUSED - Press ESC to resume', 0);
    } else if (this.gameState === 'paused') {
      this.gameState = 'playing';
      this.currentMessage = '';
      this.messageTimer = 0;
    }
  }

  public addScore(points: number): void {
    this.score += points;
    this.engine.getAudioSystem().playSound('coin');
  }

  public levelCompleted(levelNumber: number): void {
    if (this.gameState === 'levelComplete') return;

    this.gameState = 'levelComplete';
    this.logger.info(`Level ${levelNumber} completed, loading next level`);
    this.engine.getAudioSystem().playSound('levelcomplete');
    this.score += 1000;

    if (levelNumber < 6) {
      this.showMessage(`Level ${levelNumber} Complete!`, 3000);
      setTimeout(async () => {
        this.gameState = 'playing';
        await this.loadLevel(levelNumber + 1);
      }, 3000);
    } else {
      this.showMessage('ALL LEVELS COMPLETED', 5000);
      setTimeout(async () => {
        await this.engine.getSceneManager().loadScene('MainMenu');
      }, 5000);
    }
  }
}