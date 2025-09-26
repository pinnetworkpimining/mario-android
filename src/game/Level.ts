import { Player } from './Player';
import { Turtle } from './Turtle';
import { Game } from './Game';
import { BaseLevel } from './BaseLevel';
import { FinishFlag } from './FinishFlag';
import { PowerUp, PowerUpType } from './PowerUp';
import { ParticleSystem } from './ParticleSystem';

export class Level extends BaseLevel {
  protected platforms: Array<{x: number, y: number, width: number, height: number}> = []; // Changed from private to protected
  protected turtles: Turtle[] = [];
  protected gameRunning: boolean = true; // Flag to control game loop
  protected finishFlag: FinishFlag | null = null;
  protected powerUps: PowerUp[] = [];
  protected particleSystem: ParticleSystem = new ParticleSystem();
  protected levelWidth: number = 0;
  protected levelHeight: number = 0;

  constructor() {
    super();
    this.createLevel();
    this.spawnTurtles();
    this.spawnPowerUps();
    this.spawnFinishFlag();
  }

  protected createLevel(): void {
    // Mobile landscape optimized level
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.levelWidth = width * 6; // 6 times wider for mobile scrolling
    this.levelHeight = height;
    
    // Ground platform - mobile optimized
    const groundHeight = Math.round(height * 0.15); // Thicker ground for mobile
    this.platforms.push({ x: 0, y: height - groundHeight, width: this.levelWidth, height: groundHeight });

    // Mobile-friendly platform spacing
    const platformHeight = Math.max(30, height * 0.04); // Bigger platforms for mobile
    const jumpDistance = width * 0.15; // Reasonable jump distance
    
    // First section - easy jumps
    this.platforms.push({ x: width * 0.2, y: height * 0.7, width: width * 0.12, height: platformHeight });
    this.platforms.push({ x: width * 0.4, y: height * 0.6, width: width * 0.12, height: platformHeight });
    this.platforms.push({ x: width * 0.6, y: height * 0.5, width: width * 0.12, height: platformHeight });
    
    // Second section - medium difficulty
    this.platforms.push({ x: width * 1.0, y: height * 0.65, width: width * 0.10, height: platformHeight });
    this.platforms.push({ x: width * 1.3, y: height * 0.55, width: width * 0.10, height: platformHeight });
    this.platforms.push({ x: width * 1.6, y: height * 0.45, width: width * 0.10, height: platformHeight });
    
    // Third section - getting harder
    this.platforms.push({ x: width * 2.0, y: height * 0.6, width: width * 0.09, height: platformHeight });
    this.platforms.push({ x: width * 2.3, y: height * 0.5, width: width * 0.09, height: platformHeight });
    this.platforms.push({ x: width * 2.6, y: height * 0.4, width: width * 0.09, height: platformHeight });
    
    // More sections for longer level
    this.platforms.push({ x: width * 3.0, y: height * 0.55, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 3.3, y: height * 0.45, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 3.6, y: height * 0.35, width: width * 0.08, height: platformHeight });
    
    // Final section leading to flag
    this.platforms.push({ x: width * 4.0, y: height * 0.5, width: width * 0.15, height: platformHeight });
    this.platforms.push({ x: width * 4.3, y: height * 0.4, width: width * 0.15, height: platformHeight });
    this.platforms.push({ x: width * 4.8, y: height * 0.3, width: width * 0.20, height: platformHeight });
  }

  protected spawnTurtles(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const groundY = height - Math.round(height * 0.15) - 64; // 64 = turtle height for mobile
    
    // Fewer but better positioned enemies for mobile
    this.turtles.push(new Turtle(width * 0.5, groundY));
    this.turtles.push(new Turtle(width * 1.2, groundY));
    this.turtles.push(new Turtle(width * 2.1, groundY));
    this.turtles.push(new Turtle(width * 3.2, groundY));
    this.turtles.push(new Turtle(width * 4.5, groundY));
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
    this.finishFlag = new FinishFlag(width * 5.5, groundY - 60);
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
      if (idx === 0) {
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
    ctx.fillRect(0, platform.y, this.levelWidth, window.innerHeight - platform.y);
    
    // Add cyber energy lines
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    for (let i = 0; i < this.levelWidth; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, platform.y);
      ctx.lineTo(i, platform.y - 10);
      ctx.stroke();
    }
  }

  private renderPlatform(ctx: CanvasRenderingContext2D, platform: any): void {
    // Cyber platform
    const gradient = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
    gradient.addColorStop(0, '#00ffff');
    gradient.addColorStop(0.5, '#0066cc');
    gradient.addColorStop(1, '#1a1a2e');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    
    // Glowing edge
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    ctx.shadowBlur = 0;
    
    // Energy nodes
    ctx.fillStyle = '#ffff00';
    for (let i = platform.x + 20; i < platform.x + platform.width - 20; i += 40) {
      ctx.fillRect(i, platform.y + 4, 6, 6);
    }
  }

