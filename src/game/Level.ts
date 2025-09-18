import { Player } from './Player';
import { Turtle } from './Turtle';

export class Level {
  private platforms: Array<{x: number, y: number, width: number, height: number}> = [];
  private turtles: Turtle[] = [];
  private gameRunning: boolean = true; // Flag to control game loop

  constructor() {
    this.createLevel();
    this.spawnTurtles();
  }

  private createLevel(): void {
    // Ground platform
    this.platforms.push({ x: 0, y: 550, width: 800, height: 50 });
    
    // Some floating platforms
    this.platforms.push({ x: 200, y: 450, width: 100, height: 20 });
    this.platforms.push({ x: 400, y: 350, width: 100, height: 20 });
    this.platforms.push({ x: 600, y: 250, width: 100, height: 20 });
    this.platforms.push({ x: 100, y: 300, width: 80, height: 20 });
    this.platforms.push({ x: 500, y: 200, width: 80, height: 20 });
  }

  private spawnTurtles(): void {
    this.turtles.push(new Turtle(300, 518)); // Spawn a turtle on the ground
    this.turtles.push(new Turtle(500, 518)); // Spawn another turtle
  }

  public update(deltaTime: number): void {
    if (!this.gameRunning) return; // Skip update if game is not running

    this.turtles.forEach(turtle => turtle.update(deltaTime));
  }

  public render(ctx: CanvasRenderingContext2D): void {
    // Draw platforms
    this.platforms.forEach(platform => {
      ctx.fillStyle = '#8B4513'; // Brown color for platforms
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      
      // Add some texture
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(platform.x + 2, platform.y + 2, platform.width - 4, platform.height - 4);
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

  private endGame(won: boolean): void {
    this.gameRunning = false; // Stop the game loop

    if (won) {
      alert('You win!');
    } else {
      alert('Game over!');
    }
    setTimeout(() => window.location.reload(), 1000); // Restart the game after 1 second
  }
}
