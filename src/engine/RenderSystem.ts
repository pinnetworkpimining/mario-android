/**
 * Professional Render System
 * Handles all rendering operations with optimization and effects
 */

import { Logger } from './Logger';
import { GameConfig } from './GameEngine';

export interface RenderStats {
  drawCalls: number;
  triangles: number;
  frameTime: number;
}

export class RenderSystem {
  private logger: Logger;
  private ctx: CanvasRenderingContext2D;
  private config: GameConfig;
  private stats: RenderStats;
  private camera: { x: number; y: number; zoom: number };

  constructor(ctx: CanvasRenderingContext2D, config: GameConfig) {
    this.logger = Logger.getInstance();
    this.ctx = ctx;
    this.config = config;
    this.stats = { drawCalls: 0, triangles: 0, frameTime: 0 };
    this.camera = { x: 0, y: 0, zoom: 1 };
    
    this.logger.info('RenderSystem initialized');
  }

  public clear(color: string = '#1a1a2e'): void {
    const startTime = performance.now();
    
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.config.width, this.config.height);
    
    this.stats.drawCalls = 0;
    this.stats.triangles = 0;
    this.stats.frameTime = performance.now() - startTime;
  }

  public setCamera(x: number, y: number, zoom: number = 1): void {
    this.camera.x = x;
    this.camera.y = y;
    this.camera.zoom = zoom;
  }

  public applyCameraTransform(): void {
    this.ctx.save();
    this.ctx.scale(this.camera.zoom, this.camera.zoom);
    this.ctx.translate(-this.camera.x, -this.camera.y);
  }

  public restoreCameraTransform(): void {
    this.ctx.restore();
  }

  public drawRect(x: number, y: number, width: number, height: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
    this.stats.drawCalls++;
  }

  public drawRectOutline(x: number, y: number, width: number, height: number, color: string, lineWidth: number = 1): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(x, y, width, height);
    this.stats.drawCalls++;
  }

  public drawCircle(x: number, y: number, radius: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.stats.drawCalls++;
  }

  public drawCircleOutline(x: number, y: number, radius: number, color: string, lineWidth: number = 1): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
    this.stats.drawCalls++;
  }

  public drawText(text: string, x: number, y: number, font: string, color: string, align: CanvasTextAlign = 'left'): void {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.textAlign = align;
    this.ctx.fillText(text, x, y);
    this.stats.drawCalls++;
  }

  public drawTextWithOutline(text: string, x: number, y: number, font: string, fillColor: string, strokeColor: string, lineWidth: number = 2): void {
    this.ctx.font = font;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.strokeText(text, x, y);
    this.ctx.fillStyle = fillColor;
    this.ctx.fillText(text, x, y);
    this.stats.drawCalls += 2;
  }

  public drawGradientRect(x: number, y: number, width: number, height: number, colorStops: { offset: number; color: string }[]): void {
    const gradient = this.ctx.createLinearGradient(x, y, x, y + height);
    colorStops.forEach(stop => gradient.addColorStop(stop.offset, stop.color));
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, width, height);
    this.stats.drawCalls++;
  }

  public drawWithShadow(drawFunction: () => void, shadowColor: string, blur: number, offsetX: number = 0, offsetY: number = 0): void {
    this.ctx.save();
    this.ctx.shadowColor = shadowColor;
    this.ctx.shadowBlur = blur;
    this.ctx.shadowOffsetX = offsetX;
    this.ctx.shadowOffsetY = offsetY;
    
    drawFunction();
    
    this.ctx.restore();
  }

  public drawWithAlpha(drawFunction: () => void, alpha: number): void {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    
    drawFunction();
    
    this.ctx.restore();
  }

  public drawGrid(cellSize: number, color: string, alpha: number = 0.1): void {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.globalAlpha = alpha;
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x < this.config.width; x += cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.config.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < this.config.height; y += cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.config.width, y);
      this.ctx.stroke();
    }

    this.ctx.restore();
    this.stats.drawCalls += Math.ceil(this.config.width / cellSize) + Math.ceil(this.config.height / cellSize);
  }

  public getStats(): RenderStats {
    return { ...this.stats };
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public getCamera(): { x: number; y: number; zoom: number } {
    return { ...this.camera };
  }
}