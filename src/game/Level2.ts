import { Player } from './Player';
import { FlyingEnemy } from './FlyingEnemy';
import { Turtle } from './Turtle';
import { Level } from './Level';
import { PowerUp, PowerUpType } from './PowerUp';
import { FinishFlag } from './FinishFlag';
import { Game } from './Game';



export class Level2 extends Level {
  protected platforms: Array<{ x: number; y: number; width: number; height: number }> = []; // Changed from private to protected
  protected turtles: Turtle[] = [];
  protected flyingEnemies: FlyingEnemy[] = [];

  protected gameRunning: boolean = true; // Changed from private to protected

  constructor() {
    super();
    this.createLevel();
    this.spawnEnemies();
  }

  protected createLevel(): void {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
    const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;
    
    this.levelWidth = width * 5; // Even longer level
    this.levelHeight = height;
    
    // Ground platform spans entire level width
    const groundHeight = Math.round(height * 0.10);
    this.platforms.push({ x: 0, y: height - groundHeight, width: this.levelWidth, height: groundHeight });

    // More challenging platforms with proper jump distances
    const platformHeight = Math.max(20, height * 0.025);
    
    // Section 1 - Moderate difficulty
    this.platforms.push({ x: width * 0.15, y: height * 0.70, width: width * 0.12, height: platformHeight });
    this.platforms.push({ x: width * 0.35, y: height * 0.55, width: width * 0.10, height: platformHeight });
    this.platforms.push({ x: width * 0.55, y: height * 0.40, width: width * 0.12, height: platformHeight });
    
    // Section 2 - Increased difficulty
    this.platforms.push({ x: width * 1.2, y: height * 0.65, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 1.4, y: height * 0.50, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 1.65, y: height * 0.35, width: width * 0.10, height: platformHeight });
    this.platforms.push({ x: width * 1.9, y: height * 0.20, width: width * 0.08, height: platformHeight });
    
    // Section 3 - High difficulty
    this.platforms.push({ x: width * 2.3, y: height * 0.60, width: width * 0.07, height: platformHeight });
    this.platforms.push({ x: width * 2.5, y: height * 0.45, width: width * 0.07, height: platformHeight });
    this.platforms.push({ x: width * 2.7, y: height * 0.30, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 2.95, y: height * 0.15, width: width * 0.07, height: platformHeight });
    
    // Section 4 - Expert difficulty
    this.platforms.push({ x: width * 3.3, y: height * 0.55, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 3.5, y: height * 0.40, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 3.7, y: height * 0.25, width: width * 0.08, height: platformHeight });
    
    // Final section leading to flag
    this.platforms.push({ x: width * 4.1, y: height * 0.50, width: width * 0.15, height: platformHeight });
    this.platforms.push({ x: width * 4.4, y: height * 0.35, width: width * 0.20, height: platformHeight });
  }

  protected spawnEnemies(): void {
    this.spawnTurtles();

    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
    const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;
    
    // More flying enemies spread across the longer level
    this.flyingEnemies.push(new FlyingEnemy(width * 0.4, height * 0.65));
    this.flyingEnemies.push(new FlyingEnemy(width * 0.8, height * 0.45));
    this.flyingEnemies.push(new FlyingEnemy(width * 1.5, height * 0.40));
    this.flyingEnemies.push(new FlyingEnemy(width * 2.1, height * 0.50));
    this.flyingEnemies.push(new FlyingEnemy(width * 2.8, height * 0.25));
    this.flyingEnemies.push(new FlyingEnemy(width * 3.4, height * 0.45));
    this.flyingEnemies.push(new FlyingEnemy(width * 4.0, height * 0.30));
  }

  protected spawnTurtles(): void {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
    const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;
    const groundHeight = Math.round(height * 0.10);
    const groundY = height - groundHeight;
    
    // More turtles spread across the level
    this.turtles.push(new Turtle(width * 0.3, groundY - 32));
    this.turtles.push(new Turtle(width * 0.7, groundY - 32));
    this.turtles.push(new Turtle(width * 1.3, groundY - 32));
    this.turtles.push(new Turtle(width * 1.8, groundY - 32));
    this.turtles.push(new Turtle(width * 2.4, groundY - 32));
    this.turtles.push(new Turtle(width * 3.1, groundY - 32));
    this.turtles.push(new Turtle(width * 3.8, groundY - 32));
    this.turtles.push(new Turtle(width * 4.3, groundY - 32));
  }

