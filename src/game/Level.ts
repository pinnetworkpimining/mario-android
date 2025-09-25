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
    // Create longer level - 4x wider than screen
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
    const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;
    
    this.levelWidth = width * 4; // 4 times wider for scrolling
    this.levelHeight = height;
    
    // Ground platform spans entire level width
    const groundHeight = Math.round(height * 0.10);
    this.platforms.push({ x: 0, y: height - groundHeight, width: this.levelWidth, height: groundHeight });

    // More platforms spread across the longer level
    const platformHeight = Math.max(20, height * 0.025); // Minimum 20px or 2.5% of screen height
    
    // First section
    this.platforms.push({ x: width * 0.12, y: height * 0.65, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 0.28, y: height * 0.52, width: width * 0.09, height: platformHeight });
    this.platforms.push({ x: width * 0.45, y: height * 0.40, width: width * 0.09, height: platformHeight });
    
    // Second section
    this.platforms.push({ x: width * 1.2, y: height * 0.60, width: width * 0.10, height: platformHeight });
    this.platforms.push({ x: width * 1.4, y: height * 0.45, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 1.6, y: height * 0.30, width: width * 0.12, height: platformHeight });
    
    // Third section
    this.platforms.push({ x: width * 2.1, y: height * 0.55, width: width * 0.09, height: platformHeight });
    this.platforms.push({ x: width * 2.3, y: height * 0.40, width: width * 0.10, height: platformHeight });
    this.platforms.push({ x: width * 2.5, y: height * 0.25, width: width * 0.08, height: platformHeight });
    
    // Final section leading to flag
    this.platforms.push({ x: width * 3.0, y: height * 0.50, width: width * 0.15, height: platformHeight });
    this.platforms.push({ x: width * 3.2, y: height * 0.35, width: width * 0.12, height: platformHeight });
    this.platforms.push({ x: width * 3.5, y: height * 0.20, width: width * 0.20, height: platformHeight });
  }

  protected spawnTurtles(): void {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
    const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;
    const groundY = height - Math.round(height * 0.10) - 32; // 32 = turtle height
    
    // Spread turtles across the longer level
    this.turtles.push(new Turtle(width * 0.3, groundY));
    this.turtles.push(new Turtle(width * 0.6, groundY));
    this.turtles.push(new Turtle(width * 1.3, groundY));
    this.turtles.push(new Turtle(width * 1.8, groundY));
    this.turtles.push(new Turtle(width * 2.2, groundY));
    this.turtles.push(new Turtle(width * 2.8, groundY));
    this.turtles.push(new Turtle(width * 3.3, groundY));
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
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
    const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;
    const groundY = height - Math.round(height * 0.10);
    
    // Place finish flag at the end of the level
    this.finishFlag = new FinishFlag(width * 3.7, groundY - 80);
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
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.7, '#98FB98'); // Pale green
    gradient.addColorStop(1, '#228B22'); // Forest green
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.levelWidth, this.levelHeight);
    
    // Draw clouds
    this.renderClouds(ctx);
    
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

  private renderClouds(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const scale = Math.min(window.innerWidth / 1900, window.innerHeight / 900);
    
    // More clouds spread across the longer level
    this.drawCloud(ctx, 200 * scale, 100 * scale, 60 * scale);
    this.drawCloud(ctx, 600 * scale, 80 * scale, 80 * scale);
    this.drawCloud(ctx, 1200 * scale, 120 * scale, 50 * scale);
    this.drawCloud(ctx, 1800 * scale, 90 * scale, 70 * scale);
    this.drawCloud(ctx, 2400 * scale, 110 * scale, 55 * scale);
    this.drawCloud(ctx, 3000 * scale, 85 * scale, 65 * scale);
    this.drawCloud(ctx, 3600 * scale, 95 * scale, 75 * scale);
  }

  private drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.3, y, size * 0.7, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.3, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderGround(ctx: CanvasRenderingContext2D, platform: any): void {
    // Ground with grass texture
    const gradient = ctx.createLinearGradient(0, platform.y, 0, ctx.canvas.height);
    gradient.addColorStop(0, '#32CD32'); // Lime green
    gradient.addColorStop(0.3, '#228B22'); // Forest green
    gradient.addColorStop(1, '#8B4513'); // Saddle brown (dirt)
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, platform.y, this.levelWidth, this.levelHeight - platform.y);
    
    // Add grass blades
    ctx.fillStyle = '#00FF00';
    for (let i = 0; i < this.levelWidth; i += 20) {
      const grassHeight = Math.random() * 10 + 5;
      ctx.fillRect(i, platform.y - grassHeight, 2, grassHeight);
      ctx.fillRect(i + 5, platform.y - grassHeight * 0.8, 2, grassHeight * 0.8);
      ctx.fillRect(i + 10, platform.y - grassHeight * 1.2, 2, grassHeight * 1.2);
    }
  }

  private renderPlatform(ctx: CanvasRenderingContext2D, platform: any): void {
    // Platform with metallic/stone texture
    const gradient = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
    gradient.addColorStop(0, '#C0C0C0'); // Silver
    gradient.addColorStop(0.5, '#808080'); // Gray
    gradient.addColorStop(1, '#404040'); // Dark gray
    
    ctx.fillStyle = gradient;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    
    // Add border/edge highlight
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(platform.x, platform.y, platform.width, 2);
    ctx.fillStyle = '#000000';
    ctx.fillRect(platform.x, platform.y + platform.height - 2, platform.width, 2);
    
    // Add rivets/details
    ctx.fillStyle = '#FFD700';
    for (let i = platform.x + 10; i < platform.x + platform.width - 10; i += 20) {
      ctx.fillRect(i, platform.y + 4, 4, 4);
      ctx.fillRect(i, platform.y + platform.height - 8, 4, 4);
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
          game.loadLevel2();
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