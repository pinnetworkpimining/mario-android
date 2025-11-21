import { Player } from './Player';
import { Turtle } from './Turtle';
import { Game } from './Game';
import { GameEngine } from '../engine/GameEngine';
import { BaseLevel } from './BaseLevel';
import { FinishFlag } from './FinishFlag';
import { PowerUp, PowerUpType } from './PowerUp';
import { ParticleSystem } from './ParticleSystem';

export class Level extends BaseLevel {
  protected platforms: any[] = [];
  protected turtles: Turtle[] = [];
  protected gameRunning: boolean = true;
  protected finishFlag: FinishFlag | null = null;
  protected powerUps: PowerUp[] = [];
  protected particleSystem: ParticleSystem;
  protected levelWidth: number = 2400;
  protected levelHeight: number = 600;
  protected player: Player | null = null;

  constructor() {
    super();
    this.levelWidth = 4000; // Extended level width
    this.levelHeight = typeof window !== 'undefined' ? window.innerHeight : 900;
    this.particleSystem = new ParticleSystem();

    this.createLevel();
    this.spawnTurtles();
    this.spawnPowerUps();
    this.spawnFinishFlag();
  }

  public setPlayer(player: Player): void {
    this.player = player;
    player.setParticleSystem(this.particleSystem);
    player.setAudioSystem(GameEngine.getInstance().getAudioSystem());
  }

  protected createLevel(): void {
    const width = this.levelWidth;
    const height = this.levelHeight;
    const groundHeight = Math.round(height * 0.15);
    const groundY = height - groundHeight;

    // Ground segments with gaps
    this.platforms.push({ x: 0, y: groundY, width: width * 0.2, height: groundHeight });
    this.platforms.push({ x: width * 0.25, y: groundY, width: width * 0.3, height: groundHeight });
    this.platforms.push({ x: width * 0.6, y: groundY, width: width * 0.4, height: groundHeight });

    // Elevated platforms
    this.platforms.push({ x: width * 0.1, y: height * 0.65, width: width * 0.1, height: 20 });
    this.platforms.push({ x: width * 0.3, y: height * 0.5, width: width * 0.1, height: 20 });
    this.platforms.push({ x: width * 0.5, y: height * 0.4, width: width * 0.1, height: 20 });
    this.platforms.push({ x: width * 0.7, y: height * 0.55, width: width * 0.1, height: 20 });

    // Pipes (vertical obstacles)
    this.platforms.push({ x: width * 0.4, y: groundY - 60, width: 40, height: 60 });
    this.platforms.push({ x: width * 0.8, y: groundY - 90, width: 40, height: 90 });
  }

  protected spawnTurtles(): void {
    const width = this.levelWidth;
    const height = this.levelHeight;
    const groundY = height - Math.round(height * 0.15);

    // Spawn turtles on ground and platforms
    this.turtles.push(new Turtle(width * 0.3, groundY - 40));
    this.turtles.push(new Turtle(width * 0.7, groundY - 40));
    this.turtles.push(new Turtle(width * 0.5, height * 0.4 - 40));
  }

  protected spawnPowerUps(): void {
    const width = this.levelWidth;
    const height = this.levelHeight;

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
    const width = this.levelWidth;
    const height = this.levelHeight;
    const groundY = height - Math.round(height * 0.15);

    // Place finish flag at the end of the level
    this.finishFlag = new FinishFlag(width * 0.95, groundY - 60);
  }

  public update(deltaTime: number): void {
    if (!this.gameRunning) return;

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
    this.platforms.forEach((platform) => {
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

    for (let x = 0; x < this.levelWidth; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, window.innerHeight);
      ctx.stroke();
    }

    for (let y = 0; y < window.innerHeight; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.levelWidth, y);
      ctx.stroke();
    }
  }

  private renderGround(ctx: CanvasRenderingContext2D, platform: any): void {
    const gradient = ctx.createLinearGradient(0, platform.y, 0, window.innerHeight);
    gradient.addColorStop(0, '#00ffff');
    gradient.addColorStop(0.3, '#0066cc');
    gradient.addColorStop(1, '#1a1a2e');

    ctx.fillStyle = gradient;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

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
    ctx.fillStyle = '#0f3460';
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);

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
        const overlapX = Math.min(
          playerBounds.x + playerBounds.width - platform.x,
          platform.x + platform.width - playerBounds.x
        );
        const overlapY = Math.min(
          playerBounds.y + playerBounds.height - platform.y,
          platform.y + platform.height - playerBounds.y
        );

