export class BossMonster {
  public x: number;
  public y: number;
  private width: number = 128;
  private height: number = 128;
  private velocityX: number = -60;
  private health: number = 10;
  private maxHealth: number = 10;
  private animationFrame: number = 0;
  private animationTimer: number = 0;
  private attackTimer: number = 0;
  private attackCooldown: number = 2000;
  private isAttacking: boolean = false;
  private defeated: boolean = false;
  private deathTimer: number = 0;
  private minX: number;
  private maxX: number;

  constructor(x: number, y: number, minX: number, maxX: number) {
    this.x = x;
    this.y = y;
    this.minX = minX;
    this.maxX = maxX;
  }

  public update(deltaTime: number): void {
    if (this.defeated) {
      this.deathTimer -= deltaTime;
      return;
    }

    const dt = deltaTime / 1000;

    // Move horizontally (patrol behavior)
    this.x += this.velocityX * dt;

    // Reverse direction at boundaries
    if (this.x < this.minX || this.x + this.width > this.maxX) {
      this.velocityX *= -1;
    }

    // Update attack timer
    this.attackTimer += deltaTime;
    if (this.attackTimer >= this.attackCooldown) {
      this.isAttacking = true;
      this.attackTimer = 0;
      setTimeout(() => {
        this.isAttacking = false;
      }, 500);
    }

    // Update animation
    this.animationTimer += deltaTime;
    if (this.animationTimer >= 200) {
      this.animationFrame = (this.animationFrame + 1) % 4;
      this.animationTimer = 0;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.defeated && this.deathTimer <= 0) return;

    ctx.save();

    if (this.defeated) {
      ctx.globalAlpha = Math.max(0, this.deathTimer / 2000);
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate((2000 - this.deathTimer) * 0.005);
      ctx.translate(-this.width / 2, -this.height / 2);
    }

    this.renderBoss(ctx);
    ctx.restore();

    // Render health bar
    this.renderHealthBar(ctx);
  }

  private renderBoss(ctx: CanvasRenderingContext2D): void {
    const walkOffset = Math.sin(this.animationFrame * Math.PI / 2) * 4;

    // Main body - large and intimidating
    ctx.fillStyle = '#ff0000'; // Red boss
    ctx.fillRect(this.x + 16, this.y + 32 + walkOffset, 96, 64);

    // Boss head
    ctx.fillStyle = '#8b0000'; // Dark red
    ctx.fillRect(this.x + 24, this.y + 8, 80, 48);

    // Glowing eyes
    ctx.fillStyle = '#ffff00';
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 15;
    ctx.fillRect(this.x + 32, this.y + 20, 12, 12);
    ctx.fillRect(this.x + 84, this.y + 20, 12, 12);
    ctx.shadowBlur = 0;

    // Spikes on back
    ctx.fillStyle = '#ff4500';
    for (let i = 0; i < 5; i++) {
      const spikeX = this.x + 24 + i * 16;
      const spikeY = this.y + 32 + walkOffset;
      ctx.beginPath();
      ctx.moveTo(spikeX, spikeY);
      ctx.lineTo(spikeX + 8, spikeY - 16);
      ctx.lineTo(spikeX + 16, spikeY);
      ctx.fill();
    }

    // Arms
    ctx.fillStyle = '#ff0000';
    const armY = this.y + 40 + walkOffset;
    ctx.fillRect(this.x, armY, 20, 32); // Left arm
    ctx.fillRect(this.x + 108, armY, 20, 32); // Right arm

    // Claws
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.x - 4, armY + 28, 8, 12);
    ctx.fillRect(this.x + 124, armY + 28, 8, 12);

    // Legs
    ctx.fillStyle = '#8b0000';
    const legOffset = Math.sin(this.animationFrame * Math.PI) * 6;
    ctx.fillRect(this.x + 24 + legOffset, this.y + 96, 24, 32);
    ctx.fillRect(this.x + 80 - legOffset, this.y + 96, 24, 32);

    // Attack effect
    if (this.isAttacking) {
      ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
      ctx.shadowColor = '#ffff00';
      ctx.shadowBlur = 20;
      ctx.fillRect(this.x - 10, this.y - 10, this.width + 20, this.height + 20);
      ctx.shadowBlur = 0;
    }

    // Energy aura
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 10;
    ctx.strokeRect(this.x + 8, this.y + 8, this.width - 16, this.height - 16);
    ctx.shadowBlur = 0;
  }

  private renderHealthBar(ctx: CanvasRenderingContext2D): void {
    const barWidth = 120;
    const barHeight = 12;
    const barX = this.x + (this.width - barWidth) / 2;
    const barY = this.y - 20;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Health bar
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? '#ff0000' : '#ff4500';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // Boss label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BOSS', this.x + this.width / 2, barY - 5);
  }

  public takeDamage(): void {
    this.health--;
    if (this.health <= 0) {
      this.defeated = true;
      this.deathTimer = 2000;
    }
  }

  public isDefeated(): boolean {
    return this.defeated && this.deathTimer <= 0;
  }

  public getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}