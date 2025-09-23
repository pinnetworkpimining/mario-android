import { InputManager } from './InputManager';

export class Player {
  public x: number;
  public y: number;
  private width: number = 32;
  private height: number = 32;
  private velocityX: number = 0;
  private velocityY: number = 0;
  private speed: number = 250;
  private jumpPower: number = 450;
  private gravity: number = 800;
  private onGround: boolean = false;
  private lives: number = 3;
  private animationFrame: number = 0;
  private animationTimer: number = 0;
  private animationSpeed: number = 150;
  private facingRight: boolean = true;
  private isMoving: boolean = false;
  private jumpAnimationTimer: number = 0;
  private health: number = 100;
  private maxHealth: number = 100;
  private invulnerable: boolean = false;
  private invulnerabilityTimer: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public update(deltaTime: number, inputManager: InputManager): void {
    const dt = deltaTime / 1000; // Convert to seconds
    
    // Update invulnerability
    if (this.invulnerable) {
      this.invulnerabilityTimer -= deltaTime;
      if (this.invulnerabilityTimer <= 0) {
        this.invulnerable = false;
      }
    }

    // Handle horizontal movement
    this.isMoving = false;
    if (inputManager.isKeyPressed('ArrowLeft')) {
      this.velocityX = -this.speed;
      this.facingRight = false;
      this.isMoving = true;
    } else if (inputManager.isKeyPressed('ArrowRight')) {
      this.velocityX = this.speed;
      this.facingRight = true;
      this.isMoving = true;
    } else {
      this.velocityX *= 0.8; // Smooth deceleration
    }

    // Handle jumping
    if (inputManager.isKeyPressed('Space') && this.onGround) {
      this.velocityY = -this.jumpPower;
      this.onGround = false;
      this.jumpAnimationTimer = 300; // Jump animation duration
    }

    // Apply gravity
    this.velocityY += this.gravity * dt;

    // Update position
    this.x += this.velocityX * dt;
    this.y += this.velocityY * dt;

    // Keep player on screen (dynamic canvas width)
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const maxWidth = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > maxWidth) this.x = maxWidth - this.width;

    // Update animations
    this.updateAnimations(deltaTime);