        if (overlapX < overlapY) {
          if (playerBounds.x < platform.x) {
            player.x = platform.x - playerBounds.width;
          } else {
            player.x = platform.x + platform.width;
          }
          player.setVelocityX(0);
        } else {
          if (playerBounds.y < platform.y) {
            player.y = platform.y - playerBounds.height;
            player.setVelocityY(0);
            player.setOnGround(true);
            onGround = true;

            // Landing impact effect
            if (this.particleSystem && player.getVelocityY() > 300) {
              this.particleSystem.addLandingImpact(player.x + playerBounds.width / 2, player.y + playerBounds.height);
            }
          } else {
            player.y = platform.y + platform.height;
            player.setVelocityY(0);
          }
        }
      }
    });

    // Turtle collisions
    this.turtles = this.turtles.filter(turtle => {
      if (turtle.isDefeated()) return false;

      const turtleBounds = turtle.getBounds();
      if (
        playerBounds.x < turtleBounds.x + turtleBounds.width &&
        playerBounds.x + playerBounds.width > turtleBounds.x &&
        playerBounds.y < turtleBounds.y + turtleBounds.height &&
        playerBounds.y + playerBounds.height > turtleBounds.y
      ) {
        if (player.getVelocityY() > 0 && playerBounds.y + playerBounds.height <= turtleBounds.y + 10) {
          // Player defeats turtle by jumping on it
          turtle.takeDamage();
          player.setVelocityY(-200);
          GameEngine.getInstance().getScreenShake().shake(5, 200);
          this.particleSystem.addExplosion(turtleBounds.x + turtleBounds.width / 2, turtleBounds.y + turtleBounds.height / 2, '#FFD700');
        } else {
          // Player takes damage
          player.takeDamage();
          GameEngine.getInstance().getScreenShake().shake(10, 300);
        }
      }

      return true;
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
        powerUp.collect(player);
        this.particleSystem.addPowerUpEffect(powerUpBounds.x + powerUpBounds.width / 2, powerUpBounds.y + powerUpBounds.height / 2);
        return false;
      }

      return true;
    });

    // Finish flag collision
    if (this.finishFlag) {
      const flagBounds = this.finishFlag.getBounds();
      if (
        playerBounds.x < flagBounds.x + flagBounds.width &&
        playerBounds.x + playerBounds.width > flagBounds.x &&
        playerBounds.y < flagBounds.y + flagBounds.height &&
        playerBounds.y + playerBounds.height > flagBounds.y
      ) {
        this.showLevelCompleteMessage();
      }
    }

    // Check if player fell off the map
    if (player.y > this.levelHeight + 100) {
      player.takeDamage();
      player.setPosition(100, 100);
    }
  }

  protected showGameOverMessage(): void {
    const message = document.createElement('div');
    message.className = 'game-message';
    message.innerHTML = `
      <div style="font-size: 8vh; margin-bottom: 3vh;">💀 GAME OVER 💀</div>
      <div style="font-size: 4vh;">Better luck next time!</div>
    `;
    document.body.appendChild(message);
  }

  protected showVictoryMessage(): void {
    const message = document.createElement('div');
    message.className = 'game-message';
    message.innerHTML = `
      <div style="font-size: 8vh; margin-bottom: 3vh;">🎉 VICTORY! 🎉</div>
      <div style="font-size: 4vh;">You completed the level!</div>
    `;
    document.body.appendChild(message);
  }

  protected showLevelCompleteMessage(): void {
    const message = document.createElement('div');
    message.className = 'game-message';
    message.innerHTML = `
      <div style="font-size: 8vh; margin-bottom: 3vh;">✨ LEVEL COMPLETE! ✨</div>
      <div style="font-size: 4vh;">Proceeding to next level...</div>
    `;
    document.body.appendChild(message);
    setTimeout(() => this.hideMessage(), 2000);
  }

  protected hideMessage(): void {
    const messages = document.querySelectorAll('.game-message');
    messages.forEach(msg => msg.remove());
  }
}