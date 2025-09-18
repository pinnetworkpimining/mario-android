import { Player } from './Player';
import { FlyingEnemy } from './FlyingEnemy';
import { Turtle } from './Turtle';

export class Level2 {
  private platforms: Array<{ x: number; y: number; width: number; height: number }> = [];
  private turtles: Turtle[] = [];
  private flyingEnemies: FlyingEnemy[] = [];

  private gameRunning: boolean = true;

  constructor() {
    this.createLevel();
    this.spawnEnemies();
  }

  private createLevel(): void {
    // Ground platform
    this.platforms.push({ x: 0, y: 550, width: 800, height: 50 });

    // Floating platforms
    this.platforms.push({ x: 150, y: 450, width: 100, height: 20 });
    this.platforms.push({ x: 350, y: 350, width: 100, height: 20 });
    this.platforms.push({ x: 550, y: 250, width: 100, height: 20 });
    this.platforms.push({ x: 250, y: 300, width: 80, height: 20 });
    this.platforms.push({ x: 450, y: 200, width: 80, height: 20 });
  }

  private spawnEnemies(): void {
    this.turtles.push(new Turtle(300, 518)); // Ground turtle
    this.turtles.push(new Turtle(500, 518)); // Another ground turtle

    this.flyingEnemies.push(new FlyingEnemy(200, 400)); // Flying enemy
    this.flyingEnemies.push(new FlyingEnemy(600, 300)); // Another flying enemy
  }

  public update(deltaTime: number): void {
    if (!this.gameRunning) return;

    this.turtles.forEach((turtle) => turtle.update(deltaTime));
    this.flyingEnemies.forEach((enemy) => enemy.update(deltaTime));
  }

  public render(ctx: CanvasRenderingContext2D): void {
    // Draw platforms
    this.platforms.forEach((platform) => {
      ctx.fillStyle = '#8B4513'; // Brown color for platforms
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

      // Add some texture
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(platform.x + 2, platform.y + 2, platform.width - 4, platform.height - 4);
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

  private endGame(won: boolean): void {
    if (!this.gameRunning) return; // Prevent multiple calls to endGame

    this.gameRunning = false;
    if (won) {
      const message = document.createElement('div');
      message.textContent = 'You Win Level 2! Restarting...';
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