import { Player } from './Player';
import { Turtle } from './Turtle';
import { Game } from './Game';
import { BaseLevel } from './BaseLevel';
import { FinishFlag } from './FinishFlag';
import { PowerUp, PowerUpType } from './PowerUp';
import { ParticleSystem } from './ParticleSystem';

export class Level extends BaseLevel {
  protected platforms: Array<{ x: number, y: number, width: number, height: number }> = [];
  protected turtles: Turtle[] = [];
  protected gameRunning: boolean = true;
  protected finishFlag: FinishFlag | null = null;
  protected powerUps: PowerUp[] = [];
  protected particleSystem: ParticleSystem = new ParticleSystem();
  protected levelWidth: number = 0;
  protected levelHeight: number = 0;
  protected player: Player | null = null;

  constructor() {
    super();
    this.createLevel();
    this.spawnTurtles();
    this.spawnPowerUps();
    this.spawnFinishFlag();
  }

  public setPlayer(player: Player): void {
    this.player = player;
  }

  protected createLevel(): void {
    // Mobile landscape optimized level
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.levelWidth = width * 4; // Shorter for better pacing
    this.levelHeight = height;

    // Ground platform - mobile optimized with gaps
    const groundHeight = Math.round(height * 0.15); // Thicker ground for mobile

    // Segment 1: Start area
    this.platforms.push({ x: 0, y: height - groundHeight, width: width * 0.8, height: groundHeight });

    // Gap 1 (width * 0.2)

    // Segment 2: After first gap
    this.platforms.push({ x: width * 1.0, y: height - groundHeight, width: width * 0.5, height: groundHeight });

    // Gap 2 (width * 0.2)

    // Segment 3: Middle section
    this.platforms.push({ x: width * 1.7, y: height - groundHeight, width: width * 0.8, height: groundHeight });

    // Segment 4: End section
    this.platforms.push({ x: width * 2.8, y: height - groundHeight, width: width * 1.2, height: groundHeight });

    // Mobile-friendly platform spacing
    const platformHeight = Math.max(30, height * 0.04); // Bigger platforms for mobile

    // First section - easy jumps
    this.platforms.push({ x: width * 0.3, y: height * 0.7, width: width * 0.15, height: platformHeight });
    this.platforms.push({ x: width * 0.6, y: height * 0.6, width: width * 0.15, height: platformHeight });
    this.platforms.push({ x: width * 0.9, y: height * 0.5, width: width * 0.15, height: platformHeight }); // Bridge over gap

    // Second section - medium difficulty
    this.platforms.push({ x: width * 1.3, y: height * 0.65, width: width * 0.12, height: platformHeight });
    this.platforms.push({ x: width * 1.6, y: height * 0.55, width: width * 0.12, height: platformHeight }); // Bridge over gap

    // Vertical obstacles (Pipes)
    const pipeWidth = width * 0.05;
    const pipeHeight1 = height * 0.2;
    const pipeHeight2 = height * 0.3;

    this.platforms.push({ x: width * 0.5, y: height - groundHeight - pipeHeight1, width: pipeWidth, height: pipeHeight1 });
    this.platforms.push({ x: width * 2.0, y: height - groundHeight - pipeHeight2, width: pipeWidth, height: pipeHeight2 });
    this.platforms.push({ x: width * 3.0, y: height - groundHeight - pipeHeight1, width: pipeWidth, height: pipeHeight1 });

    // Third section - getting harder
    this.platforms.push({ x: width * 2.3, y: height * 0.6, width: width * 0.12, height: platformHeight });
    this.platforms.push({ x: width * 2.7, y: height * 0.5, width: width * 0.12, height: platformHeight });

    // Final section leading to flag  
    this.platforms.push({ x: width * 3.2, y: height * 0.4, width: width * 0.20, height: platformHeight });
  }

  protected spawnTurtles(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const groundHeight = Math.round(height * 0.15);
    const groundY = height - groundHeight - 64; // 64 = turtle height for mobile

    // Fewer but better positioned enemies for mobile
    this.turtles.push(new Turtle(width * 0.5, groundY));
    this.turtles.push(new Turtle(width * 1.2, groundY));
    this.turtles.push(new Turtle(width * 2.1, groundY));
    this.turtles.push(new Turtle(width * 3.2, groundY));
    this.turtles.push(new Turtle(width * 3.8, groundY));
  }

