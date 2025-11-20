import { Level2 } from './Level2';
import { Turtle } from './Turtle';
import { FlyingEnemy } from './FlyingEnemy';
import { PowerUp, PowerUpType } from './PowerUp';
import { FinishFlag } from './FinishFlag';
import { InteractiveEnemy } from './InteractiveEnemy';
import { Projectile } from './Projectile';
import { Player } from './Player';

export class Level6 extends Level2 {
  protected interactiveEnemies: InteractiveEnemy[] = [];
  protected projectiles: Projectile[] = [];

  constructor() {
    super();
    this.spawnInteractiveEnemies();
  }

  protected createLevel(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.levelWidth = width * 12; // Longest level yet
    this.levelHeight = height;

    // Ground platform
    const groundHeight = Math.round(height * 0.15);
    this.platforms.push({ x: 0, y: height - groundHeight, width: this.levelWidth, height: groundHeight });

    // Interactive enemy level - strategic platform placement
    const platformHeight = Math.max(25, height * 0.03);

    // Section 1 - Introduction to interactive enemies
    this.platforms.push({ x: width * 0.3, y: height * 0.7, width: width * 0.15, height: platformHeight });
    this.platforms.push({ x: width * 0.6, y: height * 0.6, width: width * 0.12, height: platformHeight });
    this.platforms.push({ x: width * 0.9, y: height * 0.5, width: width * 0.12, height: platformHeight });

    // Section 2 - Elevated combat platforms
    this.platforms.push({ x: width * 1.4, y: height * 0.65, width: width * 0.1, height: platformHeight });
    this.platforms.push({ x: width * 1.7, y: height * 0.55, width: width * 0.1, height: platformHeight });
    this.platforms.push({ x: width * 2.0, y: height * 0.45, width: width * 0.1, height: platformHeight });
    this.platforms.push({ x: width * 2.3, y: height * 0.35, width: width * 0.1, height: platformHeight });

    // Section 3 - Multi-level combat arena
    this.platforms.push({ x: width * 2.8, y: height * 0.6, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 3.1, y: height * 0.5, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 3.4, y: height * 0.4, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 3.7, y: height * 0.3, width: width * 0.08, height: platformHeight });
    this.platforms.push({ x: width * 4.0, y: height * 0.2, width: width * 0.08, height: platformHeight });

    // Section 4 - Sniper positions
    this.platforms.push({ x: width * 4.5, y: height * 0.7, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 4.8, y: height * 0.6, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 5.1, y: height * 0.5, width: width * 0.06, height: platformHeight });
    this.platforms.push({ x: width * 5.4, y: height * 0.4, width: width * 0.06, height: platformHeight });

    // Section 5 - Final gauntlet
    this.platforms.push({ x: width * 6.0, y: height * 0.65, width: width * 0.1, height: platformHeight });
    this.platforms.push({ x: width * 6.3, y: height * 0.55, width: width * 0.1, height: platformHeight });
    this.platforms.push({ x: width * 6.6, y: height * 0.45, width: width * 0.1, height: platformHeight });
    this.platforms.push({ x: width * 6.9, y: height * 0.35, width: width * 0.1, height: platformHeight });

    // Section 6 - Boss approach
    this.platforms.push({ x: width * 7.5, y: height * 0.6, width: width * 0.12, height: platformHeight });
    this.platforms.push({ x: width * 8.0, y: height * 0.5, width: width * 0.12, height: platformHeight });
    this.platforms.push({ x: width * 8.5, y: height * 0.4, width: width * 0.15, height: platformHeight });

    // Final platforms
    this.platforms.push({ x: width * 9.2, y: height * 0.55, width: width * 0.2, height: platformHeight });
    this.platforms.push({ x: width * 10.0, y: height * 0.45, width: width * 0.25, height: platformHeight });
  }

  protected spawnInteractiveEnemies(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const groundY = height - Math.round(height * 0.15) - 64;

    // Ground-based interactive enemies
    this.interactiveEnemies.push(new InteractiveEnemy(width * 0.8, groundY, 'SHOOTER'));
    this.interactiveEnemies.push(new InteractiveEnemy(width * 1.8, groundY, 'BOMBER'));
    this.interactiveEnemies.push(new InteractiveEnemy(width * 2.8, groundY, 'SHOOTER'));
    this.interactiveEnemies.push(new InteractiveEnemy(width * 4.2, groundY, 'SNIPER'));
    this.interactiveEnemies.push(new InteractiveEnemy(width * 5.5, groundY, 'BOMBER'));
    this.interactiveEnemies.push(new InteractiveEnemy(width * 7.0, groundY, 'SHOOTER'));
    this.interactiveEnemies.push(new InteractiveEnemy(width * 8.8, groundY, 'SNIPER'));

    // Platform-based interactive enemies
    this.interactiveEnemies.push(new InteractiveEnemy(width * 1.45, height * 0.62, 'SHOOTER'));
    this.interactiveEnemies.push(new InteractiveEnemy(width * 2.35, height * 0.32, 'SNIPER'));
    this.interactiveEnemies.push(new InteractiveEnemy(width * 3.45, height * 0.37, 'BOMBER'));
    this.interactiveEnemies.push(new InteractiveEnemy(width * 5.45, height * 0.37, 'SNIPER'));
    this.interactiveEnemies.push(new InteractiveEnemy(width * 6.95, height * 0.32, 'SHOOTER'));
  }

