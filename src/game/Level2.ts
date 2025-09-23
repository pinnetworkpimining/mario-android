import { Player } from './Player';
import { FlyingEnemy } from './FlyingEnemy';
import { Turtle } from './Turtle';
import { Level } from './Level';

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
    // Responsive ground platform (fills canvas width)
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width : 1900;
    const height = canvas ? canvas.height : 900;
    const groundHeight = Math.round(height * 0.1); // Higher ground for better jump
    this.platforms.push({ x: 0, y: height - groundHeight, width: width, height: groundHeight });

    // Responsive floating platforms (higher for Mario's jump)
    this.platforms.push({ x: width * 0.12, y: height * 0.60, width: width * 0.09, height: 24 });
    this.platforms.push({ x: width * 0.32, y: height * 0.48, width: width * 0.10, height: 24 });
    this.platforms.push({ x: width * 0.54, y: height * 0.36, width: width * 0.10, height: 24 });
    this.platforms.push({ x: width * 0.72, y: height * 0.26, width: width * 0.09, height: 24 });
    this.platforms.push({ x: width * 0.85, y: height * 0.16, width: width * 0.08, height: 24 });
  }

  protected spawnEnemies(): void {
    this.spawnTurtles();

    // Place flying enemies above platforms for visibility
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width : 1900;
    const height = canvas ? canvas.height : 900;
    this.flyingEnemies.push(new FlyingEnemy(width * 0.15, height * 0.55));
    this.flyingEnemies.push(new FlyingEnemy(width * 0.60, height * 0.32));
  }

  protected spawnTurtles(): void {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width : 1900;
    const height = canvas ? canvas.height : 900;
    const groundHeight = Math.round(height * 0.13);
    const groundY = height - groundHeight;
    // Place turtles on ground, spaced out
    this.turtles.push(new Turtle(width * 0.25, groundY - 32));
    this.turtles.push(new Turtle(width * 0.55, groundY - 32));
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
        playerBounds.y + playerBounds.height > platform.y
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
  }

  public endGame(won: boolean): void {
    if (won) {
      const message = document.createElement('div');
      message.textContent = 'Level 2 Complete! Loading Level 3...';
      message.style.position = 'absolute';
      message.style.top = '50%';
      message.style.left = '50%';
      message.style.transform = 'translate(-50%, -50%)';
      message.style.color = 'white';
      message.style.fontSize = '24px';
      message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      message.style.padding = '10px';
      message.style.borderRadius = '5px';
      document.body.appendChild(message);

      setTimeout(() => {
        const game = new (require('./Game').Game)(document.getElementById('gameCanvas'));
        game.loadLevel3();
      }, 2000);
    } else {
      const message = document.createElement('div');
      message.textContent = 'Game Over! Restarting...';
      message.style.position = 'absolute';
      message.style.top = '50%';
      message.style.left = '50%';
      message.style.transform = 'translate(-50%, -50%)';
      message.style.color = 'white';
      message.style.fontSize = '24px';
      message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      message.style.padding = '10px';
      message.style.borderRadius = '5px';
      document.body.appendChild(message);

      setTimeout(() => window.location.reload(), 2000);
    }
  }
}