import { Player } from './Player';
import { Turtle } from './Turtle';
import { Game } from './Game';
import { BaseLevel } from './BaseLevel';

export class Level extends BaseLevel {
  protected platforms: Array<{x: number, y: number, width: number, height: number}> = []; // Changed from private to protected
  protected turtles: Turtle[] = [];
  protected gameRunning: boolean = true; // Flag to control game loop

  constructor() {
    super();
    this.createLevel();
    this.spawnTurtles();
  }

  protected createLevel(): void {
    // Responsive ground platform (fills canvas width)
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
    const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;
    // Ground height is 10% of screen height
    const groundHeight = Math.round(height * 0.10);
    this.platforms.push({ x: 0, y: height - groundHeight, width: width, height: groundHeight });

    // Responsive floating platforms (relative positions) - adjusted for mobile
    const platformHeight = Math.max(20, height * 0.025); // Minimum 20px or 2.5% of screen height
    this.platforms.push({ x: width * 0.12, y: height * 0.65, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 0.28, y: height * 0.52, width: width * 0.09, height: platformHeight });
    this.platforms.push({ x: width * 0.45, y: height * 0.40, width: width * 0.09, height: platformHeight });
    this.platforms.push({ x: width * 0.62, y: height * 0.30, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 0.75, y: height * 0.20, width: width * 0.07, height: platformHeight });
  }

  protected spawnTurtles(): void {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
    const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;
    const groundY = height - Math.round(height * 0.10) - 32; // 32 = turtle height
    
    this.turtles.push(new Turtle(width * 0.2, groundY)); // Spawn a turtle on the ground
    this.turtles.push(new Turtle(width * 0.4, groundY)); // Spawn another turtle
  }

  public update(deltaTime: number): void {
    if (!this.gameRunning) return; // Skip update if game is not running

    this.turtles.forEach(turtle => turtle.update(deltaTime));
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
    this.turtles.forEach(turtle => turtle.render(ctx));
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

    // Check if player is on ground level
    if (playerBounds.y + playerBounds.height >= 550) {
      player.setPosition(player.x, 550 - playerBounds.height);
      player.setVelocityY(0);
      player.setOnGround(true);
      onGround = true;
    }

    if (!onGround) {
      player.setOnGround(false);
    }

    // Check collisions with turtles
    this.turtles.forEach(turtle => {
      const turtleBounds = { x: turtle.x, y: turtle.y, width: 32, height: 32 };

      if (
        playerBounds.x < turtleBounds.x + turtleBounds.width &&
        playerBounds.x + playerBounds.width > turtleBounds.x &&
        playerBounds.y < turtleBounds.y + turtleBounds.height &&
        playerBounds.y + playerBounds.height > turtleBounds.y
      ) {
        if (player.getVelocityY() > 0 && playerBounds.y + playerBounds.height <= turtleBounds.y + 10) {
          // Player defeats the turtle by jumping on it
          this.turtles = this.turtles.filter(t => t !== turtle);
        } else {
          // Player loses if touching the turtle from the side or bottom
          player.loseLife();
          if (player.getLives() <= 0) {
            this.endGame(false); // Lose condition
          } else {
            player.setPosition(100, 400); // Reset player position
          }
        }
      }
    });

    if (this.turtles.length === 0) {
      this.endGame(true); // Win condition
    }
  }

  public endGame(won: boolean): void {
    if (!this.gameRunning) return; // Prevent multiple calls to endGame

    this.gameRunning = false; // Stop the game loop
    this.gameRunning = false; // Stop the game loop to prevent repeated calls

    if (won) {
      const message = document.createElement('div');
      message.textContent = 'Level 1 Complete! Loading Level 2...';
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
        const game = new Game(document.getElementById('gameCanvas') as HTMLCanvasElement);
        game.loadLevel2();
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
