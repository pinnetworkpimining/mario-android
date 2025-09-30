/**
 * Professional Scene Management System
 * Handles scene transitions, loading, and lifecycle management
 */

import { Logger } from './Logger';
import { GameEngine } from './GameEngine';
import { RenderSystem } from './RenderSystem';

export interface Scene {
  name: string;
  load(): Promise<void>;
  unload(): Promise<void>;
  update(deltaTime: number): void;
  render(renderSystem: RenderSystem): void;
  handleInput?(input: any): void;
}

export class SceneManager {
  private logger: Logger;
  private engine: GameEngine;
  private scenes: Map<string, Scene> = new Map();
  private currentScene: Scene | null = null;
  private isTransitioning: boolean = false;
  private transitionProgress: number = 0;
  private transitionDuration: number = 0.5; // seconds

  constructor(engine: GameEngine) {
    this.logger = Logger.getInstance();
    this.engine = engine;
    this.logger.info('SceneManager initialized');
  }

  public registerScene(scene: Scene): void {
    this.scenes.set(scene.name, scene);
    this.logger.info(`Scene registered: ${scene.name}`);
  }

  public async loadScene(sceneName: string): Promise<void> {
    if (this.isTransitioning) {
      this.logger.warn(`Cannot load scene ${sceneName} - transition in progress`);
      return;
    }

    const scene = this.scenes.get(sceneName);
    if (!scene) {
      this.logger.error(`Scene not found: ${sceneName}`);
      return;
    }

    this.logger.info(`Loading scene: ${sceneName}`);
    this.isTransitioning = true;
    this.transitionProgress = 0;

    try {
      // Unload current scene
      if (this.currentScene) {
        await this.currentScene.unload();
        this.logger.debug(`Unloaded scene: ${this.currentScene.name}`);
      }

      // Load new scene
      await scene.load();
      this.currentScene = scene;
      
      this.logger.info(`Scene loaded successfully: ${sceneName}`);
    } catch (error) {
      this.logger.error(`Failed to load scene: ${sceneName}`, error);
    } finally {
      this.isTransitioning = false;
      this.transitionProgress = 0;
    }
  }

  public getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  public isSceneTransitioning(): boolean {
    return this.isTransitioning;
  }

  public update(deltaTime: number): void {
    if (this.isTransitioning) {
      this.transitionProgress += deltaTime / this.transitionDuration;
      this.transitionProgress = Math.min(this.transitionProgress, 1);
    }

    if (this.currentScene && !this.isTransitioning) {
      try {
        this.currentScene.update(deltaTime);
      } catch (error) {
        this.logger.error(`Error updating scene: ${this.currentScene.name}`, error);
      }
    }
  }

  public render(renderSystem: RenderSystem): void {
    if (this.currentScene) {
      try {
        this.currentScene.render(renderSystem);
      } catch (error) {
        this.logger.error(`Error rendering scene: ${this.currentScene.name}`, error);
      }
    }

    // Render transition effect
    if (this.isTransitioning) {
      this.renderTransition(renderSystem);
    }
  }

  private renderTransition(renderSystem: RenderSystem): void {
    const alpha = Math.sin(this.transitionProgress * Math.PI);
    renderSystem.drawWithAlpha(() => {
      renderSystem.drawRect(0, 0, this.engine.getConfig().width, this.engine.getConfig().height, '#000000');
    }, alpha);
  }

  public handleInput(input: any): void {
    if (this.currentScene && this.currentScene.handleInput && !this.isTransitioning) {
      try {
        this.currentScene.handleInput(input);
      } catch (error) {
        this.logger.error(`Error handling input in scene: ${this.currentScene.name}`, error);
      }
    }
  }
}