  protected spawnTurtles(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const groundY = height - Math.round(height * 0.15) - 64;

    // Regular turtles mixed with interactive enemies
    this.turtles.push(new Turtle(width * 0.5, groundY));
    this.turtles.push(new Turtle(width * 1.2, groundY));
    this.turtles.push(new Turtle(width * 2.1, groundY));
    this.turtles.push(new Turtle(width * 3.5, groundY));
    this.turtles.push(new Turtle(width * 4.8, groundY));
    this.turtles.push(new Turtle(width * 6.2, groundY));
    this.turtles.push(new Turtle(width * 7.8, groundY));
    this.turtles.push(new Turtle(width * 9.5, groundY));
  }

  protected spawnFlyingEnemies(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Flying enemies to add aerial threat
    this.flyingEnemies.push(new FlyingEnemy(width * 0.7, height * 0.4));
    this.flyingEnemies.push(new FlyingEnemy(width * 1.5, height * 0.3));
    this.flyingEnemies.push(new FlyingEnemy(width * 2.5, height * 0.25));
    this.flyingEnemies.push(new FlyingEnemy(width * 3.8, height * 0.15));
    this.flyingEnemies.push(new FlyingEnemy(width * 5.0, height * 0.3));
    this.flyingEnemies.push(new FlyingEnemy(width * 6.5, height * 0.25));
    this.flyingEnemies.push(new FlyingEnemy(width * 8.2, height * 0.3));
    this.flyingEnemies.push(new FlyingEnemy(width * 9.8, height * 0.35));
  }

  protected spawnPowerUps(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Strategic power-up placement for survival
    this.powerUps.push(new PowerUp(width * 0.4, height * 0.65, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 1.0, height * 0.45, PowerUpType.SHIELD));
    this.powerUps.push(new PowerUp(width * 1.75, height * 0.5, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 2.4, height * 0.3, PowerUpType.SPEED));
    this.powerUps.push(new PowerUp(width * 3.2, height * 0.45, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 4.1, height * 0.15, PowerUpType.SHIELD));
    this.powerUps.push(new PowerUp(width * 5.2, height * 0.45, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 6.4, height * 0.4, PowerUpType.JUMP));
    this.powerUps.push(new PowerUp(width * 7.6, height * 0.55, PowerUpType.HEALTH));
    this.powerUps.push(new PowerUp(width * 8.7, height * 0.35, PowerUpType.SHIELD));
    this.powerUps.push(new PowerUp(width * 10.2, height * 0.4, PowerUpType.HEALTH));
  }

  protected spawnFinishFlag(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const groundY = height - Math.round(height * 0.15);

    this.finishFlag = new FinishFlag(width * 11.5, groundY - 60);
  }

  public update(deltaTime: number): void {
    super.update(deltaTime);

    // Update interactive enemies
    this.interactiveEnemies.forEach(enemy => enemy.update(deltaTime));

    // Update projectiles
    this.projectiles = this.projectiles.filter(projectile => {
      projectile.update(deltaTime);
      return !projectile.shouldRemove();
    });

    // Check if interactive enemies should shoot
    if (this.player) {
      this.interactiveEnemies.forEach(enemy => {
        if (enemy.shouldShoot()) {
          const projectile = enemy.shoot(this.player!.x, this.player!.y);
          if (projectile) {
            this.projectiles.push(projectile);
          }
        }
      });
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);

    // Render interactive enemies
    this.interactiveEnemies.forEach(enemy => enemy.render(ctx));

    // Render projectiles
    this.projectiles.forEach(projectile => projectile.render(ctx));
  }

  public checkCollisions(player: Player): void {
    super.checkCollisions(player);

    // Check collisions with interactive enemies
    this.interactiveEnemies = this.interactiveEnemies.filter(enemy => {
      if (enemy.isDefeated()) return false;

      const enemyBounds = enemy.getBounds();
      const playerBounds = player.getBounds();

      if (
        playerBounds.x < enemyBounds.x + enemyBounds.width &&
        playerBounds.x + playerBounds.width > enemyBounds.x &&
        playerBounds.y < enemyBounds.y + enemyBounds.height &&
        playerBounds.y + playerBounds.height > enemyBounds.y
      ) {
        if (player.getVelocityY() > 0 && playerBounds.y + playerBounds.height <= enemyBounds.y + 10) {
          // Player defeats enemy by jumping on it
          enemy.takeDamage();
          player.setVelocityY(-200);
          this.particleSystem.addExplosion(enemyBounds.x + enemyBounds.width / 2, enemyBounds.y + enemyBounds.height / 2, '#FF4500');
        } else {
          // Player takes damage
          player.loseLife();
        }
      }

      return true;
    });

    // Check collisions with projectiles
    this.projectiles = this.projectiles.filter(projectile => {
      const projectileBounds = projectile.getBounds();
      const playerBounds = player.getBounds();

      if (
        playerBounds.x < projectileBounds.x + projectileBounds.width &&
        playerBounds.x + playerBounds.width > projectileBounds.x &&
        playerBounds.y < projectileBounds.y + projectileBounds.height &&
        playerBounds.y + playerBounds.height > projectileBounds.y
      ) {
        // Player hit by projectile
        player.loseLife();
        this.particleSystem.addExplosion(projectileBounds.x, projectileBounds.y, '#FF0000');
        return false; // Remove projectile
      }

      return true;
    });
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
      <div style="font-size: 8vh; margin-bottom: 3vh;">🎉 ULTIMATE VICTORY! 🎉</div>
      <div style="font-size: 4vh;">Master of Interactive Combat!</div>
      <div style="font-size: 3vh; margin-top: 2vh;">You have conquered all 6 levels!</div>
    `;
    document.body.appendChild(message);
  }
}