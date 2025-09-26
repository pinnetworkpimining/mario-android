import { Level2 } from './Level2';
import { Turtle } from './Turtle';
import { FlyingEnemy } from './FlyingEnemy';
import { PowerUp, PowerUpType } from './PowerUp';
import { FinishFlag } from './FinishFlag';
import { BossMonster } from './BossMonster';

export class Level5 extends Level2 {
  protected boss: BossMonster | null = null;

  constructor() {
    super();
    this.createLevel();
    this.spawnEnemies();
    this.spawnBoss();
  }

  protected createLevel(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.levelWidth = width * 10; // Longest level with boss arena
    this.levelHeight = height;
    
    // Ground platform
    const groundHeight = Math.round(height * 0.15);
    this.platforms.push({ x: 0, y: height - groundHeight, width: this.levelWidth, height: groundHeight });

    // Final level - ultimate challenge
    const platformHeight = Math.max(25, height * 0.03);
    
    // Section 1 - Warm up
    this.platforms.push({ x: width * 0.2, y: height * 0.7, width: width * 0.1, height: platformHeight });
    this.platforms.push({ x: width * 0.4, y: height * 0.6, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 0.6, y: height * 0.5, width: width * 0.08, height: platformHeight });
    
    // Section 2 - Increasing difficulty
    this.platforms.push({ x: width * 0.9, y: height * 0.65, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 1.1, y: height * 0.55, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 1.3, y: height * 0.45, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 1.5, y: height * 0.35, width: width * 0.06, height: platformHeight });
    
    // Section 3 - Precision jumps
    this.platforms.push({ x: width * 1.8, y: height * 0.6, width: width * 0.05, height: platformHeight });
    this.platforms.push({ x: width * 2.0, y: height * 0.5, width: width * 0.05, height: platformHeight });
    this.platforms.push({ x: width * 2.2, y: height * 0.4, width: width * 0.05, height: platformHeight });
    this.platforms.push({ x: width * 2.4, y: height * 0.3, width: width * 0.05, height: platformHeight });
    this.platforms.push({ x: width * 2.6, y: height * 0.2, width: width * 0.05, height: platformHeight });
    
    // Section 4 - Maze section
    this.platforms.push({ x: width * 3.0, y: height * 0.65, width: width * 0.04, height: platformHeight });
    this.platforms.push({ x: width * 3.15, y: height * 0.55, width: width * 0.04, height: platformHeight });
    this.platforms.push({ x: width * 3.3, y: height * 0.45, width: width * 0.04, height: platformHeight });
    this.platforms.push({ x: width * 3.45, y: height * 0.35, width: width * 0.04, height: platformHeight });
    this.platforms.push({ x: width * 3.6, y: height * 0.25, width: width * 0.04, height: platformHeight });
    this.platforms.push({ x: width * 3.75, y: height * 0.15, width: width * 0.04, height: platformHeight });
    
    // Section 5 - Pre-boss area
    this.platforms.push({ x: width * 4.2, y: height * 0.6, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 4.5, y: height * 0.5, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 4.8, y: height * 0.4, width: width * 0.08, height: platformHeight });
    
    // Section 6 - Approach to boss arena
    this.platforms.push({ x: width * 5.3, y: height * 0.55, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 5.6, y: height * 0.45, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 5.9, y: height * 0.35, width: width * 0.06, height: platformHeight });
    
    // Boss arena platforms
    this.platforms.push({ x: width * 6.5, y: height * 0.6, width: width * 0.15, height: platformHeight });
    this.platforms.push({ x: width * 6.8, y: height * 0.4, width: width * 0.15, height: platformHeight });
    this.platforms.push({ x: width * 7.1, y: height * 0.2, width: width * 0.15, height: platformHeight });
    
    // Final section after boss
    this.platforms.push({ x: width * 8.0, y: height * 0.5, width: width * 0.2, height: platformHeight });
    this.platforms.push({ x: width * 8.5, y: height * 0.4, width: width * 0.25, height: platformHeight });
  }

  protected spawnBoss(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const groundY = height - Math.round(height * 0.15) - 128; // Boss is bigger
    
    this.boss = new BossMonster(width * 7.0, groundY);
  }

  protected spawnEnemies(): void {
    this.spawnTurtles();
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Maximum enemies for final level
    this.flyingEnemies.push(new FlyingEnemy(width * 0.3, height * 0.55));
    this.flyingEnemies.push(new FlyingEnemy(width * 0.7, height * 0.45));
    this.flyingEnemies.push(new FlyingEnemy(width * 1.2, height * 0.4));
    this.flyingEnemies.push(new FlyingEnemy(width * 1.7, height * 0.35));
    this.flyingEnemies.push(new FlyingEnemy(width * 2.3, height * 0.25));
    this.flyingEnemies.push(new FlyingEnemy(width * 2.9, height * 0.5));
    this.flyingEnemies.push(new FlyingEnemy(width * 3.5, height * 0.2));
    this.flyingEnemies.push(new FlyingEnemy(width * 4.1, height * 0.45));
    this.flyingEnemies.push(new FlyingEnemy(width * 4.7, height * 0.35));
    this.flyingEnemies.push(new FlyingEnemy(width * 5.4, height * 0.4));
    this.flyingEnemies.push(new FlyingEnemy(width * 6.0, height * 0.3));
    
    // Boss arena guards
    this.flyingEnemies.push(new FlyingEnemy(width * 6.7, height * 0.5));
    this.flyingEnemies.push(new FlyingEnemy(width * 7.3, height * 0.3));
    this.flyingEnemies.push(new FlyingEnemy(width * 7.9, height * 0.35));
  }

