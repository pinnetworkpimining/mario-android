/**
 * Professional Asset Management System
 * Handles loading, caching, and management of game assets
 */

import { Logger } from './Logger';

export interface Asset {
  id: string;
  type: 'image' | 'audio' | 'json' | 'text';
  url: string;
  data: any;
  loaded: boolean;
}

export class AssetManager {
  private logger: Logger;
  private assets: Map<string, Asset> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  constructor() {
    this.logger = Logger.getInstance();
    this.logger.info('AssetManager initialized');
  }

  public async loadAsset(id: string, url: string, type: Asset['type']): Promise<any> {
    // Check if already loaded
    const existingAsset = this.assets.get(id);
    if (existingAsset && existingAsset.loaded) {
      return existingAsset.data;
    }

    // Check if currently loading
    const existingPromise = this.loadingPromises.get(id);
    if (existingPromise) {
      return existingPromise;
    }

    // Start loading
    const loadPromise = this.loadAssetData(id, url, type);
    this.loadingPromises.set(id, loadPromise);

    try {
      const data = await loadPromise;
      
      const asset: Asset = {
        id,
        type,
        url,
        data,
        loaded: true
      };
      
      this.assets.set(id, asset);
      this.loadingPromises.delete(id);
      
      this.logger.debug(`Asset loaded: ${id}`);
      return data;
    } catch (error) {
      this.loadingPromises.delete(id);
      this.logger.error(`Failed to load asset: ${id}`, error);
      throw error;
    }
  }

  private async loadAssetData(id: string, url: string, type: Asset['type']): Promise<any> {
    switch (type) {
      case 'image':
        return this.loadImage(url);
      case 'audio':
        return this.loadAudio(url);
      case 'json':
        return this.loadJSON(url);
      case 'text':
        return this.loadText(url);
      default:
        throw new Error(`Unsupported asset type: ${type}`);
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }

  private async loadAudio(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    
    // This would require an AudioContext, which should be provided by the AudioSystem
    // For now, return the raw buffer
    return arrayBuffer as any;
  }

  private async loadJSON(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
  }

  private async loadText(url: string): Promise<string> {
    const response = await fetch(url);
    return response.text();
  }

  public async loadAssets(assets: { id: string; url: string; type: Asset['type'] }[]): Promise<void> {
    const promises = assets.map(asset => this.loadAsset(asset.id, asset.url, asset.type));
    await Promise.all(promises);
    this.logger.info(`Loaded ${assets.length} assets`);
  }

  public getAsset(id: string): any {
    const asset = this.assets.get(id);
    if (!asset || !asset.loaded) {
      this.logger.warn(`Asset not found or not loaded: ${id}`);
      return null;
    }
    return asset.data;
  }

  public hasAsset(id: string): boolean {
    const asset = this.assets.get(id);
    return asset ? asset.loaded : false;
  }

  public unloadAsset(id: string): void {
    const asset = this.assets.get(id);
    if (asset) {
      this.assets.delete(id);
      this.logger.debug(`Asset unloaded: ${id}`);
    }
  }

  public unloadAll(): void {
    this.assets.clear();
    this.loadingPromises.clear();
    this.logger.info('All assets unloaded');
  }

  public getLoadedAssets(): string[] {
    return Array.from(this.assets.keys()).filter(id => this.assets.get(id)!.loaded);
  }

  public getLoadingProgress(): { loaded: number; total: number; percentage: number } {
    const total = this.assets.size + this.loadingPromises.size;
    const loaded = Array.from(this.assets.values()).filter(asset => asset.loaded).length;
    const percentage = total > 0 ? (loaded / total) * 100 : 100;
    
    return { loaded, total, percentage };
  }
}