  protected spawnPowerUps(): void {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
    const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;
    
    // Place power-ups strategically
    this.powerUps.push(new PowerUp(width * 0.2, height * 0.65, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 0.6, height * 0.35, PowerUpType.SPEED));
    this.powerUps.push(new PowerUp(width * 1.45, height * 0.45, PowerUpType.JUMP));
    this.powerUps.push(new PowerUp(width * 2.0, height * 0.15, PowerUpType.SHIELD));
    this.powerUps.push(new PowerUp(width * 2.75, height * 0.25, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 3.6, height * 0.20, PowerUpType.SPEED));
    this.powerUps.push(new PowerUp(width * 4.2, height * 0.45, PowerUpType.HEALTH));
  }

  protected spawnFinishFlag(): void {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
    const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;
    const groundY = height - Math.round(height * 0.10);
    
    // Place finish flag at the end of the level
    this.finishFlag = new FinishFlag(width * 4.7, groundY - 80);
  }

  public update(deltaTime: number): void {
    if (!this.gameRunning) return;

    this.turtles.forEach((turtle) => turtle.update(deltaTime));
    this.flyingEnemies.forEach((enemy) => enemy.update(deltaTime));
  }

  public render(ctx: CanvasRenderingContext2D): void {
    // Draw platforms
    this.platforms.forEach((platform, idx) => {
      if (idx === 0) {
        // Ground platform: fill entire bottom
        ctx.fillStyle = '#90EE90'; // Green ground
        ctx.fillRect(0, platform.y, ctx.canvas.width, ctx.canvas.height - platform.y);
      } else {
        ctx.fillStyle = '#8B4513'; // Brown color for platforms
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        // Add some texture
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(platform.x + 2, platform.y + 2, platform.width - 4, platform.height - 4);
      }
    });

    // Draw turtles
    this.turtles.forEach((turtle) => turtle.render(ctx));

    // Draw flying enemies
    this.flyingEnemies.forEach((enemy) => enemy.render(ctx));
  }

  public checkCollisions(player: Player): void {
    const playerBounds = player.getBounds();
    let onGround = false;

    this.platforms.forEach((platform) => {
      // Check if player is colliding with platform
      if (
        playerBounds.x < platform.x + platform.width &&
        playerBounds.x + playerBounds.width > platform.x &&
        playerBounds.y < platform.y + platform.height &&
        playerBounds.y + playerBounds.height >= platform.y
      ) {
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
    this.turtles.forEach((turtle) => {
      const turtleBounds = turtle.getBounds();

      if (
        playerBounds.x < turtleBounds.x + turtleBounds.width &&
        playerBounds.x + playerBounds.width > turtleBounds.x &&
        playerBounds.y < turtleBounds.y + turtleBounds.height &&
        playerBounds.y + playerBounds.height > turtleBounds.y
      ) {
        if (player.getVelocityY() > 0 && playerBounds.y + playerBounds.height <= turtleBounds.y + 10) {
          // Player defeats the turtle by jumping on it
          this.turtles = this.turtles.filter((t) => t !== turtle);
        } else {
          // Player loses if touching the turtle from the side or bottom
          player.loseLife();
        }
      }
    });

    // Check collisions with flying enemies
    this.flyingEnemies.forEach((enemy) => {
      const enemyBounds = enemy.getBounds();

      if (
        playerBounds.x < enemyBounds.x + enemyBounds.width &&
        playerBounds.x + playerBounds.width > enemyBounds.x &&
        playerBounds.y < enemyBounds.y + enemyBounds.height &&
        playerBounds.y + playerBounds.height > enemyBounds.y
      ) {
        // Player loses if touching a flying enemy
        player.loseLife();
      }
    });

    // Check collision with finish flag (inherited from Level)
    if (this.finishFlag && !this.finishFlag.isCollected()) {
      const flagBounds = this.finishFlag.getBounds();
      if (
        playerBounds.x < flagBounds.x + flagBounds.width &&
        playerBounds.x + playerBounds.width > flagBounds.x &&
        playerBounds.y < flagBounds.y + flagBounds.height &&
        playerBounds.y + playerBounds.height > flagBounds.y
      ) {
        this.finishFlag.collect();
        if (this.particleSystem) {
          this.particleSystem.addExplosion(flagBounds.x + flagBounds.width/2, flagBounds.y + flagBounds.height/2, '#FFD700');
        }
        this.levelCompleted = true;
      }
    }
  }

  public endGame(won: boolean): void {
    if (won) {
      this.showLevelCompleteMessage('Level 2 Complete! Loading Level 3...');

      setTimeout(() => {
        this.hideMessage();
        // Signal level completion to the scene system
        if ((window as any).levelCompleted) {
          (window as any).levelCompleted(2);
        }
      }, 2000);
    } else {
      this.showGameOverMessage();
      setTimeout(() => window.location.reload(), 2000);
    }
  }
}