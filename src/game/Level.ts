import { Player } from './Player';

export class Level {
  private platforms: Array<{x: number, y: number, width: number, height: number}> = [];

  constructor() {
    this.createLevel();
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

  public render(ctx: CanvasRenderingContext2D): void {
    // Draw platforms
    this.platforms.forEach(platform => {
      ctx.fillStyle = '#8B4513'; // Brown color for platforms
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      
      // Add some texture
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(platform.x + 2, platform.y + 2, platform.width - 4, platform.height - 4);
    });
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
  }
}
