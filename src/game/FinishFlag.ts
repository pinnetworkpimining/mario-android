export class FinishFlag {
  public x: number;
  public y: number;
  private width: number = 40;
  private height: number = 80;
  private animationTimer: number = 0;
  private flagWave: number = 0;
  private collected: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public update(deltaTime: number): void {
    this.animationTimer += deltaTime;
    this.flagWave = Math.sin(this.animationTimer / 300) * 5;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.collected) return;

    const scale = Math.min(window.innerWidth / 1900, window.innerHeight / 900);
    const scaledWidth = this.width * Math.max(scale, 0.8);
    const scaledHeight = this.height * Math.max(scale, 0.8);

    ctx.save();

    // Flag pole
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(this.x + scaledWidth * 0.1, this.y, scaledWidth * 0.15, scaledHeight);

    // Flag
    ctx.fillStyle = '#FF0000';
    const flagWidth = scaledWidth * 0.7;
    const flagHeight = scaledHeight * 0.5;
    
    ctx.beginPath();
    ctx.moveTo(this.x + scaledWidth * 0.25, this.y + 5);
    ctx.lineTo(this.x + scaledWidth * 0.25 + flagWidth + this.flagWave, this.y + 5);
    ctx.lineTo(this.x + scaledWidth * 0.25 + flagWidth + this.flagWave, this.y + 5 + flagHeight);
    ctx.lineTo(this.x + scaledWidth * 0.25, this.y + 5 + flagHeight);
    ctx.closePath();
    ctx.fill();

    // Flag pattern
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(
            this.x + scaledWidth * 0.25 + (i * flagWidth / 3) + this.flagWave * 0.5,
            this.y + 5 + (j * flagHeight / 2),
            flagWidth / 3,
            flagHeight / 2
          );
        }
      }
    }

    // Glow effect
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10 * scale;
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(this.x + scaledWidth * 0.05, this.y - 3, scaledWidth * 0.25, 6);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  public getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  public collect(): void {
    this.collected = true;
  }

  public isCollected(): boolean {
    return this.collected;
  }
}