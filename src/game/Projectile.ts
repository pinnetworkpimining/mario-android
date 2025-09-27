export type ProjectileType = 'BULLET' | 'BOMB' | 'LASER';

export class Projectile {
  public x: number;
  public y: number;
  private velocityX: number;
  private velocityY: number;
  private type: ProjectileType;
  private width: number;
  private height: number;
  private life: number;
  private maxLife: number;
  private gravity: boolean;
  private animationTimer: number = 0;

  constructor(x: number, y: number, velocityX: number, velocityY: number, type: ProjectileType) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.type = type;
    
    // Set properties based on projectile type
    switch (type) {
      case 'BULLET':
        this.width = 8;
        this.height = 4;
        this.life = 2000; // 2 seconds
        this.gravity = false;
        break;
      case 'BOMB':
        this.width = 12;
        this.height = 12;
        this.life = 3000; // 3 seconds
        this.gravity = true;
        break;
      case 'LASER':
        this.width = 16;
        this.height = 2;
        this.life = 1500; // 1.5 seconds
        this.gravity = false;
        break;
    }
    
    this.maxLife = this.life;
  }

  public update(deltaTime: number): void {
    const dt = deltaTime / 1000;
    
    // Update position
    this.x += this.velocityX * dt;
    this.y += this.velocityY * dt;
    
    // Apply gravity if needed
    if (this.gravity) {
      this.velocityY += 600 * dt; // Gravity acceleration
    }
    
    // Update life
    this.life -= deltaTime;
    
    // Update animation
    this.animationTimer += deltaTime;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.life <= 0) return;

    ctx.save();
    
    const alpha = Math.min(1, this.life / (this.maxLife * 0.3));
    ctx.globalAlpha = alpha;
    
    switch (this.type) {
      case 'BULLET':
        this.renderBullet(ctx);
        break;
      case 'BOMB':
        this.renderBomb(ctx);
        break;
      case 'LASER':
        this.renderLaser(ctx);
        break;
    }
    
    ctx.restore();
  }

  private renderBullet(ctx: CanvasRenderingContext2D): void {
    // Simple bullet
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 5;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Trail effect
    ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.fillRect(this.x - 8, this.y + 1, 8, 2);
  }

  private renderBomb(ctx: CanvasRenderingContext2D): void {
    // Bomb with fuse
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Fuse spark
    if (Math.floor(this.animationTimer / 100) % 2) {
      ctx.fillStyle = '#FF4500';
      ctx.shadowColor = '#FF4500';
      ctx.shadowBlur = 8;
      ctx.fillRect(this.x + this.width/2 - 1, this.y - 4, 2, 4);
    }
    
    // Warning blink
    if (this.life < 1000 && Math.floor(this.animationTimer / 50) % 2) {
      ctx.fillStyle = '#FF0000';
      ctx.shadowColor = '#FF0000';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2 + 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderLaser(ctx: CanvasRenderingContext2D): void {
    // Laser beam
    ctx.fillStyle = '#FF0000';
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 8;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Core beam
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x + 2, this.y, this.width - 4, this.height);
    
    // Energy particles
    for (let i = 0; i < 3; i++) {
      const offsetX = Math.sin(this.animationTimer * 0.01 + i) * 4;
      const offsetY = Math.cos(this.animationTimer * 0.01 + i) * 2;
      ctx.fillStyle = '#FF69B4';
      ctx.fillRect(this.x + offsetX, this.y + offsetY, 2, 2);
    }
  }

  public shouldRemove(): boolean {
    return this.life <= 0 || this.x > window.innerWidth + 100 || this.y > window.innerHeight + 100;
  }

  public getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  public getType(): ProjectileType {
    return this.type;
  }
}