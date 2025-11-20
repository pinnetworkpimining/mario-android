/**
 * Professional Game Engine Core
 * Handles game loop, state management, and system coordination
 */

import { Logger } from './Logger';
import { AudioSystem } from './AudioSystem';
import { InputSystem } from './InputSystem';
import { RenderSystem } from './RenderSystem';
import { PhysicsSystem } from './PhysicsSystem';
import { SceneManager } from './SceneManager';
import { AssetManager } from './AssetManager';
import { ConfigManager } from './ConfigManager';

export interface GameConfig {
  width: number;
  height: number;
  targetFPS: number;
  debug: boolean;
  mobile: boolean;
}

export class GameEngine {
  private static instance: GameEngine;
  private logger: Logger;
  private config: GameConfig;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Core Systems
  private audioSystem: AudioSystem;
  private inputSystem: InputSystem;
  private renderSystem: RenderSystem;
  private physicsSystem: PhysicsSystem;
  private sceneManager: SceneManager;
  private assetManager: AssetManager;

  // Game Loop
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private deltaTime: number = 0;
  private frameCount: number = 0;
  private fps: number = 0;
  private fpsTimer: number = 0;

  private constructor(canvas: HTMLCanvasElement, config: GameConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.config = config;
    this.logger = Logger.getInstance();

    this.initializeSystems();
    this.setupCanvas();

    this.logger.info('GameEngine initialized', { config });
  }

  public static getInstance(canvas?: HTMLCanvasElement, config?: GameConfig): GameEngine {
    if (!GameEngine.instance && canvas && config) {
      GameEngine.instance = new GameEngine(canvas, config);
    }
    return GameEngine.instance;
  }

  private initializeSystems(): void {
    this.logger.info('Initializing game systems...');

    try {
      this.assetManager = new AssetManager();
      this.audioSystem = new AudioSystem();
      this.inputSystem = new InputSystem(this.canvas);
      this.renderSystem = new RenderSystem(this.ctx, this.config);
      this.physicsSystem = new PhysicsSystem();
      this.sceneManager = new SceneManager(this);

      this.logger.info('All systems initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize systems', error);
      throw error;
    }
  }

  private setupCanvas(): void {
    const { width, height } = this.config;
    const dpr = window.devicePixelRatio || 1;

    // Set actual canvas size
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;

    // Set display size
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    // Scale context for high DPI
    this.ctx.scale(dpr, dpr);

    this.logger.info('Canvas setup complete', { width, height, dpr });
  }

  public start(): void {
    if (this.isRunning) {
      this.logger.warn('Game engine already running');
      return;
    }

    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);

    this.logger.info('Game engine started');
  }

  public stop(): void {
    this.isRunning = false;
    this.logger.info('Game engine stopped');
  }

  private gameLoop(currentTime: number): void {
    if (!this.isRunning) return;

    // Calculate delta time
    this.deltaTime = Math.min((currentTime - this.lastTime) / 1000, 1 / 30); // Cap at 30fps minimum
    this.lastTime = currentTime;

    // Update FPS counter
    this.updateFPS();

    try {
      // Update all systems
      this.update(this.deltaTime);

      // Render frame
      this.render();

    } catch (error) {
      this.logger.error('Error in game loop', error);
    }

    // Continue loop
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number): void {
    // Update systems in order
    this.inputSystem.update(deltaTime);
    this.physicsSystem.update(deltaTime);
    this.sceneManager.update(deltaTime);
    // this.audioSystem.update(deltaTime); // AudioSystem no longer needs update
  }

  private render(): void {
    // Clear canvas
    this.renderSystem.clear();

    // Render current scene
    this.sceneManager.render(this.renderSystem);

    // Render debug info if enabled
    if (this.config.debug) {
      this.renderDebugInfo();
    }
  }

  private updateFPS(): void {
    this.frameCount++;
    this.fpsTimer += this.deltaTime;

    if (this.fpsTimer >= 1.0) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsTimer = 0;
    }
  }

  private renderDebugInfo(): void {
    this.renderSystem.drawText(`FPS: ${this.fps}`, 10, 30, '16px Arial', '#00ff00');
    this.renderSystem.drawText(`Delta: ${(this.deltaTime * 1000).toFixed(2)}ms`, 10, 50, '16px Arial', '#00ff00');
  }

  // Public API for systems
  public getAudioSystem(): AudioSystem { return this.audioSystem; }
  public getInputSystem(): InputSystem { return this.inputSystem; }
  public getRenderSystem(): RenderSystem { return this.renderSystem; }
  public getPhysicsSystem(): PhysicsSystem { return this.physicsSystem; }
  public getSceneManager(): SceneManager { return this.sceneManager; }
  public getAssetManager(): AssetManager { return this.assetManager; }
  public getConfig(): GameConfig { return this.config; }
  public getDeltaTime(): number { return this.deltaTime; }
  public getFPS(): number { return this.fps; }
}