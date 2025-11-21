export class FlyingEnemy {
  public x: number;
  public y: number;
  public width: number = 32;
  public height: number = 32;
  private velocityX: number = 120;
  private amplitude: number = 30;
  private baseY: number;
  private animationFrame: number = 0;
  private animationTimer: number = 0;
  private health: number = 1;
  private isDying: boolean = false;
  private deathTimer: number = 0;
  private attackMode: boolean = false;
  private attackCooldown: number = 0;
  private patrolDistance: number = 0;
  private maxPatrolDistance: number = 300;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.baseY = y;
  }

  public update(deltaTime: number): void {
    if (this.isDying) {
      this.deathTimer -= deltaTime;
      this.y += 100 * (deltaTime / 1000); // Fall when dying
      return;
    }

    const dt = deltaTime / 1000; // Convert to seconds

    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }

    // Move horizontally with patrol logic
    this.x += this.velocityX * dt;
    this.patrolDistance += Math.abs(this.velocityX * dt);

    if (this.patrolDistance >= this.maxPatrolDistance) {
      this.velocityX *= -1;
      this.patrolDistance = 0;
    }

    // Oscillate vertically with more complex pattern
    const time = Date.now() / 1000;
    this.y = this.baseY + Math.sin(time * 2) * this.amplitude + Math.cos(time * 3) * (this.amplitude * 0.3);

    // Update wing animation
    this.animationTimer += deltaTime;
    if (this.animationTimer >= 100) { // Fast wing flapping
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
      ctx.translate(this.x + scaledWidth / 2, this.y + scaledHeight / 2);
      ctx.rotate((1000 - this.deathTimer) * 0.02);
      ctx.translate(-scaledWidth / 2, -scaledHeight / 2);
    }

    this.renderAdvancedEnemy(ctx, scale, scaledWidth, scaledHeight);

    ctx.restore();
  }

  private renderAdvancedEnemy(ctx: CanvasRenderingContext2D, scale: number, scaledWidth: number, scaledHeight: number): void {
    const wingFlap = Math.sin(this.animationFrame * Math.PI / 2) * 3 * scale;

    // Main body (robotic/alien design)
    ctx.fillStyle = '#8B008B'; // Dark magenta
    ctx.fillRect(this.x + 8 * scale, this.y + 8 * scale, 16 * scale, 16 * scale);

    // Core/cockpit
    ctx.fillStyle = '#FF1493'; // Deep pink
    ctx.fillRect(this.x + 10 * scale, this.y + 10 * scale, 12 * scale, 12 * scale);

    // Energy core
    ctx.fillStyle = '#00FFFF'; // Cyan glow
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 8 * scale;
    ctx.fillRect(this.x + 14 * scale, this.y + 14 * scale, 4 * scale, 4 * scale);
    ctx.shadowBlur = 0;

    // Wings with flapping animation
    ctx.fillStyle = '#4B0082'; // Indigo wings
    // Left wing
    ctx.fillRect(this.x + 2 * scale, this.y + 12 * scale - wingFlap, 8 * scale, 8 * scale);
    // Right wing
    ctx.fillRect(this.x + 22 * scale, this.y + 12 * scale - wingFlap, 8 * scale, 8 * scale);

    // Wing details
    ctx.fillStyle = '#9370DB'; // Medium slate blue
    ctx.fillRect(this.x + 4 * scale, this.y + 14 * scale - wingFlap, 4 * scale, 4 * scale);
    ctx.fillRect(this.x + 24 * scale, this.y + 14 * scale - wingFlap, 4 * scale, 4 * scale);

    // Propulsion trails
    if (Math.abs(this.velocityX) > 0) {
      ctx.fillStyle = '#FF4500'; // Orange red
      ctx.globalAlpha = 0.7;
      const trailLength = 6 * scale;
      const trailX = this.velocityX > 0 ? this.x - trailLength : this.x + scaledWidth;
      ctx.fillRect(trailX, this.y + 14 * scale, trailLength, 4 * scale);
      ctx.globalAlpha = 1;
    }

    // Attack mode indicator
    if (this.attackMode) {
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2 * scale;
      ctx.strokeRect(this.x + 6 * scale, this.y + 6 * scale, 20 * scale, 20 * scale);
    }
  }

  public takeDamage(): boolean {
    this.health--;
    if (this.health <= 0) {
      this.isDying = true;
      this.deathTimer = 1000;
      return true;
    }
    return false;
  }

  public isDefeated(): boolean {
    return this.isDying && this.deathTimer <= 0;
  }

  public setAttackMode(active: boolean): void {
    this.attackMode = active;
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