export enum PowerUpType {
  HEALTH = 'health',
  SPEED = 'speed',
  JUMP = 'jump',
  SHIELD = 'shield'
}

export class PowerUp {
  public x: number;
  public y: number;
  private width: number = 24;
  private height: number = 24;
  private type: PowerUpType;
  private animationTimer: number = 0;
  private collected: boolean = false;
  private floatOffset: number = 0;

  constructor(x: number, y: number, type: PowerUpType) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  public update(deltaTime: number): void {
    this.animationTimer += deltaTime;
    this.floatOffset = Math.sin(this.animationTimer / 500) * 5;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.collected) return;

    const scale = Math.min(window.innerWidth / 1900, window.innerHeight / 900);
    const scaledWidth = this.width * Math.max(scale, 0.8);
    const scaledHeight = this.height * Math.max(scale, 0.8);
    const renderY = this.y + this.floatOffset;

    ctx.save();
    
    // Glow effect
    ctx.shadowColor = this.getGlowColor();
    ctx.shadowBlur = 10 * scale;
    
    // Main body
    ctx.fillStyle = this.getMainColor();
    ctx.fillRect(this.x, renderY, scaledWidth, scaledHeight);
    
    // Icon
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${16 * scale}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      this.getIcon(),
      this.x + scaledWidth / 2,
      renderY + scaledHeight / 2
    );
    
    ctx.restore();
  }

  private getMainColor(): string {
    switch (this.type) {
      case PowerUpType.HEALTH: return '#FF0000';
      case PowerUpType.SPEED: return '#00FF00';
      case PowerUpType.JUMP: return '#0000FF';
      case PowerUpType.SHIELD: return '#FFD700';
      default: return '#FFFFFF';
    }
  }

  private getGlowColor(): string {
    switch (this.type) {
      case PowerUpType.HEALTH: return '#FF6666';
      case PowerUpType.SPEED: return '#66FF66';
      case PowerUpType.JUMP: return '#6666FF';
      case PowerUpType.SHIELD: return '#FFFF66';
      default: return '#FFFFFF';
    }
  }

  private getIcon(): string {
    switch (this.type) {
      case PowerUpType.HEALTH: return '+';
      case PowerUpType.SPEED: return '→';
      case PowerUpType.JUMP: return '↑';
      case PowerUpType.SHIELD: return '◊';
      default: return '?';
    }
  }

  public getBounds() {
    return {
      x: this.x,
      y: this.y + this.floatOffset,
      width: this.width,
      height: this.height
    };
  }

  public collect(): PowerUpType {
    this.collected = true;
    return this.type;
  }

  public isCollected(): boolean {
    return this.collected;
  }
}