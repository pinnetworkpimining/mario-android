import { InputManager } from './InputManager';
import { AudioManager } from './AudioManager';

export class Player {
  public x: number;
  public y: number;
  private width: number = 64;
  private height: number = 64;
  private velocityX: number = 0;
  private velocityY: number = 0;
  private speed: number = 400;
  private jumpPower: number = 600;
  private gravity: number = 1200;
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
  private audioManager: AudioManager | null = null;
  private gameWidth: number;
  private gameHeight: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.gameWidth = window.innerWidth;
    this.gameHeight = window.innerHeight;
    // Initialize audio manager
    this.audioManager = new AudioManager();
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
    if (inputManager.isKeyPressed('ArrowLeft') || inputManager.isKeyPressed('KeyA')) {
      this.velocityX = -this.speed;
      this.facingRight = false;
      this.isMoving = true;
    } else if (inputManager.isKeyPressed('ArrowRight') || inputManager.isKeyPressed('KeyD')) {
      this.velocityX = this.speed;
      this.facingRight = true;
      this.isMoving = true;
    } else {
      this.velocityX *= 0.8; // Smooth deceleration
    }

    // Handle jumping
    if ((inputManager.isKeyPressed('Space') || inputManager.isKeyPressed('KeyW')) && this.onGround) {
      this.velocityY = -this.jumpPower;
      this.onGround = false;
      this.jumpAnimationTimer = 300; // Jump animation duration
      if (this.audioManager) {
        this.audioManager.playSound('jump');
      }
    }

    // Apply gravity
    this.velocityY += this.gravity * dt;

    // Update position
    this.x += this.velocityX * dt;
    this.y += this.velocityY * dt;

    // Keep player within screen bounds
    if (this.x < 0) this.x = 0;

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
    // Mobile-optimized rendering
    const scaledWidth = this.width;
    const scaledHeight = this.height;
    
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
    
    this.renderAdvancedCharacter(ctx, scaledWidth, scaledHeight);
    
    ctx.restore();
    
    // Render health bar above player
    this.renderHealthBar(ctx);
  }

  private renderAdvancedCharacter(ctx: CanvasRenderingContext2D, scaledWidth: number, scaledHeight: number): void {
    const isJumping = this.jumpAnimationTimer > 0;
    const walkOffset = this.isMoving ? Math.sin(this.animationFrame * Math.PI / 2) * 3 : 0;
    
    // Make character more colorful and appealing
    // Body (main torso)
    ctx.fillStyle = '#4169E1'; // Royal blue - more appealing
    ctx.fillRect(this.x + 12, this.y + 24 + walkOffset, 40, 32);
    
    // Head
    ctx.fillStyle = '#FFD700'; // Gold - more attractive
    ctx.fillRect(this.x + 16, this.y + 4, 32, 24);
    
    // Hero helmet
    ctx.fillStyle = '#8B0000'; // Dark red - heroic
    ctx.fillRect(this.x + 12, this.y, 40, 12);
    
    // Hero visor
    ctx.fillStyle = '#00BFFF'; // Deep sky blue
    ctx.shadowColor = '#00BFFF';
    ctx.shadowBlur = 10;
    ctx.fillRect(this.x + 16, this.y + 8, 32, 4);
    ctx.shadowBlur = 0;
    
    // Arms
    ctx.fillStyle = '#32CD32'; // Lime green - friendly
    const armY = this.y + 28 + walkOffset;
    ctx.fillRect(this.x + 4, armY, 12, 20); // Left arm
    ctx.fillRect(this.x + 48, armY, 12, 20); // Right arm
    
    // Legs with walking animation
    ctx.fillStyle = '#FF6347'; // Tomato red - vibrant
    const legOffset = this.isMoving && this.onGround ? Math.sin(this.animationFrame * Math.PI) * 6 : 0;
    if (isJumping) {
      // Jumping pose - legs together
      ctx.fillRect(this.x + 20, this.y + 56, 24, 8);
    } else {
      // Walking/standing legs
      ctx.fillRect(this.x + 16 + legOffset, this.y + 56, 12, 8);
      ctx.fillRect(this.x + 36 - legOffset, this.y + 56, 12, 8);
    }
    
    // Hero boots
    ctx.fillStyle = '#8A2BE2'; // Blue violet
    if (isJumping) {
      ctx.fillRect(this.x + 20, this.y + 60, 24, 4);
    } else {
      ctx.fillRect(this.x + 16 + legOffset, this.y + 60, 12, 4);
      ctx.fillRect(this.x + 36 - legOffset, this.y + 60, 12, 4);
    }
    
    // Hero emblem
    ctx.fillStyle = '#FF1493'; // Deep pink - eye-catching
    ctx.shadowColor = '#FF1493';
    ctx.shadowBlur = 15;
    ctx.fillRect(this.x + 24, this.y + 32, 16, 12);
    ctx.shadowBlur = 0;
    
    // Magic sparkles around player
    if (this.health > 50) {
      ctx.fillStyle = '#FFD700'; // Gold sparkles
      ctx.globalAlpha = 0.7;
      for (let i = 0; i < 3; i++) {
        const offsetX = Math.sin(Date.now() * 0.01 + i) * 10;
        const offsetY = Math.cos(Date.now() * 0.01 + i) * 10;
        ctx.fillRect(this.x + 32 + offsetX, this.y + 32 + offsetY, 2, 2);
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
  }

  private renderHealthBar(ctx: CanvasRenderingContext2D): void {
    const barWidth = 60;
    const barHeight = 8;
    const barX = this.x - 4;
    const barY = this.y - 16;
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Health bar
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = healthPercent > 0.6 ? '#32CD32' : healthPercent > 0.3 ? '#FFD700' : '#FF4500';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    // Border
    ctx.strokeStyle = '#4169E1';
    ctx.lineWidth = 2;
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
