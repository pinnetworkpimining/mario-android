import { InputManager } from './InputManager';

export class Player {
  public x: number;
  public y: number;
  private width: number = 32;
  private height: number = 32;
  private velocityX: number = 0;
  private velocityY: number = 0;
  private speed: number = 200;
  private jumpPower: number = 400;
  private gravity: number = 800;
  private onGround: boolean = false;
  private lives: number = 3;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public update(deltaTime: number, inputManager: InputManager): void {
    const dt = deltaTime / 1000; // Convert to seconds

    // Handle horizontal movement
    if (inputManager.isKeyPressed('ArrowLeft')) {
      this.velocityX = -this.speed;
    } else if (inputManager.isKeyPressed('ArrowRight')) {
      this.velocityX = this.speed;
    } else {
      this.velocityX = 0;
    }

    // Handle jumping
    if (inputManager.isKeyPressed('Space') && this.onGround) {
      this.velocityY = -this.jumpPower;
      this.onGround = false;
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

    // Reset ground state
    this.onGround = false;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    // Scale rendering for mobile devices
    const scale = Math.min(window.innerWidth / 1900, window.innerHeight / 900);
    const scaledWidth = this.width * Math.max(scale, 0.8);
    const scaledHeight = this.height * Math.max(scale, 0.8);
    
    // Draw Mario-like character (simple colored rectangle)
    ctx.fillStyle = '#FF0000'; // Red body
    ctx.fillRect(this.x, this.y, scaledWidth, scaledHeight);
    
    // Draw face
    ctx.fillStyle = '#FFE4B5'; // Skin color
    ctx.fillRect(this.x + 4 * scale, this.y + 4 * scale, 24 * scale, 16 * scale);
    
    // Draw eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(this.x + 8 * scale, this.y + 8 * scale, 4 * scale, 4 * scale);
    ctx.fillRect(this.x + 20 * scale, this.y + 8 * scale, 4 * scale, 4 * scale);
    
    // Draw mustache
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(this.x + 10 * scale, this.y + 12 * scale, 12 * scale, 4 * scale);
    
    // Draw hat
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(this.x + 2 * scale, this.y, 28 * scale, 8 * scale);
    
    // Draw overalls
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(this.x + 6 * scale, this.y + 20 * scale, 20 * scale, 12 * scale);
    
    // Draw buttons
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(this.x + 10 * scale, this.y + 22 * scale, 4 * scale, 4 * scale);
    ctx.fillRect(this.x + 18 * scale, this.y + 22 * scale, 4 * scale, 4 * scale);
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
    this.lives -= 1;
  }

  public getLives(): number {
    return this.lives;
  }
}
