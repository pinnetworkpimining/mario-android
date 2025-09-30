/**
 * Level Select Scene
 * Professional level selection interface
 */

import { Scene } from '../engine/SceneManager';
import { RenderSystem } from '../engine/RenderSystem';
import { GameEngine } from '../engine/GameEngine';
import { Logger } from '../engine/Logger';

interface LevelInfo {
  number: number;
  name: string;
  description: string;
  unlocked: boolean;
}

export class LevelSelectScene implements Scene {
  public name: string = 'LevelSelect';
  private logger: Logger;
  private engine: GameEngine;
  private levels: LevelInfo[] = [];
  private selectedIndex: number = 0;
  private animationTime: number = 0;

  constructor() {
    this.logger = Logger.getInstance();
    this.engine = GameEngine.getInstance();
  }

  public async load(): Promise<void> {
    this.logger.info('Loading LevelSelect scene');
    
    // Setup level information
    this.levels = [
      { number: 1, name: 'Tutorial', description: 'Learn the basics', unlocked: true },
      { number: 2, name: 'Forest Run', description: 'Jump through the trees', unlocked: true },
      { number: 3, name: 'Mountain Peak', description: 'Reach new heights', unlocked: true },
      { number: 4, name: 'Desert Storm', description: 'Survive the sandstorm', unlocked: true },
      { number: 5, name: 'Ice Cave', description: 'Slip and slide to victory', unlocked: true },
      { number: 6, name: 'Robot Factory', description: 'Face the machines', unlocked: true }
    ];
    
    // Setup input handlers
    this.engine.getInputSystem().on('keydown', this.handleKeyDown.bind(this));
  }

  public async unload(): Promise<void> {
    this.logger.info('Unloading LevelSelect scene');
    this.engine.getInputSystem().off('keydown', this.handleKeyDown.bind(this));
  }

  public update(deltaTime: number): void {
    this.animationTime += deltaTime;
  }

  public render(renderSystem: RenderSystem): void {
    const config = this.engine.getConfig();
    
    // Animated background gradient
    const gradientOffset = Math.sin(this.animationTime * 0.001) * 0.1;
    renderSystem.drawGradientRect(0, 0, config.width, config.height, [
      { offset: 0, color: '#1a1a2e' },
      { offset: 0.5 + gradientOffset, color: '#16213e' },
      { offset: 1, color: '#0f3460' }
    ]);
    
    // Animated grid background
    const gridAlpha = 0.03 + Math.sin(this.animationTime * 0.002) * 0.02;
    renderSystem.drawGrid(100, '#00ffff', gridAlpha);
    
    // Animated title
    const titleFloat = Math.sin(this.animationTime * 0.003) * 5;
    renderSystem.drawWithShadow(() => {
      renderSystem.drawText(
        'SELECT LEVEL',
        config.width / 2,
        80 + titleFloat,
        'bold 48px Arial',
        '#00ffff',
        'center'
      );
    }, '#00ffff', 15);
    
    // Animated level grid
    const cols = 3;
    const rows = 2;
    const cardWidth = 200;
    const cardHeight = 150;
    const spacing = 50;
    const startX = (config.width - (cols * cardWidth + (cols - 1) * spacing)) / 2;
    const startY = 150;
    
    this.levels.forEach((level, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * (cardWidth + spacing);
      const y = startY + row * (cardHeight + spacing);
      
      this.renderLevelCard(renderSystem, level, x, y, cardWidth, cardHeight, index === this.selectedIndex);
    });
    
    // Animated instructions
    const instructionAlpha = Math.sin(this.animationTime * 0.004) * 0.3 + 0.7;
    renderSystem.drawWithAlpha(() => {
      renderSystem.drawText(
        'Use ARROW KEYS to navigate • SPACE to select • ESC to go back',
        config.width / 2,
        config.height - 50,
        '18px Arial',
        '#888888',
        'center'
      );
    }, instructionAlpha);
    
    // Render touch controls
    this.engine.getInputSystem().renderTouchControls(renderSystem.getContext());
  }

