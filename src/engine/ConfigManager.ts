/**
 * Configuration Management System
 * Handles game settings, preferences, and configuration persistence
 */

import { Logger } from './Logger';

export interface GameSettings {
  audio: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    enabled: boolean;
  };
  graphics: {
    quality: 'low' | 'medium' | 'high';
    particles: boolean;
    shadows: boolean;
  };
  controls: {
    touchSensitivity: number;
    buttonSize: number;
  };
  gameplay: {
    difficulty: 'easy' | 'normal' | 'hard';
    autoSave: boolean;
  };
}

export class ConfigManager {
  private static instance: ConfigManager;
  private logger: Logger;
  private settings: GameSettings;
  private storageKey: string = 'cyberrunner_settings';

  private constructor() {
    this.logger = Logger.getInstance();
    this.settings = this.getDefaultSettings();
    this.loadSettings();
    this.logger.info('ConfigManager initialized');
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private getDefaultSettings(): GameSettings {
    return {
      audio: {
        masterVolume: 0.7,
        musicVolume: 0.5,
        sfxVolume: 0.8,
        enabled: true
      },
      graphics: {
        quality: 'medium',
        particles: true,
        shadows: true
      },
      controls: {
        touchSensitivity: 1.0,
        buttonSize: 1.0
      },
      gameplay: {
        difficulty: 'normal',
        autoSave: true
      }
    };
  }

  public getSettings(): GameSettings {
    return JSON.parse(JSON.stringify(this.settings)); // Deep copy
  }

  public updateSettings(newSettings: Partial<GameSettings>): void {
    this.settings = this.mergeSettings(this.settings, newSettings);
    this.saveSettings();
    this.logger.info('Settings updated');
  }

  private mergeSettings(current: GameSettings, updates: Partial<GameSettings>): GameSettings {
    const merged = JSON.parse(JSON.stringify(current));
    
    if (updates.audio) {
      Object.assign(merged.audio, updates.audio);
    }
    if (updates.graphics) {
      Object.assign(merged.graphics, updates.graphics);
    }
    if (updates.controls) {
      Object.assign(merged.controls, updates.controls);
    }
    if (updates.gameplay) {
      Object.assign(merged.gameplay, updates.gameplay);
    }
    
    return merged;
  }

  private loadSettings(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        this.settings = this.mergeSettings(this.getDefaultSettings(), parsedSettings);
        this.logger.debug('Settings loaded from localStorage');
      }
    } catch (error) {
      this.logger.warn('Failed to load settings from localStorage', error);
      this.settings = this.getDefaultSettings();
    }
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
      this.logger.debug('Settings saved to localStorage');
    } catch (error) {
      this.logger.warn('Failed to save settings to localStorage', error);
    }
  }

  public resetToDefaults(): void {
    this.settings = this.getDefaultSettings();
    this.saveSettings();
    this.logger.info('Settings reset to defaults');
  }

  public exportSettings(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  public importSettings(settingsJson: string): boolean {
    try {
      const importedSettings = JSON.parse(settingsJson);
      this.updateSettings(importedSettings);
      return true;
    } catch (error) {
      this.logger.error('Failed to import settings', error);
      return false;
    }
  }
}