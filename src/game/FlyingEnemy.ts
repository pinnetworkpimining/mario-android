export class FlyingEnemy {
  public x: number;
  public y: number;
  private width: number = 32;
  private height: number = 32;
  private velocityX: number = 100; // Horizontal speed
  // private velocityY: number = 50; // Vertical oscillation speed (unused)
  private amplitude: number = 20; // Oscillation amplitude
  private baseY: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.baseY = y;
  }

  public update(deltaTime: number): void {
    const dt = deltaTime / 1000; // Convert to seconds

    // Move horizontally
    this.x += this.velocityX * dt;

    // Oscillate vertically
    this.y = this.baseY + Math.sin(Date.now() / 500) * this.amplitude;

    // Reverse direction if hitting screen edges (dynamic width)
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const maxWidth = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
    if (this.x < 0 || this.x + this.width > maxWidth) {
      this.velocityX *= -1;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    // Scale rendering for mobile devices
    const scale = Math.min(window.innerWidth / 1900, window.innerHeight / 900);
    const scaledWidth = this.width * Math.max(scale, 0.8);
    const scaledHeight = this.height * Math.max(scale, 0.8);
    
    // Draw flying enemy (simple red rectangle)
    ctx.fillStyle = '#FF0000'; // Red body
    ctx.fillRect(this.x, this.y, scaledWidth, scaledHeight);

    // Draw wings
    ctx.fillStyle = '#FFA500'; // Orange wings
    ctx.fillRect(this.x - 5 * scale, this.y + 10 * scale, 10 * scale, 5 * scale);
    ctx.fillRect(this.x + 27 * scale, this.y + 10 * scale, 10 * scale, 5 * scale);
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