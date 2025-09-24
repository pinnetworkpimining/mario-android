export class Camera {
  public x: number = 0;
  public y: number = 0;
  private targetX: number = 0;
  private targetY: number = 0;
  private smoothing: number = 0.1;
  private canvas: HTMLCanvasElement;
  private levelWidth: number = 0;
  private levelHeight: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public setLevelBounds(width: number, height: number): void {
    this.levelWidth = width;
    this.levelHeight = height;
  }

  public followPlayer(playerX: number, playerY: number): void {
    const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
    
    // Center camera on player
    this.targetX = playerX - canvasWidth / 2;
    this.targetY = playerY - canvasHeight / 2;
    
    // Clamp camera to level bounds
    this.targetX = Math.max(0, Math.min(this.targetX, this.levelWidth - canvasWidth));
    this.targetY = Math.max(0, Math.min(this.targetY, this.levelHeight - canvasHeight));
    
    // Smooth camera movement
    this.x += (this.targetX - this.x) * this.smoothing;
    this.y += (this.targetY - this.y) * this.smoothing;
  }

  public apply(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(-this.x, -this.y);
  }

  public restore(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public worldToScreen(worldX: number, worldY: number): { x: number, y: number } {
    return {
      x: worldX - this.x,
      y: worldY - this.y
    };
  }

  public screenToWorld(screenX: number, screenY: number): { x: number, y: number } {
    return {
      x: screenX + this.x,
      y: screenY + this.y
    };
  }
}