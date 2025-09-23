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
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.7, '#98FB98'); // Pale green
    gradient.addColorStop(1, '#228B22'); // Forest green
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
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
  }

  private renderClouds(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const scale = Math.min(window.innerWidth / 1900, window.innerHeight / 900);
    
    // Cloud 1
    this.drawCloud(ctx, 200 * scale, 100 * scale, 60 * scale);
    // Cloud 2
    this.drawCloud(ctx, 600 * scale, 80 * scale, 80 * scale);
    // Cloud 3
    this.drawCloud(ctx, 1200 * scale, 120 * scale, 50 * scale);
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
    ctx.fillRect(0, platform.y, ctx.canvas.width, ctx.canvas.height - platform.y);
    
    // Add grass blades
    ctx.fillStyle = '#00FF00';
    for (let i = 0; i < ctx.canvas.width; i += 20) {
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
