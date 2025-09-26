import { Level2 } from './Level2';
import { Turtle } from './Turtle';
import { FlyingEnemy } from './FlyingEnemy';
import { PowerUp, PowerUpType } from './PowerUp';
import { FinishFlag } from './FinishFlag';

export class Level4 extends Level2 {
  constructor() {
    super();
    this.createLevel();
    this.spawnEnemies();
  }

  protected createLevel(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.levelWidth = width * 8; // Even longer level
    this.levelHeight = height;
    
    // Ground platform
    const groundHeight = Math.round(height * 0.15);
    this.platforms.push({ x: 0, y: height - groundHeight, width: this.levelWidth, height: groundHeight });

    // Expert level platforms - very challenging
    const platformHeight = Math.max(25, height * 0.03);
    
    // Section 1 - Precision jumps
    this.platforms.push({ x: width * 0.15, y: height * 0.75, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 0.35, y: height * 0.65, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 0.55, y: height * 0.55, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 0.75, y: height * 0.45, width: width * 0.06, height: platformHeight });
    
    // Section 2 - Vertical challenge
    this.platforms.push({ x: width * 1.1, y: height * 0.7, width: width * 0.05, height: platformHeight });
    this.platforms.push({ x: width * 1.25, y: height * 0.6, width: width * 0.05, height: platformHeight });
    this.platforms.push({ x: width * 1.4, y: height * 0.5, width: width * 0.05, height: platformHeight });
    this.platforms.push({ x: width * 1.55, y: height * 0.4, width: width * 0.05, height: platformHeight });
    this.platforms.push({ x: width * 1.7, y: height * 0.3, width: width * 0.05, height: platformHeight });
    
    // Section 3 - Moving platform simulation
    this.platforms.push({ x: width * 2.0, y: height * 0.65, width: width * 0.04, height: platformHeight });
    this.platforms.push({ x: width * 2.15, y: height * 0.55, width: width * 0.04, height: platformHeight });
    this.platforms.push({ x: width * 2.3, y: height * 0.45, width: width * 0.04, height: platformHeight });
    this.platforms.push({ x: width * 2.45, y: height * 0.35, width: width * 0.04, height: platformHeight });
    this.platforms.push({ x: width * 2.6, y: height * 0.25, width: width * 0.04, height: platformHeight });
    
    // Section 4 - Maze-like
    this.platforms.push({ x: width * 3.0, y: height * 0.6, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 3.2, y: height * 0.5, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 3.4, y: height * 0.4, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 3.6, y: height * 0.3, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 3.8, y: height * 0.2, width: width * 0.06, height: platformHeight });
    
    // Section 5 - Final approach
    this.platforms.push({ x: width * 4.2, y: height * 0.55, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 4.5, y: height * 0.45, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 4.8, y: height * 0.35, width: width * 0.08, height: platformHeight });
    
    // More challenging sections
    this.platforms.push({ x: width * 5.2, y: height * 0.6, width: width * 0.05, height: platformHeight });
    this.platforms.push({ x: width * 5.4, y: height * 0.5, width: width * 0.05, height: platformHeight });
    this.platforms.push({ x: width * 5.6, y: height * 0.4, width: width * 0.05, height: platformHeight });
    this.platforms.push({ x: width * 5.8, y: height * 0.3, width: width * 0.05, height: platformHeight });
    
    // Final platforms
    this.platforms.push({ x: width * 6.2, y: height * 0.5, width: width * 0.15, height: platformHeight });
    this.platforms.push({ x: width * 6.5, y: height * 0.4, width: width * 0.20, height: platformHeight });
  }

  protected spawnEnemies(): void {
    this.spawnTurtles();
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Many flying enemies for level 4
    this.flyingEnemies.push(new FlyingEnemy(width * 0.3, height * 0.6));
    this.flyingEnemies.push(new FlyingEnemy(width * 0.6, height * 0.4));
    this.flyingEnemies.push(new FlyingEnemy(width * 1.0, height * 0.5));
    this.flyingEnemies.push(new FlyingEnemy(width * 1.3, height * 0.35));
    this.flyingEnemies.push(new FlyingEnemy(width * 1.8, height * 0.25));
    this.flyingEnemies.push(new FlyingEnemy(width * 2.2, height * 0.4));
    this.flyingEnemies.push(new FlyingEnemy(width * 2.7, height * 0.2));
    this.flyingEnemies.push(new FlyingEnemy(width * 3.3, height * 0.35));
    this.flyingEnemies.push(new FlyingEnemy(width * 3.9, height * 0.15));
    this.flyingEnemies.push(new FlyingEnemy(width * 4.4, height * 0.4));
    this.flyingEnemies.push(new FlyingEnemy(width * 5.0, height * 0.35));
    this.flyingEnemies.push(new FlyingEnemy(width * 5.5, height * 0.25));
    this.flyingEnemies.push(new FlyingEnemy(width * 6.0, height * 0.35));
  }

  protected spawnTurtles(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const groundY = height - Math.round(height * 0.15) - 64;
    
    // More turtles for level 4
    this.turtles.push(new Turtle(width * 0.4, groundY));
    this.turtles.push(new Turtle(width * 0.8, groundY));
    this.turtles.push(new Turtle(width * 1.5, groundY));
    this.turtles.push(new Turtle(width * 2.3, groundY));
    this.turtles.push(new Turtle(width * 3.1, groundY));
    this.turtles.push(new Turtle(width * 4.0, groundY));
    this.turtles.push(new Turtle(width * 4.9, groundY));
    this.turtles.push(new Turtle(width * 5.7, groundY));
    this.turtles.push(new Turtle(width * 6.4, groundY));
  }

  protected spawnPowerUps(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Strategic power-up placement
    this.powerUps.push(new PowerUp(width * 0.2, height * 0.7, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 0.6, height * 0.5, PowerUpType.SPEED));
    this.powerUps.push(new PowerUp(width * 1.3, height * 0.55, PowerUpType.JUMP));
    this.powerUps.push(new PowerUp(width * 1.75, height * 0.25, PowerUpType.SHIELD));
    this.powerUps.push(new PowerUp(width * 2.65, height * 0.2, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 3.5, height * 0.35, PowerUpType.SPEED));
    this.powerUps.push(new PowerUp(width * 4.3, height * 0.5, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 5.3, height * 0.55, PowerUpType.JUMP));
    this.powerUps.push(new PowerUp(width * 6.3, height * 0.45, PowerUpType.HEALTH));
  }

  protected spawnFinishFlag(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const groundY = height - Math.round(height * 0.15);
    
    this.finishFlag = new FinishFlag(width * 7.5, groundY - 60);
  }

  public endGame(won: boolean): void {
    if (won) {
      this.showLevelCompleteMessage('Level 4 Complete! Loading Final Level...');
      setTimeout(() => {
        this.hideMessage();
        import('./Level5').then(() => {
          const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
          const game = (window as any).gameInstance;
          if (game) game.loadLevel(5);
        });
      }, 2000);
    } else {
      this.showGameOverMessage();
      setTimeout(() => window.location.reload(), 2000);
    }
  }
}