  protected spawnTurtles(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const groundY = height - Math.round(height * 0.15) - 64;
    
    // Maximum turtles for final level
    this.turtles.push(new Turtle(width * 0.5, groundY));
    this.turtles.push(new Turtle(width * 1.0, groundY));
    this.turtles.push(new Turtle(width * 1.6, groundY));
    this.turtles.push(new Turtle(width * 2.5, groundY));
    this.turtles.push(new Turtle(width * 3.4, groundY));
    this.turtles.push(new Turtle(width * 4.3, groundY));
    this.turtles.push(new Turtle(width * 5.2, groundY));
    this.turtles.push(new Turtle(width * 6.1, groundY));
    this.turtles.push(new Turtle(width * 8.3, groundY));
  }

  protected spawnPowerUps(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Maximum power-ups for final level
    this.powerUps.push(new PowerUp(width * 0.25, height * 0.65, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 0.65, height * 0.45, PowerUpType.SPEED));
    this.powerUps.push(new PowerUp(width * 1.15, height * 0.5, PowerUpType.JUMP));
    this.powerUps.push(new PowerUp(width * 1.55, height * 0.3, PowerUpType.SHIELD));
    this.powerUps.push(new PowerUp(width * 2.25, height * 0.35, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 2.65, height * 0.15, PowerUpType.SPEED));
    this.powerUps.push(new PowerUp(width * 3.4, height * 0.4, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 4.0, height * 0.55, PowerUpType.JUMP));
    this.powerUps.push(new PowerUp(width * 4.65, height * 0.45, PowerUpType.SHIELD));
    this.powerUps.push(new PowerUp(width * 5.45, height * 0.5, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 6.2, height * 0.4, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 8.25, height * 0.45, PowerUpType.HEALTH));
  }

  protected spawnFinishFlag(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const groundY = height - Math.round(height * 0.15);
    
    this.finishFlag = new FinishFlag(width * 9.5, groundY - 60);
  }

  public update(deltaTime: number): void {
    super.update(deltaTime);
    if (this.boss) {
      this.boss.update(deltaTime);
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
    if (this.boss) {
      this.boss.render(ctx);
    }
  }

  public checkCollisions(player: any): void {
    super.checkCollisions(player);
    
    // Check boss collision
    if (this.boss && !this.boss.isDefeated()) {
      const playerBounds = player.getBounds();
      const bossBounds = this.boss.getBounds();
      
      if (
        playerBounds.x < bossBounds.x + bossBounds.width &&
        playerBounds.x + playerBounds.width > bossBounds.x &&
        playerBounds.y < bossBounds.y + bossBounds.height &&
        playerBounds.y + playerBounds.height > bossBounds.y
      ) {
        if (player.getVelocityY() > 0 && playerBounds.y + playerBounds.height <= bossBounds.y + 20) {
          // Player damages boss by jumping on it
          this.boss.takeDamage();
          player.setVelocityY(-300); // Bounce
          if (this.boss.isDefeated()) {
            // Boss defeated, show particles
            this.particleSystem.addExplosion(bossBounds.x + bossBounds.width/2, bossBounds.y + bossBounds.height/2, '#ff0000');
          }
        } else {
          // Player takes damage from boss
          player.loseLife();
        }
      }
    }
  }

  public endGame(won: boolean): void {
    if (won) {
      this.showVictoryMessage();
      const playAgainBtn = document.createElement('button');
      playAgainBtn.textContent = 'Play Again';
      playAgainBtn.className = 'menu-button';
      playAgainBtn.style.cssText = `
        position: fixed;
        top: 65%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1001;
      `;
      playAgainBtn.onclick = () => window.location.reload();
      document.body.appendChild(playAgainBtn);
    } else {
      this.showGameOverMessage();
      setTimeout(() => window.location.reload(), 2000);
    }
  }

  private showVictoryMessage(): void {
    const message = document.createElement('div');
    message.className = 'game-message';
    message.innerHTML = `
      <div style="font-size: 8vh; margin-bottom: 3vh;">🎉 VICTORY! 🎉</div>
      <div style="font-size: 4vh;">Congratulations, Cyber Runner!</div>
      <div style="font-size: 3vh; margin-top: 2vh;">You have completed all levels!</div>
    `;
    document.body.appendChild(message);
  }
}