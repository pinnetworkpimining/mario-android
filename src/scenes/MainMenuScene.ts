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
      { text: 'SELECT LEVEL', action: 'levelSelect', y: startY + itemSpacing },
      { text: 'SETTINGS', action: 'settings', y: startY + itemSpacing * 2 },
      { text: 'CREDITS', action: 'credits', y: startY + itemSpacing * 3 }
    ];
    
    // Setup input handlers
    this.engine.getInputSystem().on('keydown', this.handleKeyDown.bind(this));
    
    // Start background music
    this.engine.getAudioSystem().playMusic();
  }

  public async unload(): Promise<void> {
    this.logger.info('Unloading MainMenu scene');
    this.engine.getInputSystem().off('keydown', this.handleKeyDown.bind(this));
  }

  public update(deltaTime: number): void {
    this.animationTime += deltaTime;
  }

  public render(renderSystem: RenderSystem): void {
    const config = this.engine.getConfig();
    
    // Background gradient
    renderSystem.drawGradientRect(0, 0, config.width, config.height, [
      { offset: 0, color: '#1a1a2e' },
      { offset: 0.5, color: '#16213e' },
      { offset: 1, color: '#0f3460' }
    ]);
    
    // Grid background
    renderSystem.drawGrid(100, '#00ffff', 0.1);
    
    // Title
    const titleY = config.height * 0.25;
    const titleGlow = Math.sin(this.animationTime * 0.003) * 0.3 + 0.7;
    
    renderSystem.drawWithShadow(() => {
      renderSystem.drawText(
        'CYBER RUNNER',
        config.width / 2,
        titleY,
        'bold 64px Arial',
        '#00ffff',
        'center'
      );
    }, `rgba(0, 255, 255, ${titleGlow})`, 20);
    
    // Menu items
    this.menuItems.forEach((item, index) => {
      const isSelected = index === this.selectedIndex;
      const color = isSelected ? '#ff00ff' : '#ffffff';
      const font = isSelected ? 'bold 36px Arial' : '32px Arial';
      const glow = isSelected ? Math.sin(this.animationTime * 0.005) * 10 + 15 : 0;
      
      if (isSelected && glow > 0) {
        renderSystem.drawWithShadow(() => {
          renderSystem.drawText(item.text, config.width / 2, item.y, font, color, 'center');
        }, color, glow);
      } else {
        renderSystem.drawText(item.text, config.width / 2, item.y, font, color, 'center');
      }
    });
    
    // Instructions
    renderSystem.drawText(
      'Use ARROW KEYS or TOUCH to navigate • SPACE or TAP to select',
      config.width / 2,
      config.height * 0.9,
      '18px Arial',
      '#888888',
      'center'
    );
    
    // Render touch controls
    this.engine.getInputSystem().renderTouchControls(renderSystem.getContext());
  }

  private handleKeyDown(key: string): void {
    this.engine.getAudioSystem().playSound('menu');
    
    switch (key) {
      case 'ArrowUp':
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        break;
      case 'ArrowDown':
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
      case 'levelSelect':
        await this.engine.getSceneManager().loadScene('LevelSelect');
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