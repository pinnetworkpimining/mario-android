import { InputSystem } from '../engine/InputSystem';
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

  public update(deltaTime: number, inputSystem: InputSystem): void {
    const dt = deltaTime;

    // Update invulnerability
    if (this.invulnerable) {
      this.invulnerabilityTimer -= deltaTime;
      if (this.invulnerabilityTimer <= 0) {
        this.invulnerable = false;
      }
    }

    // Handle horizontal movement
    this.isMoving = false;
    if (inputSystem.isKeyPressed('ArrowLeft') || inputSystem.isKeyPressed('KeyA')) {
      this.velocityX = -this.speed;
      this.facingRight = false;
      this.isMoving = true;
    } else if (inputSystem.isKeyPressed('ArrowRight') || inputSystem.isKeyPressed('KeyD')) {
      this.velocityX = this.speed;
      this.facingRight = true;
      this.isMoving = true;
    } else {
      this.velocityX *= 0.8; // Smooth deceleration
    }

    // Handle jumping
    if ((inputSystem.isKeyPressed('Space') || inputSystem.isKeyPressed('KeyW')) && this.onGround) {
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
    const breathingOffset = Math.sin(Date.now() * 0.003) * 1;
    
    // Enhanced character with better graphics and animations
    // Body (main torso)
    const bodyGradient = ctx.createLinearGradient(this.x + 12, this.y + 24, this.x + 52, this.y + 56);
    bodyGradient.addColorStop(0, '#4169E1');
    bodyGradient.addColorStop(0.5, '#6495ED');
    bodyGradient.addColorStop(1, '#4169E1');
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(this.x + 12, this.y + 24 + walkOffset + breathingOffset, 40, 32);
    
    // Head
    const headGradient = ctx.createRadialGradient(this.x + 32, this.y + 16, 5, this.x + 32, this.y + 16, 20);
    headGradient.addColorStop(0, '#FFD700');
    headGradient.addColorStop(0.7, '#FFA500');
    headGradient.addColorStop(1, '#FF8C00');
    ctx.fillStyle = headGradient;
    ctx.fillRect(this.x + 16, this.y + 4 + breathingOffset, 32, 24);
    
    // Hero helmet with gradient
    const helmetGradient = ctx.createLinearGradient(this.x + 12, this.y, this.x + 52, this.y + 12);
    helmetGradient.addColorStop(0, '#8B0000');
    helmetGradient.addColorStop(0.5, '#DC143C');
    helmetGradient.addColorStop(1, '#8B0000');
    ctx.fillStyle = helmetGradient;
    ctx.fillRect(this.x + 12, this.y + breathingOffset, 40, 12);
    
    // Hero visor with glow effect
    ctx.fillStyle = '#00BFFF'; // Deep sky blue
    ctx.shadowColor = '#00BFFF';
    ctx.shadowBlur = 15;
    ctx.fillRect(this.x + 16, this.y + 8 + breathingOffset, 32, 4);
    ctx.shadowBlur = 0;
    
    // Arms with gradient
    const armGradient = ctx.createLinearGradient(this.x + 4, this.y + 28, this.x + 16, this.y + 48);
    armGradient.addColorStop(0, '#32CD32');
    armGradient.addColorStop(1, '#228B22');
    ctx.fillStyle = armGradient;
    const armY = this.y + 28 + walkOffset + breathingOffset;
    ctx.fillRect(this.x + 4, armY, 12, 20); // Left arm
    ctx.fillRect(this.x + 48, armY, 12, 20); // Right arm
    
    // Legs with walking animation and gradient
    const legGradient = ctx.createLinearGradient(this.x + 16, this.y + 56, this.x + 48, this.y + 64);
    legGradient.addColorStop(0, '#FF6347');
    legGradient.addColorStop(1, '#CD5C5C');
    ctx.fillStyle = legGradient;
    const legOffset = this.isMoving && this.onGround ? Math.sin(this.animationFrame * Math.PI) * 6 : 0;
    if (isJumping) {
      // Jumping pose - legs together
      ctx.fillRect(this.x + 20, this.y + 56, 24, 8);
    } else {
      // Walking/standing legs
      ctx.fillRect(this.x + 16 + legOffset, this.y + 56, 12, 8);
      ctx.fillRect(this.x + 36 - legOffset, this.y + 56, 12, 8);
    }
    
    // Hero boots with shine effect
    const bootGradient = ctx.createLinearGradient(this.x + 16, this.y + 60, this.x + 48, this.y + 64);
    bootGradient.addColorStop(0, '#8A2BE2');
    bootGradient.addColorStop(0.5, '#9370DB');
    bootGradient.addColorStop(1, '#8A2BE2');
    ctx.fillStyle = bootGradient;
    if (isJumping) {
      ctx.fillRect(this.x + 20, this.y + 60, 24, 4);
    } else {
      ctx.fillRect(this.x + 16 + legOffset, this.y + 60, 12, 4);
      ctx.fillRect(this.x + 36 - legOffset, this.y + 60, 12, 4);
    }
    
    // Hero emblem with pulsing effect
    const emblemPulse = 1 + Math.sin(Date.now() * 0.01) * 0.2;
    ctx.fillStyle = '#FF1493';
    ctx.shadowColor = '#FF1493';
    ctx.shadowBlur = 15 * emblemPulse;
    ctx.save();
    ctx.translate(this.x + 32, this.y + 38 + walkOffset + breathingOffset);
    ctx.scale(emblemPulse, emblemPulse);
    ctx.fillRect(-8, -6, 16, 12);
    ctx.restore();
    ctx.shadowBlur = 0;
    
    // Enhanced magic sparkles around player
    if (this.health > 50) {
      for (let i = 0; i < 5; i++) {
        const time = Date.now() * 0.005;
        const offsetX = Math.sin(time + i * 1.2) * 15;
        const offsetY = Math.cos(time + i * 1.5) * 15;
        const sparkleAlpha = Math.sin(time * 2 + i) * 0.3 + 0.5;
        const sparkleSize = 2 + Math.sin(time * 3 + i) * 1;
        
        ctx.globalAlpha = sparkleAlpha;
        ctx.fillStyle = i % 2 === 0 ? '#FFD700' : '#00FFFF';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        
        ctx.beginPath();
        ctx.arc(this.x + 32 + offsetX, this.y + 32 + offsetY + walkOffset + breathingOffset, sparkleSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
    
    // Power-up aura when invulnerable
    if (this.invulnerable) {
      const auraAlpha = Math.sin(Date.now() * 0.02) * 0.3 + 0.4;
      ctx.globalAlpha = auraAlpha;
      ctx.strokeStyle = '#FFFF00';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#FFFF00';
      ctx.shadowBlur = 20;
      ctx.strokeRect(this.x - 5, this.y - 5 + breathingOffset, scaledWidth + 10, scaledHeight + 10);
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
