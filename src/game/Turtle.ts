// import { InputManager } from './InputManager';

export class Turtle {
  public x: number;
  public y: number;
  private width: number = 32;
  private height: number = 32;
  private velocityX: number = -50; // Default movement speed
  // private onGround: boolean = true; // Unused
  private animationFrame: number = 0;
  private animationTimer: number = 0;
  private animationInterval: number = 200; // Milliseconds per frame

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public update(deltaTime: number): void {
    const dt = deltaTime / 1000; // Convert to seconds

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
      this.animationFrame = (this.animationFrame + 1) % 2; // Toggle between 0 and 1
      this.animationTimer = 0;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    // Scale rendering for mobile devices
    const scale = Math.min(window.innerWidth / 1900, window.innerHeight / 900);
    const scaledWidth = this.width * Math.max(scale, 0.8);
    const scaledHeight = this.height * Math.max(scale, 0.8);
    
    // Draw turtle with animation
    ctx.fillStyle = this.animationFrame === 0 ? '#008000' : '#006400'; // Alternate green shades
    ctx.fillRect(this.x, this.y, scaledWidth, scaledHeight);

    // Draw shell
    ctx.fillStyle = '#654321'; // Brown shell
    ctx.fillRect(this.x + 4 * scale, this.y + 8 * scale, 24 * scale, 16 * scale);
  }

  public isDefeated(): boolean {
    // Placeholder for defeat logic
    return false;
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