  protected spawnPowerUps(): void {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
    const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;

    // Place power-ups on platforms and around the level
    this.powerUps.push(new PowerUp(width * 0.15, height * 0.60, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 0.5, height * 0.35, PowerUpType.SPEED));
    this.powerUps.push(new PowerUp(width * 1.25, height * 0.55, PowerUpType.JUMP));
    this.powerUps.push(new PowerUp(width * 1.65, height * 0.25, PowerUpType.SHIELD));
    this.powerUps.push(new PowerUp(width * 2.15, height * 0.50, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 2.55, height * 0.20, PowerUpType.SPEED));
    this.powerUps.push(new PowerUp(width * 3.1, height * 0.45, PowerUpType.HEALTH));
  }

  protected spawnFinishFlag(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const groundY = height - Math.round(height * 0.15);

    // Place finish flag at the end of the level - mobile optimized
    this.finishFlag = new FinishFlag(width * 3.8, groundY - 60);
  }

  public update(deltaTime: number): void {
    if (!this.gameRunning) return; // Skip update if game is not running

    this.turtles.forEach(turtle => turtle.update(deltaTime));
    this.powerUps.forEach(powerUp => powerUp.update(deltaTime));
    this.particleSystem.update(deltaTime);

    if (this.finishFlag) {
      this.finishFlag.update(deltaTime);
    }
  }

  public getLevelWidth(): number {
    return this.levelWidth;
  }

  public getLevelHeight(): number {
    return this.levelHeight;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    // Cyber-themed background
    const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.levelWidth, window.innerHeight);

    // Draw cyber grid background
    this.renderCyberGrid(ctx);

    // Draw platforms
    this.platforms.forEach((platform, idx) => {
      // Check if it's a ground segment or pipe
      const groundHeight = Math.round(window.innerHeight * 0.15);
      if (platform.y >= window.innerHeight - groundHeight) {
        this.renderGround(ctx, platform);
      } else {
        this.renderPlatform(ctx, platform);
      }
    });

    // Draw turtles
    this.turtles.forEach(turtle => turtle.render(ctx));

    // Draw power-ups
    this.powerUps.forEach(powerUp => powerUp.render(ctx));

    // Draw finish flag
    if (this.finishFlag) {
      this.finishFlag.render(ctx);
    }