    // Reset ground state
    this.onGround = false;
  }

  private updateAnimations(deltaTime: number): void {
    // Update walking animation
    if (this.isMoving && this.onGround) {
      this.animationTimer += deltaTime;
      if (this.animationTimer >= this.animationSpeed) {
        this.animationFrame = (this.animationFrame + 1) % 4;
        this.animationTimer = 0;
      }
    } else {
      this.animationFrame = 0;
    }

    // Update jump animation
    if (this.jumpAnimationTimer > 0) {
      this.jumpAnimationTimer -= deltaTime;
    }
  }
  public render(ctx: CanvasRenderingContext2D): void {
    // Scale rendering for mobile devices
    const scale = Math.min(window.innerWidth / 1900, window.innerHeight / 900);
    const scaledWidth = this.width * Math.max(scale, 0.8);
    const scaledHeight = this.height * Math.max(scale, 0.8);
    
    ctx.save();
    
    // Apply invulnerability flashing effect
    if (this.invulnerable && Math.floor(Date.now() / 100) % 2) {
      ctx.globalAlpha = 0.5;
    }
    
    // Flip sprite if facing left
    if (!this.facingRight) {
      ctx.scale(-1, 1);
      ctx.translate(-this.x * 2 - scaledWidth, 0);
    }
    
    this.renderAdvancedCharacter(ctx, scale, scaledWidth, scaledHeight);
    
    ctx.restore();
    
    // Render health bar
    this.renderHealthBar(ctx, scale);
  }

  private renderAdvancedCharacter(ctx: CanvasRenderingContext2D, scale: number, scaledWidth: number, scaledHeight: number): void {
    const isJumping = this.jumpAnimationTimer > 0;
    const walkOffset = this.isMoving ? Math.sin(this.animationFrame * Math.PI / 2) * 2 * scale : 0;
    
    // Body (main torso)
    ctx.fillStyle = '#2E86AB'; // Professional blue
    ctx.fillRect(this.x + 6 * scale, this.y + 12 * scale + walkOffset, 20 * scale, 16 * scale);
    
    // Head
    ctx.fillStyle = '#F24236'; // Professional red
    ctx.fillRect(this.x + 8 * scale, this.y + 2 * scale, 16 * scale, 12 * scale);
    
    // Helmet/Cap
    ctx.fillStyle = '#A23B72'; // Dark purple
    ctx.fillRect(this.x + 6 * scale, this.y, 20 * scale, 6 * scale);
    
    // Visor
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(this.x + 8 * scale, this.y + 4 * scale, 16 * scale, 2 * scale);
    
    // Arms
    ctx.fillStyle = '#2E86AB';
    const armY = this.y + 14 * scale + walkOffset;
    ctx.fillRect(this.x + 2 * scale, armY, 6 * scale, 10 * scale); // Left arm
    ctx.fillRect(this.x + 24 * scale, armY, 6 * scale, 10 * scale); // Right arm
    
    // Legs with walking animation
    ctx.fillStyle = '#1A5490'; // Darker blue for legs
    const legOffset = this.isMoving && this.onGround ? Math.sin(this.animationFrame * Math.PI) * 3 * scale : 0;
    if (isJumping) {
      // Jumping pose - legs together
      ctx.fillRect(this.x + 10 * scale, this.y + 28 * scale, 12 * scale, 4 * scale);
    } else {
      // Walking/standing legs
      ctx.fillRect(this.x + 8 * scale + legOffset, this.y + 28 * scale, 6 * scale, 4 * scale);
      ctx.fillRect(this.x + 18 * scale - legOffset, this.y + 28 * scale, 6 * scale, 4 * scale);
    }
    
    // Boots
    ctx.fillStyle = '#8B4513'; // Brown boots
    if (isJumping) {
      ctx.fillRect(this.x + 10 * scale, this.y + 30 * scale, 12 * scale, 2 * scale);
    } else {
      ctx.fillRect(this.x + 8 * scale + legOffset, this.y + 30 * scale, 6 * scale, 2 * scale);
      ctx.fillRect(this.x + 18 * scale - legOffset, this.y + 30 * scale, 6 * scale, 2 * scale);
    }
    
    // Chest emblem
    ctx.fillStyle = '#FFD700'; // Gold emblem
    ctx.fillRect(this.x + 12 * scale, this.y + 16 * scale, 8 * scale, 6 * scale);
    
    // Add energy glow effect
    if (this.health > 50) {
      ctx.shadowColor = '#00FFFF';
      ctx.shadowBlur = 5 * scale;
      ctx.fillStyle = '#00FFFF';
      ctx.fillRect(this.x + 14 * scale, this.y + 18 * scale, 4 * scale, 2 * scale);
      ctx.shadowBlur = 0;
    }
  }

  private renderHealthBar(ctx: CanvasRenderingContext2D, scale: number): void {
    const barWidth = 30 * scale;
    const barHeight = 4 * scale;
    const barX = this.x - 2 * scale;
    const barY = this.y - 8 * scale;
    
    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Health bar
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = healthPercent > 0.6 ? '#00FF00' : healthPercent > 0.3 ? '#FFFF00' : '#FF0000';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    // Border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  }

  public getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.onGround = false;
    this.health = this.maxHealth;
    this.invulnerable = false;
    this.animationFrame = 0;
  }

  public setOnGround(onGround: boolean): void {
    this.onGround = onGround;
  }

  public getVelocityY(): number {
    return this.velocityY;
  }

  public setVelocityY(velocity: number): void {
    this.velocityY = velocity;
  }

  public loseLife(): void {
    if (!this.invulnerable) {
      this.health -= 25;
      this.lives -= 1;
      this.invulnerable = true;
      this.invulnerabilityTimer = 1000; // 1 second of invulnerability
    }
  }

  public getLives(): number {
    return this.lives;
  }

  public getHealth(): number {
    return this.health;
  }

  public heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }
}