  public checkCollisions(player: Player): void {
    const playerBounds = player.getBounds();
    let onGround = false;

    this.platforms.forEach(platform => {
      // Check if player is colliding with platform
      if (playerBounds.x < platform.x + platform.width &&
          playerBounds.x + playerBounds.width > platform.x &&
          playerBounds.y < platform.y + platform.height &&
          playerBounds.y + playerBounds.height > platform.y) {
        
        // Check if player is falling onto platform from above
        if (player.getVelocityY() > 0 && playerBounds.y < platform.y) {
          player.setPosition(player.x, platform.y - playerBounds.height);
          player.setVelocityY(0);
          player.setOnGround(true);
          onGround = true;
        }
      }
    });


    if (!onGround) {
      player.setOnGround(false);
    }

    // Check collisions with turtles
    this.turtles = this.turtles.filter(turtle => {
      if (turtle.isDefeated()) {
        return false; // Remove defeated turtles
      }
      
      const turtleBounds = turtle.getBounds();

      if (
        playerBounds.x < turtleBounds.x + turtleBounds.width &&
        playerBounds.x + playerBounds.width > turtleBounds.x &&
        playerBounds.y < turtleBounds.y + turtleBounds.height &&
        playerBounds.y + playerBounds.height > turtleBounds.y
      ) {
        if (player.getVelocityY() > 0 && playerBounds.y + playerBounds.height <= turtleBounds.y + 10) {
          // Player damages the turtle by jumping on it
          turtle.takeDamage();
          player.setVelocityY(-200); // Small bounce
          this.particleSystem.addExplosion(turtleBounds.x + turtleBounds.width/2, turtleBounds.y + turtleBounds.height/2, '#FFD700');
        } else {
          // Player loses health if touching the turtle from the side or bottom
          player.loseLife();
          if (player.getLives() <= 0) {
            this.endGame(false); // Lose condition
          } else {
            player.setPosition(100, 400); // Reset player position
          }
        }
      }
      
      return true; // Keep turtle in array
    });

    // Check collisions with power-ups
    this.powerUps = this.powerUps.filter(powerUp => {
      if (powerUp.isCollected()) return false;
      
      const powerUpBounds = powerUp.getBounds();
      if (
        playerBounds.x < powerUpBounds.x + powerUpBounds.width &&
        playerBounds.x + playerBounds.width > powerUpBounds.x &&
        playerBounds.y < powerUpBounds.y + powerUpBounds.height &&
        playerBounds.y + playerBounds.height > powerUpBounds.y
      ) {
        const type = powerUp.collect();
        this.particleSystem.addExplosion(powerUpBounds.x + powerUpBounds.width/2, powerUpBounds.y + powerUpBounds.height/2, '#00FFFF');
        
        // Apply power-up effect
        switch (type) {
          case PowerUpType.HEALTH:
            player.heal(25);
            break;
          case PowerUpType.SPEED:
            // Could implement speed boost
            break;
          case PowerUpType.JUMP:
            // Could implement jump boost
            break;
          case PowerUpType.SHIELD:
            // Could implement shield
            break;
        }
        return false;
      }
      return true;
    });

    // Check collision with finish flag
    if (this.finishFlag && !this.finishFlag.isCollected()) {
      const flagBounds = this.finishFlag.getBounds();
      if (
        playerBounds.x < flagBounds.x + flagBounds.width &&
        playerBounds.x + playerBounds.width > flagBounds.x &&
        playerBounds.y < flagBounds.y + flagBounds.height &&
        playerBounds.y + playerBounds.height > flagBounds.y
      ) {
        this.finishFlag.collect();
        this.particleSystem.addExplosion(flagBounds.x + flagBounds.width/2, flagBounds.y + flagBounds.height/2, '#FFD700');
        this.endGame(true); // Win condition
      }
    }
  }

  public endGame(won: boolean): void {
    if (!this.gameRunning) return; // Prevent multiple calls to endGame

    this.gameRunning = false; // Stop the game loop

    if (won) {
      this.showLevelCompleteMessage('Level 1 Complete! Loading Level 2...');

      setTimeout(() => {
        this.hideMessage();
        // Dynamically import Level2 to avoid circular dependency
        import('./Level2').then(({ }) => {
          const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
          const game = new Game(canvas);
          game.loadLevel(2);
        });
      }, 2000);
    } else {
      this.showGameOverMessage();
      setTimeout(() => {
        this.hideMessage();
        window.location.reload();
      }, 2000);
    }
  }

  protected showLevelCompleteMessage(text: string): void {
    const message = document.createElement('div');
    message.id = 'game-message';
    message.textContent = text;
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #FFD700;
      font-size: 4vw;
      font-weight: bold;
      text-align: center;
      background: linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,50,0,0.9));
      padding: 3vw 6vw;
      border-radius: 2vw;
      border: 3px solid #FFD700;
      z-index: 1000;
      box-shadow: 0 0 20px rgba(255,215,0,0.5);
      animation: fadeIn 0.5s ease-in;
    `;
    document.body.appendChild(message);
  }

  protected showGameOverMessage(): void {
    const message = document.createElement('div');
    message.id = 'game-message';
    message.textContent = 'Game Over! Restarting...';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #FF4444;
      font-size: 4vw;
      font-weight: bold;
      text-align: center;
      background: linear-gradient(135deg, rgba(0,0,0,0.9), rgba(50,0,0,0.9));
      padding: 3vw 6vw;
      border-radius: 2vw;
      border: 3px solid #FF4444;
      z-index: 1000;
      box-shadow: 0 0 20px rgba(255,68,68,0.5);
      animation: fadeIn 0.5s ease-in;
    `;
    document.body.appendChild(message);
  }

  protected hideMessage(): void {
    const message = document.getElementById('game-message');
    if (message) {
      document.body.removeChild(message);
    }
  }
}