  private renderLevelCard(
    renderSystem: RenderSystem,
    level: LevelInfo,
    x: number,
    y: number,
    width: number,
    height: number,
    selected: boolean
  ): void {
    // Animated card background
    const hoverScale = selected ? 1 + Math.sin(this.animationTime * 0.008) * 0.05 : 1;
    const floatOffset = selected ? Math.sin(this.animationTime * 0.006) * 3 : 0;
    
    const ctx = renderSystem.getContext();
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2 + floatOffset);
    ctx.scale(hoverScale, hoverScale);
    ctx.translate(-(x + width / 2), -(y + height / 2 + floatOffset));
    
    const bgColor = level.unlocked ? (selected ? '#16213e' : '#1a1a2e') : '#333333';
    renderSystem.drawRect(x, y + floatOffset, width, height, bgColor);
    
    // Animated card border
    const borderColor = selected ? '#ff00ff' : (level.unlocked ? '#00ffff' : '#666666');
    const borderWidth = selected ? 3 : 2;
    renderSystem.drawRectOutline(x, y + floatOffset, width, height, borderColor, borderWidth);
    
    if (selected) {
      const glowIntensity = Math.sin(this.animationTime * 0.01) * 10 + 15;
      renderSystem.drawWithShadow(() => {
        renderSystem.drawRectOutline(x, y + floatOffset, width, height, '#ff00ff', 3);
      }, '#ff00ff', glowIntensity);
    }
    
    // Animated level number
    const numberPulse = selected ? 1 + Math.sin(this.animationTime * 0.01) * 0.2 : 1;
    const numberColor = level.unlocked ? '#00ffff' : '#666666';
    
    ctx.save();
    ctx.translate(x + width / 2, y + 40 + floatOffset);
    ctx.scale(numberPulse, numberPulse);
    ctx.translate(-(x + width / 2), -(y + 40 + floatOffset));
    
    renderSystem.drawText(
      level.number.toString(),
      x + width / 2,
      y + 40 + floatOffset,
      'bold 36px Arial',
      numberColor,
      'center'
    );
    
    ctx.restore();
    
    // Level name
    const nameColor = level.unlocked ? '#ffffff' : '#888888';
    renderSystem.drawText(
      level.name,
      x + width / 2,
      y + 80 + floatOffset,
      'bold 18px Arial',
      nameColor,
      'center'
    );
    
    // Level description
    const descColor = level.unlocked ? '#cccccc' : '#666666';
    renderSystem.drawText(
      level.description,
      x + width / 2,
      y + 105 + floatOffset,
      '14px Arial',
      descColor,
      'center'
    );
    
    // Lock icon for locked levels
    if (!level.unlocked) {
      renderSystem.drawText(
        '🔒',
        x + width - 25,
        y + 25 + floatOffset,
        '20px Arial',
        '#666666',
        'center'
      );
    }
    
    // Progress indicator for unlocked levels
    if (level.unlocked && !selected) {
      const progressAlpha = Math.sin(this.animationTime * 0.005 + level.number) * 0.2 + 0.3;
      renderSystem.drawWithAlpha(() => {
        renderSystem.drawText('✓', x + width - 25, y + height - 25 + floatOffset, '16px Arial', '#00ff00', 'center');
      }, progressAlpha);
    }
    
    ctx.restore();
  }

  private handleKeyDown(key: string): void {
    this.engine.getAudioSystem().playSound('menu');
    
    switch (key) {
      case 'ArrowLeft':
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        break;
      case 'ArrowRight':
        this.selectedIndex = Math.min(this.levels.length - 1, this.selectedIndex + 1);
        break;
      case 'ArrowUp':
        this.selectedIndex = Math.max(0, this.selectedIndex - 3);
        break;
      case 'ArrowDown':
        this.selectedIndex = Math.min(this.levels.length - 1, this.selectedIndex + 3);
        break;
      case 'Space':
      case 'Enter':
        this.selectLevel();
        break;
      case 'Escape':
        this.goBack();
        break;
    }
  }

  private async selectLevel(): Promise<void> {
    const selectedLevel = this.levels[this.selectedIndex];
    
    if (!selectedLevel.unlocked) {
      this.logger.info('Level is locked');
      return;
    }
    
    this.logger.info(`Level selected: ${selectedLevel.number}`);
    
    // TODO: Pass level number to game scene
    await this.engine.getSceneManager().loadScene('Game');
  }

  private async goBack(): Promise<void> {
    await this.engine.getSceneManager().loadScene('MainMenu');
  }
}