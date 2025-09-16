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

    // Keep player on screen
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > 800) this.x = 800 - this.width;

    // Reset ground state
    this.onGround = false;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    // Draw Mario-like character (simple colored rectangle)
    ctx.fillStyle = '#FF0000'; // Red body
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw face
    ctx.fillStyle = '#FFE4B5'; // Skin color
    ctx.fillRect(this.x + 4, this.y + 4, 24, 16);
    
    // Draw eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(this.x + 8, this.y + 8, 4, 4);
    ctx.fillRect(this.x + 20, this.y + 8, 4, 4);
    
    // Draw mustache
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(this.x + 10, this.y + 12, 12, 4);
    
    // Draw hat
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(this.x + 2, this.y, 28, 8);
    
    // Draw overalls
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(this.x + 6, this.y + 20, 20, 12);
    
    // Draw buttons
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(this.x + 10, this.y + 22, 4, 4);
    ctx.fillRect(this.x + 18, this.y + 22, 4, 4);
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
}
