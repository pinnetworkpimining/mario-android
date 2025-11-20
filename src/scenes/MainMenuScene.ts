/**
 * Main Menu Scene
 * Professional main menu with navigation and settings
 */

import { Scene } from '../engine/SceneManager';
import { RenderSystem } from '../engine/RenderSystem';
import { GameEngine } from '../engine/GameEngine';
import { Logger } from '../engine/Logger';

export class MainMenuScene implements Scene {
  public name: string = 'MainMenu';
  private logger: Logger;
  private engine: GameEngine;
  private menuItems: { text: string; action: string; y: number }[] = [];
  private selectedIndex: number = 0;
  private animationTime: number = 0;
  private keyDownHandler: Function;

  constructor() {
    this.logger = Logger.getInstance();
    this.engine = GameEngine.getInstance();
  }

  public async load(): Promise<void> {
    this.logger.info('Loading MainMenu scene');

    // Setup menu items
    const centerY = this.engine.getConfig().height / 2;
    const itemSpacing = 80;
    const startY = centerY - (3 * itemSpacing) / 2;

    this.menuItems = [
      { text: 'START GAME', action: 'startGame', y: startY },
      { text: 'SETTINGS', action: 'settings', y: startY + itemSpacing },
      { text: 'CREDITS', action: 'credits', y: startY + itemSpacing * 2 }
    ];

    // Setup input handlers
    this.keyDownHandler = this.handleKeyDown.bind(this);
    this.engine.getInputSystem().on('keydown', this.keyDownHandler);

    // Start background music
    this.engine.getAudioSystem().playMusic('bgmusic');
  }

  public async unload(): Promise<void> {
    this.logger.info('Unloading MainMenu scene');
    this.engine.getInputSystem().off('keydown', this.keyDownHandler);
  }

  public update(deltaTime: number): void {
    this.animationTime += deltaTime;
  }

  public render(renderSystem: RenderSystem): void {
    const config = this.engine.getConfig();

    // Animated background gradient
    const gradientOffset = Math.sin(this.animationTime * 0.001) * 0.2;
    renderSystem.drawGradientRect(0, 0, config.width, config.height, [
      { offset: 0, color: '#1a1a2e' },
      { offset: 0.5 + gradientOffset, color: '#16213e' },
      { offset: 1, color: '#0f3460' }
    ]);

    // Animated grid background
    const gridAlpha = 0.05 + Math.sin(this.animationTime * 0.002) * 0.03;
    renderSystem.drawGrid(100, '#00ffff', gridAlpha);

    // Animated title with floating effect
    const titleY = config.height * 0.25;
    const titleFloat = Math.sin(this.animationTime * 0.002) * 10;
    const titleGlow = Math.sin(this.animationTime * 0.003) * 0.5 + 0.8;
    const titleScale = 1 + Math.sin(this.animationTime * 0.001) * 0.05;

    renderSystem.drawWithShadow(() => {
      // Save context for scaling
      const ctx = renderSystem.getContext();
      ctx.save();
      ctx.translate(config.width / 2, titleY + titleFloat);
      ctx.scale(titleScale, titleScale);
      ctx.translate(-config.width / 2, -(titleY + titleFloat));

      renderSystem.drawText(
        'CYBER RUNNER',
        config.width / 2,
        titleY + titleFloat,
        'bold 64px Arial',
        '#00ffff',
        'center'
      );

      ctx.restore();
    }, `rgba(0, 255, 255, ${titleGlow})`, 20);

    // Animated menu items with hover effects
    this.menuItems.forEach((item, index) => {
      const isSelected = index === this.selectedIndex;
      const hoverOffset = isSelected ? Math.sin(this.animationTime * 0.008) * 5 : 0;
      const color = isSelected ? '#ff00ff' : '#ffffff';
      const font = isSelected ? 'bold 36px Arial' : '32px Arial';
      const glow = isSelected ? Math.sin(this.animationTime * 0.005) * 15 + 20 : 0;
      const scale = isSelected ? 1 + Math.sin(this.animationTime * 0.006) * 0.1 : 1;

      if (isSelected && glow > 0) {
        renderSystem.drawWithShadow(() => {
          const ctx = renderSystem.getContext();
          ctx.save();
          ctx.translate(config.width / 2, item.y + hoverOffset);
          ctx.scale(scale, scale);
          ctx.translate(-config.width / 2, -(item.y + hoverOffset));

          renderSystem.drawText(item.text, config.width / 2, item.y + hoverOffset, font, color, 'center');

          ctx.restore();
        }, color, glow);
      } else {
        renderSystem.drawText(item.text, config.width / 2, item.y + hoverOffset, font, color, 'center');
      }

      // Add selection indicator
      if (isSelected) {
        const indicatorAlpha = Math.sin(this.animationTime * 0.01) * 0.3 + 0.7;
        renderSystem.drawWithAlpha(() => {
          renderSystem.drawText('►', config.width / 2 - 150, item.y + hoverOffset, '32px Arial', '#ff00ff', 'center');
          renderSystem.drawText('◄', config.width / 2 + 150, item.y + hoverOffset, '32px Arial', '#ff00ff', 'center');
        }, indicatorAlpha);
      }
    });

    // Animated instructions
    const instructionAlpha = Math.sin(this.animationTime * 0.004) * 0.3 + 0.7;
    renderSystem.drawWithAlpha(() => {
      renderSystem.drawText(
        'Use ARROW KEYS or TOUCH to navigate • SPACE or TAP to select',
        config.width / 2,
        config.height * 0.9,
        '18px Arial',
        '#888888',
        'center'
      );
    }, instructionAlpha);

    // Floating particles effect
    this.renderFloatingParticles(renderSystem, config);

    // Render touch controls
    this.engine.getInputSystem().renderTouchControls(renderSystem.getContext());
  }

  private renderFloatingParticles(renderSystem: RenderSystem, config: any): void {
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const x = (config.width / particleCount) * i + Math.sin(this.animationTime * 0.001 + i) * 50;
      const y = config.height * 0.1 + Math.cos(this.animationTime * 0.002 + i) * 30;
      const alpha = Math.sin(this.animationTime * 0.003 + i) * 0.3 + 0.4;
      const size = 2 + Math.sin(this.animationTime * 0.004 + i) * 1;

      renderSystem.drawWithAlpha(() => {
        renderSystem.drawCircle(x, y, size, '#00ffff');
      }, alpha);
    }
  }

  private handleKeyDown(key: string): void {
    this.engine.getAudioSystem().playSound('menu');

    switch (key) {
      case 'ArrowUp':
      case 'ArrowLeft': // Mobile support
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        break;
      case 'ArrowDown':
      case 'ArrowRight': // Mobile support
        this.selectedIndex = Math.min(this.menuItems.length - 1, this.selectedIndex + 1);
        break;
      case 'Space':
      case 'Enter':
        this.selectMenuItem();
        break;
    }
  }

  private async selectMenuItem(): Promise<void> {
    const selectedItem = this.menuItems[this.selectedIndex];
    this.logger.info(`Menu item selected: ${selectedItem.action}`);

    switch (selectedItem.action) {
      case 'startGame':
        await this.engine.getSceneManager().loadScene('Game');
        break;
      case 'settings':
        // TODO: Implement settings scene
        this.logger.info('Settings not implemented yet');
        break;
      case 'credits':
        // TODO: Implement credits scene
        this.logger.info('Credits: Made with ❤️ for mobile gaming');
        break;
    }
  }
}