    // Draw particles
    this.particleSystem.render(ctx);
  }

  private renderCyberGrid(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x < this.levelWidth; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, window.innerHeight);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < window.innerHeight; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.levelWidth, y);
      ctx.stroke();
    }
  }

  private renderGround(ctx: CanvasRenderingContext2D, platform: any): void {
    // Cyber ground
    const gradient = ctx.createLinearGradient(0, platform.y, 0, window.innerHeight);
    gradient.addColorStop(0, '#00ffff');
    gradient.addColorStop(0.3, '#0066cc');
    gradient.addColorStop(1, '#1a1a2e');

    ctx.fillStyle = gradient;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    // Add cyber energy lines
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    for (let i = platform.x; i < platform.x + platform.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, platform.y);
      ctx.lineTo(i, platform.y - 10);
      ctx.stroke();
    }
  }

  private renderPlatform(ctx: CanvasRenderingContext2D, platform: any): void {
    // Cyber platform
    ctx.fillStyle = '#0f3460';
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    // Neon border
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);

    // Glow effect
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.fillRect(platform.x, platform.y, platform.width, 5);
    ctx.shadowBlur = 0;
  }

  public checkCollisions(player: Player): void {
    // Platform collisions
    let onGround = false;
    const playerBounds = player.getBounds();

    this.platforms.forEach(platform => {
      if (
        playerBounds.x < platform.x + platform.width &&
        playerBounds.x + playerBounds.width > platform.x &&
        playerBounds.y < platform.y + platform.height &&
        playerBounds.y + playerBounds.height > platform.y
      ) {
        // Collision detected
        const overlapX = Math.min(
          playerBounds.x + playerBounds.width - platform.x,
          platform.x + platform.width - playerBounds.x
        );
        const overlapY = Math.min(
          playerBounds.y + playerBounds.height - platform.y,
          platform.y + platform.height - playerBounds.y
        );

        if (overlapX < overlapY) {
          // Horizontal collision
          if (playerBounds.x < platform.x) {
            player.x = platform.x - playerBounds.width;
          } else {
            player.x = platform.x + platform.width;
          }
          player.setVelocityX(0);
        } else {
          // Vertical collision
          if (playerBounds.y < platform.y) {
            player.y = platform.y - playerBounds.height;
            player.setVelocityY(0);
            player.setOnGround(true);
            onGround = true;
          } else {
            player.y = platform.y + platform.height;
            player.setVelocityY(0);
          }
        }
      }
    });

    if (!onGround) {
      player.setOnGround(false);
    }

    // Turtle collisions
    this.turtles.forEach(turtle => {
      if (turtle.isDefeated()) return;

      const turtleBounds = turtle.getBounds();
      if (
        playerBounds.x < turtleBounds.x + turtleBounds.width &&
        playerBounds.x + playerBounds.width > turtleBounds.x &&
        playerBounds.y < turtleBounds.y + turtleBounds.height &&
        playerBounds.y + playerBounds.height > turtleBounds.y
      ) {
        if (player.getVelocityY() > 0 && playerBounds.y + playerBounds.height <= turtleBounds.y + 10) {
          // Player jumped on turtle
          turtle.takeDamage();
          player.setVelocityY(-200); // Bounce
          this.particleSystem.addExplosion(turtleBounds.x + turtleBounds.width / 2, turtleBounds.y + turtleBounds.height / 2, '#00ff00');
        } else {
          // Player hit turtle
          player.loseLife();
        }
      }
    });

    // Power-up collisions
    this.powerUps = this.powerUps.filter(powerUp => {
      if (powerUp.isCollected()) return false;

      const powerUpBounds = powerUp.getBounds();
      if (
        playerBounds.x < powerUpBounds.x + powerUpBounds.width &&
        playerBounds.x + playerBounds.width > powerUpBounds.x &&
        playerBounds.y < powerUpBounds.y + powerUpBounds.height &&
        playerBounds.y + playerBounds.height > powerUpBounds.y
      ) {
        powerUp.collect();
        this.particleSystem.addExplosion(powerUpBounds.x + powerUpBounds.width / 2, powerUpBounds.y + powerUpBounds.height / 2, '#ffff00');
        return false;
      }
      return true;
    });

    // Finish flag collision
    if (this.finishFlag && !this.finishFlag.isCollected()) {
      const flagBounds = this.finishFlag.getBounds();
      if (
        playerBounds.x < flagBounds.x + flagBounds.width &&
        playerBounds.x + playerBounds.width > flagBounds.x &&
        playerBounds.y < flagBounds.y + flagBounds.height &&
        playerBounds.y + playerBounds.height > flagBounds.y
      ) {
        this.finishFlag.collect();
        this.endGame(true);
      }
    }

    // Level boundary check
    if (player.y > this.levelHeight) {
      player.loseLife();
    }
  }

  public endGame(won: boolean): void {
    this.gameRunning = false;
    // Override in subclasses
  }

  protected showGameOverMessage(): void {
    this.showMessage('GAME OVER', '#FF0000');
  }

  protected showVictoryMessage(): void {
    this.showMessage('VICTORY!', '#00FF00');
  }

  protected showLevelCompleteMessage(text: string): void {
    this.showMessage(text, '#00FF00');
  }

  protected hideMessage(): void {
    const message = document.getElementById('game-message');
    if (message) {
      message.remove();
    }
  }

  private showMessage(text: string, color: string): void {
    let message = document.getElementById('game-message');
    if (!message) {
      message = document.createElement('div');
      message.id = 'game-message';
      message.style.position = 'fixed';
      message.style.top = '50%';
      message.style.left = '50%';
      message.style.transform = 'translate(-50%, -50%)';
      message.style.color = color;
      message.style.fontSize = '48px';
      message.style.fontWeight = 'bold';
      message.style.textShadow = '2px 2px 4px #000000';
      message.style.zIndex = '1000';
      document.body.appendChild(message);
    }
    message.textContent = text;
    message.style.color = color;
  }
}