import { Player } from './Player';

export enum PowerUpType {
  HEALTH = 'health',
  SPEED = 'speed',
  JUMP = 'jump',
  SHIELD = 'shield'
}

export class PowerUp {
  public x: number;
  public y: number;
  public width: number = 24;
  public height: number = 24;
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

    const y = this.y + this.floatOffset;

    // Draw based on type
    switch (this.type) {
      case PowerUpType.HEALTH:
        ctx.fillStyle = '#FF0000';
        this.drawHeart(ctx, this.x, y, this.width, this.height);
        break;
      case PowerUpType.SPEED:
        ctx.fillStyle = '#00FFFF';
        this.drawLightning(ctx, this.x, y, this.width, this.height);
        break;
      case PowerUpType.JUMP:
        ctx.fillStyle = '#00FF00';
        this.drawSpring(ctx, this.x, y, this.width, this.height);
        break;
      case PowerUpType.SHIELD:
        ctx.fillStyle = '#FFFF00';
        this.drawShield(ctx, this.x, y, this.width, this.height);
        break;
    }
  }

  private drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + h / 4);
    ctx.bezierCurveTo(x + w / 2, y, x, y, x, y + h / 4);
    ctx.bezierCurveTo(x, y + h / 2, x + w / 2, y + h, x + w / 2, y + h);
    ctx.bezierCurveTo(x + w / 2, y + h, x + w, y + h / 2, x + w, y + h / 4);
    ctx.bezierCurveTo(x + w, y, x + w / 2, y, x + w / 2, y + h / 4);
    ctx.fill();
  }

  private drawLightning(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w, y + h / 3);
    ctx.lineTo(x + w / 2, y + h / 3);
    ctx.lineTo(x + w / 2, y + h);
    ctx.lineTo(x, y + h / 3 * 2);
    ctx.lineTo(x + w / 2, y + h / 3 * 2);
    ctx.closePath();
    ctx.fill();
  }

  private drawSpring(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    ctx.fillRect(x, y + h / 2, w, h / 2);
    ctx.fillRect(x + w / 4, y, w / 2, h / 2);
  }

  private drawShield(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  public collect(player: Player): void {
    this.collected = true;

    switch (this.type) {
      case PowerUpType.HEALTH:
        player.heal(25);
        break;
      case PowerUpType.SPEED:
        player.increaseSpeed();
        break;
      case PowerUpType.JUMP:
        player.increaseJump();
        break;
      case PowerUpType.SHIELD:
        player.setInvulnerable(5000);
        break;
    }
  }

  public isCollected(): boolean {
    return this.collected;
  }

  public getBounds() {
    return {
      x: this.x,
      y: this.y + this.floatOffset,
      width: this.width,
      height: this.height
    };
  }
}