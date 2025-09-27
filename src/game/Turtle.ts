
export class Turtle {
  public x: number;
  public y: number;
  private width: number = 32;
  private height: number = 32;
  private velocityX: number = -80;
  private animationFrame: number = 0;
  private animationTimer: number = 0;
  private animationInterval: number = 150;
  private health: number = 2;
  private maxHealth: number = 2;
  private isStunned: boolean = false;
  private stunnedTimer: number = 0;
  private shellMode: boolean = false;
  private deathTimer: number = 0;
  private isDying: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public update(deltaTime: number): void {
    if (this.isDying) {
      this.deathTimer -= deltaTime;
      return;
    }

    const dt = deltaTime / 1000; // Convert to seconds

    // Handle stunned state
    if (this.isStunned) {
      this.stunnedTimer -= deltaTime;
      if (this.stunnedTimer <= 0) {
        this.isStunned = false;
        this.shellMode = false;
      }
      return;
    }

    // Move horizontally
    this.x += this.velocityX * dt;

    // Keep turtle on screen (dynamic width)
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const maxWidth = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
    if (this.x < 0 || this.x + this.width > maxWidth) {
      this.velocityX *= -1; // Reverse direction
    }

    // Update animation
    this.animationTimer += deltaTime;
    if (this.animationTimer >= this.animationInterval) {
      this.animationFrame = (this.animationFrame + 1) % 4;
      this.animationTimer = 0;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    // Scale rendering for mobile devices
    const scale = Math.min(window.innerWidth / 1900, window.innerHeight / 900);
    const scaledWidth = this.width * Math.max(scale, 0.8);
    const scaledHeight = this.height * Math.max(scale, 0.8);
    
    ctx.save();
    
    if (this.isDying) {
      ctx.globalAlpha = Math.max(0, this.deathTimer / 1000);
      ctx.translate(this.x + scaledWidth/2, this.y + scaledHeight/2);
      ctx.rotate((1000 - this.deathTimer) * 0.01);
      ctx.translate(-scaledWidth/2, -scaledHeight/2);
    }
    
    if (this.shellMode || this.isStunned) {
      this.renderShell(ctx, scale, scaledWidth, scaledHeight);
    } else {
      this.renderNormalTurtle(ctx, scale, scaledWidth, scaledHeight);
    }
    
    ctx.restore();
    
    // Render health indicator
    if (this.health < this.maxHealth && !this.isDying) {
      this.renderHealthIndicator(ctx, scale);
    }
  }

  private renderNormalTurtle(ctx: CanvasRenderingContext2D, scale: number, scaledWidth: number, scaledHeight: number): void {
    const walkOffset = Math.sin(this.animationFrame * Math.PI / 2) * 2 * scale;

    // Main body
    ctx.fillStyle = '#228B22'; // Forest green
    ctx.fillRect(this.x + 4 * scale, this.y + 8 * scale + walkOffset, 24 * scale, 16 * scale);
    
    // Shell with pattern
    ctx.fillStyle = '#8B4513'; // Saddle brown
    ctx.fillRect(this.x + 2 * scale, this.y + 6 * scale, 28 * scale, 20 * scale);
    
    // Shell pattern
    ctx.fillStyle = '#A0522D';
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        ctx.fillRect(
          this.x + (4 + i * 8) * scale,
          this.y + (8 + j * 8) * scale,
          6 * scale,
          6 * scale
        );
      }
    }
    
    // Head
    ctx.fillStyle = '#32CD32'; // Lime green
    ctx.fillRect(this.x + 26 * scale, this.y + 12 * scale, 8 * scale, 8 * scale);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(this.x + 28 * scale, this.y + 14 * scale, 2 * scale, 2 * scale);
    ctx.fillRect(this.x + 31 * scale, this.y + 14 * scale, 2 * scale, 2 * scale);
    
    // Legs with walking animation
    ctx.fillStyle = '#228B22';
    const legOffset = Math.sin(this.animationFrame * Math.PI) * 2 * scale;
    ctx.fillRect(this.x + 6 * scale + legOffset, this.y + 24 * scale, 4 * scale, 6 * scale);
    ctx.fillRect(this.x + 14 * scale - legOffset, this.y + 24 * scale, 4 * scale, 6 * scale);
    ctx.fillRect(this.x + 18 * scale + legOffset, this.y + 24 * scale, 4 * scale, 6 * scale);
    ctx.fillRect(this.x + 26 * scale - legOffset, this.y + 24 * scale, 4 * scale, 6 * scale);
  }

  private renderShell(ctx: CanvasRenderingContext2D, scale: number, scaledWidth: number, scaledHeight: number): void {
    // Shell only (turtle hiding)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(this.x + 2 * scale, this.y + 8 * scale, 28 * scale, 16 * scale);

    // Shell pattern
    ctx.fillStyle = '#A0522D';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(
        this.x + (4 + i * 8) * scale,
        this.y + (10 + (i % 2) * 6) * scale,
        6 * scale,
        4 * scale
      );
    }
    
    // Spinning effect when stunned
    if (this.isStunned && Math.floor(Date.now() / 100) % 2) {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(this.x + 14 * scale, this.y + 14 * scale, 4 * scale, 4 * scale);
    }
  }

  private renderHealthIndicator(ctx: CanvasRenderingContext2D, scale: number): void {
    const barWidth = 20 * scale;
    const barHeight = 3 * scale;
    const barX = this.x + 6 * scale;
    const barY = this.y - 6 * scale;
    
    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Health bar
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? '#00FF00' : '#FF0000';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
  }

  public takeDamage(): boolean {
    this.health--;
    if (this.health <= 0) {
      this.isDying = true;
      this.deathTimer = 1000;
      return true; // Defeated
    } else {
      this.isStunned = true;
      this.stunnedTimer = 2000;
      this.shellMode = true;
      this.velocityX = 0;
      return false; // Still alive but stunned
    }
  }

  public isDefeated(): boolean {
    return this.isDying && this.deathTimer <= 0;
  }

  public isInShellMode(): boolean {
    return this.shellMode;
  }

  public getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}