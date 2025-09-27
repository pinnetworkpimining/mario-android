import { Projectile } from './Projectile';

export type EnemyType = 'SHOOTER' | 'BOMBER' | 'SNIPER';

export class InteractiveEnemy {
  public x: number;
  public y: number;
  private width: number = 48;
  private height: number = 48;
  private type: EnemyType;
  private health: number = 3;
  private maxHealth: number = 3;
  private shootCooldown: number = 0;
  private maxShootCooldown: number;
  private animationFrame: number = 0;
  private animationTimer: number = 0;
  private defeated: boolean = false;
  private deathTimer: number = 0;
  private detectionRange: number;
  private lastShootTime: number = 0;

  constructor(x: number, y: number, type: EnemyType) {
    this.x = x;
    this.y = y;
    this.type = type;
    
    // Set properties based on enemy type
    switch (type) {
      case 'SHOOTER':
        this.maxShootCooldown = 2000; // 2 seconds
        this.detectionRange = 300;
        break;
      case 'BOMBER':
        this.maxShootCooldown = 3000; // 3 seconds
        this.detectionRange = 200;
        this.health = 4; // Bombers are tougher
        this.maxHealth = 4;
        break;
      case 'SNIPER':
        this.maxShootCooldown = 4000; // 4 seconds
        this.detectionRange = 500; // Long range
        this.health = 2; // But fragile
        this.maxHealth = 2;
        break;
    }
    
    this.shootCooldown = this.maxShootCooldown;
  }

  public update(deltaTime: number): void {
    if (this.defeated) {
      this.deathTimer -= deltaTime;
      return;
    }

    // Update animation
    this.animationTimer += deltaTime;
    if (this.animationTimer >= 200) {
      this.animationFrame = (this.animationFrame + 1) % 4;
      this.animationTimer = 0;
    }

    // Update shoot cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.defeated && this.deathTimer <= 0) return;

    ctx.save();

    if (this.defeated) {
      ctx.globalAlpha = Math.max(0, this.deathTimer / 1000);
      ctx.translate(this.x + this.width/2, this.y + this.height/2);
      ctx.rotate((1000 - this.deathTimer) * 0.01);
      ctx.translate(-this.width/2, -this.height/2);
    }

    this.renderByType(ctx);
    ctx.restore();

    // Render health bar
    if (this.health < this.maxHealth && !this.defeated) {
      this.renderHealthBar(ctx);
    }

    // Render detection range (debug)
    if (false) { // Set to true for debugging
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(this.x + this.width/2, this.y + this.height/2, this.detectionRange, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  private renderByType(ctx: CanvasRenderingContext2D): void {
    const pulse = Math.sin(this.animationFrame * Math.PI / 2) * 0.1 + 1;

    switch (this.type) {
      case 'SHOOTER':
        this.renderShooter(ctx, pulse);
        break;
      case 'BOMBER':
        this.renderBomber(ctx, pulse);
        break;
      case 'SNIPER':
        this.renderSniper(ctx, pulse);
        break;
    }
  }

  private renderShooter(ctx: CanvasRenderingContext2D, pulse: number): void {
    // Main body - red theme
    ctx.fillStyle = '#FF4500';
    ctx.fillRect(this.x + 8, this.y + 8, 32, 32);
    
    // Weapon barrel
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(this.x + 40, this.y + 20, 12, 8);
    
    // Core
    ctx.fillStyle = '#FF0000';
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 10 * pulse;
    ctx.fillRect(this.x + 16, this.y + 16, 16, 16);
    ctx.shadowBlur = 0;
    
    // Eyes
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(this.x + 12, this.y + 12, 4, 4);
    ctx.fillRect(this.x + 28, this.y + 12, 4, 4);
  }

  private renderBomber(ctx: CanvasRenderingContext2D, pulse: number): void {
    // Main body - orange theme, larger
    ctx.fillStyle = '#FF8C00';
    ctx.fillRect(this.x + 4, this.y + 4, 40, 40);
    
    // Bomb compartment
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(this.x + 12, this.y + 32, 24, 12);
    
    // Core - pulsing
    ctx.fillStyle = '#FF4500';
    ctx.shadowColor = '#FF4500';
    ctx.shadowBlur = 15 * pulse;
    ctx.fillRect(this.x + 14, this.y + 14, 20, 20);
    ctx.shadowBlur = 0;
    
    // Warning lights
    if (Math.floor(Date.now() / 300) % 2) {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(this.x + 8, this.y + 8, 6, 6);
      ctx.fillRect(this.x + 34, this.y + 8, 6, 6);
    }
  }

  private renderSniper(ctx: CanvasRenderingContext2D, pulse: number): void {
    // Main body - purple theme, sleeker
    ctx.fillStyle = '#8A2BE2';
    ctx.fillRect(this.x + 12, this.y + 12, 24, 24);
    
    // Long barrel
    ctx.fillStyle = '#4B0082';
    ctx.fillRect(this.x + 36, this.y + 20, 20, 8);
    
    // Scope
    ctx.fillStyle = '#000000';
    ctx.fillRect(this.x + 40, this.y + 16, 12, 4);
    
    // Core
    ctx.fillStyle = '#9370DB';
    ctx.shadowColor = '#9370DB';
    ctx.shadowBlur = 8 * pulse;
    ctx.fillRect(this.x + 18, this.y + 18, 12, 12);
    ctx.shadowBlur = 0;
    
    // Laser sight
    if (this.shootCooldown < 1000) {
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x + 56, this.y + 24);
      ctx.lineTo(this.x + 200, this.y + 24);
      ctx.stroke();
    }
  }

  private renderHealthBar(ctx: CanvasRenderingContext2D): void {
    const barWidth = 40;
    const barHeight = 4;
    const barX = this.x + 4;
    const barY = this.y - 8;
    
    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Health
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? '#00FF00' : '#FF0000';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
  }

  public shouldShoot(): boolean {
    return this.shootCooldown <= 0 && !this.defeated;
  }

  public shoot(): Projectile | null {
    if (!this.shouldShoot()) return null;

    this.shootCooldown = this.maxShootCooldown;
    this.lastShootTime = Date.now();

    const startX = this.x + this.width;
    const startY = this.y + this.height / 2;

    switch (this.type) {
      case 'SHOOTER':
        return new Projectile(startX, startY, 300, 0, 'BULLET');
      case 'BOMBER':
        return new Projectile(startX, startY, 150, -100, 'BOMB');
      case 'SNIPER':
        return new Projectile(startX, startY, 500, 0, 'LASER');
      default:
        return null;
    }
  }

  public takeDamage(): void {
    this.health--;
    if (this.health <= 0) {
      this.defeated = true;
      this.deathTimer = 1000;
    }
  }

  public isDefeated(): boolean {
    return this.defeated && this.deathTimer <= 0;
  }

  public getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  public getDetectionRange(): number {
    return this.detectionRange;
  }

  public getType(): EnemyType {
    return this.type;
  }
}