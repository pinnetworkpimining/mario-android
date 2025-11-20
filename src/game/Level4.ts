import { FlyingEnemy } from './FlyingEnemy';
  protected createLevel(): void {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
  const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;

  this.levelWidth = width * 8; // Even longer level
  this.levelHeight = height;

  const groundHeight = Math.round(height * 0.1);
  this.platforms.push({ x: 0, y: height - groundHeight, width: this.levelWidth, height: groundHeight });

  // Hard level platforms
  const platformHeight = Math.max(18, height * 0.02);

  // Section 1 - Introduction
  this.platforms.push({ x: width * 0.2, y: height * 0.65, width: width * 0.1, height: platformHeight });
  this.platforms.push({ x: width * 0.4, y: height * 0.50, width: width * 0.08, height: platformHeight });
  this.platforms.push({ x: width * 0.6, y: height * 0.35, width: width * 0.08, height: platformHeight });

  // Section 2 - Precision jumps
  this.platforms.push({ x: width * 1.0, y: height * 0.60, width: width * 0.05, height: platformHeight });
  this.platforms.push({ x: width * 1.2, y: height * 0.45, width: width * 0.05, height: platformHeight });
  this.platforms.push({ x: width * 1.4, y: height * 0.30, width: width * 0.05, height: platformHeight });
  this.platforms.push({ x: width * 1.6, y: height * 0.15, width: width * 0.05, height: platformHeight });

  // Section 3 - Moving platforms simulation
  this.platforms.push({ x: width * 2.0, y: height * 0.65, width: width * 0.06, height: platformHeight });
  this.platforms.push({ x: width * 2.2, y: height * 0.50, width: width * 0.06, height: platformHeight });
  this.platforms.push({ x: width * 2.4, y: height * 0.35, width: width * 0.06, height: platformHeight });
  this.platforms.push({ x: width * 2.6, y: height * 0.20, width: width * 0.06, height: platformHeight });

  // Section 4 - Long jumps
  this.platforms.push({ x: width * 3.0, y: height * 0.60, width: width * 0.12, height: platformHeight });
  this.platforms.push({ x: width * 3.4, y: height * 0.50, width: width * 0.12, height: platformHeight });
  this.platforms.push({ x: width * 3.8, y: height * 0.40, width: width * 0.12, height: platformHeight });

  // Section 5 - Vertical climb
  this.platforms.push({ x: width * 4.2, y: height * 0.65, width: width * 0.05, height: platformHeight });
  this.platforms.push({ x: width * 4.3, y: height * 0.50, width: width * 0.05, height: platformHeight });
  this.platforms.push({ x: width * 4.4, y: height * 0.35, width: width * 0.05, height: platformHeight });
  this.platforms.push({ x: width * 4.5, y: height * 0.20, width: width * 0.05, height: platformHeight });

  // Section 6 - Final stretch
  this.platforms.push({ x: width * 5.0, y: height * 0.55, width: width * 0.08, height: platformHeight });
  this.platforms.push({ x: width * 5.3, y: height * 0.45, width: width * 0.08, height: platformHeight });
  this.platforms.push({ x: width * 5.6, y: height * 0.35, width: width * 0.08, height: platformHeight });
  this.platforms.push({ x: width * 5.9, y: height * 0.25, width: width * 0.08, height: platformHeight });

  // Section 7 - Boss preparation
  this.platforms.push({ x: width * 6.5, y: height * 0.60, width: width * 0.15, height: platformHeight });
  this.platforms.push({ x: width * 6.8, y: height * 0.45, width: width * 0.15, height: platformHeight });
  this.platforms.push({ x: width * 7.1, y: height * 0.30, width: width * 0.15, height: platformHeight });

  // Final platform
  this.platforms.push({ x: width * 7.5, y: height * 0.50, width: width * 0.20, height: platformHeight });
}

  protected spawnFlyingEnemies(): void {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
  const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;

  // Flying enemies everywhere
  this.flyingEnemies.push(new FlyingEnemy(width * 0.3, height * 0.55));
  this.flyingEnemies.push(new FlyingEnemy(width * 0.7, height * 0.35));
  this.flyingEnemies.push(new FlyingEnemy(width * 1.1, height * 0.25));
  this.flyingEnemies.push(new FlyingEnemy(width * 1.5, height * 0.45));
  this.flyingEnemies.push(new FlyingEnemy(width * 1.9, height * 0.15));
  this.flyingEnemies.push(new FlyingEnemy(width * 2.3, height * 0.55));
  this.flyingEnemies.push(new FlyingEnemy(width * 2.7, height * 0.30));
  this.flyingEnemies.push(new FlyingEnemy(width * 3.2, height * 0.40));
  this.flyingEnemies.push(new FlyingEnemy(width * 3.6, height * 0.20));
  this.flyingEnemies.push(new FlyingEnemy(width * 4.0, height * 0.50));
  this.flyingEnemies.push(new FlyingEnemy(width * 4.5, height * 0.35));
  this.flyingEnemies.push(new FlyingEnemy(width * 5.0, height * 0.25));
  this.flyingEnemies.push(new FlyingEnemy(width * 5.5, height * 0.45));
  this.flyingEnemies.push(new FlyingEnemy(width * 6.0, height * 0.15));
  this.flyingEnemies.push(new FlyingEnemy(width * 6.6, height * 0.50));
  this.flyingEnemies.push(new FlyingEnemy(width * 7.0, height * 0.30));
}

  protected spawnTurtles(): void {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
  const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;
  const groundHeight = Math.round(height * 0.10);
  const groundY = height - groundHeight;

  // Turtles everywhere
  this.turtles.push(new Turtle(width * 0.25, groundY - 32));
  this.turtles.push(new Turtle(width * 0.55, groundY - 32));
  this.turtles.push(new Turtle(width * 0.9, groundY - 32));
  this.turtles.push(new Turtle(width * 1.3, groundY - 32));
  this.turtles.push(new Turtle(width * 1.8, groundY - 32));
  this.turtles.push(new Turtle(width * 2.2, groundY - 32));
  this.turtles.push(new Turtle(width * 2.8, groundY - 32));
  this.turtles.push(new Turtle(width * 3.3, groundY - 32));
  this.turtles.push(new Turtle(width * 3.9, groundY - 32));
  this.turtles.push(new Turtle(width * 4.4, groundY - 32));
  this.turtles.push(new Turtle(width * 5.1, groundY - 32));
  this.turtles.push(new Turtle(width * 5.8, groundY - 32));
  this.turtles.push(new Turtle(width * 6.4, groundY - 32));
  this.turtles.push(new Turtle(width * 7.2, groundY - 32));

  // Platform turtles
  this.turtles.push(new Turtle(width * 0.4, height * 0.47));
  this.turtles.push(new Turtle(width * 1.4, height * 0.27));
  this.turtles.push(new Turtle(width * 2.4, height * 0.32));
  this.turtles.push(new Turtle(width * 3.4, height * 0.47));
  this.turtles.push(new Turtle(width * 4.4, height * 0.32));
  this.turtles.push(new Turtle(width * 5.6, height * 0.32));
  this.turtles.push(new Turtle(width * 6.8, height * 0.42));
}

  protected spawnPowerUps(): void {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
  const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;

  // Power-ups
  this.powerUps.push(new PowerUp(width * 0.2, height * 0.60, PowerUpType.HEALTH));
  this.powerUps.push(new PowerUp(width * 0.6, height * 0.30, PowerUpType.SPEED));
  this.powerUps.push(new PowerUp(width * 1.2, height * 0.40, PowerUpType.JUMP));
  this.powerUps.push(new PowerUp(width * 1.6, height * 0.10, PowerUpType.SHIELD));
  this.powerUps.push(new PowerUp(width * 2.2, height * 0.45, PowerUpType.HEALTH));
  this.powerUps.push(new PowerUp(width * 2.6, height * 0.15, PowerUpType.SPEED));
  this.powerUps.push(new PowerUp(width * 3.4, height * 0.45, PowerUpType.HEALTH));
  this.powerUps.push(new PowerUp(width * 4.3, height * 0.45, PowerUpType.JUMP));
  this.powerUps.push(new PowerUp(width * 5.3, height * 0.40, PowerUpType.SHIELD));
  this.powerUps.push(new PowerUp(width * 6.5, height * 0.55, PowerUpType.HEALTH));
  this.powerUps.push(new PowerUp(width * 7.1, height * 0.25, PowerUpType.HEALTH));
}

  protected spawnFinishFlag(): void {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1900;
  const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : 900;
  const groundY = height - Math.round(height * 0.10);

  // Place finish flag at the end
  this.finishFlag = new FinishFlag(width * 7.8, groundY - 80);
}

  public endGame(won: boolean): void {
  if(won) {
    this.showVictoryMessage();

    // Add a play again button
    const playAgainBtn = document.createElement('button');
    playAgainBtn.textContent = 'Play Again';
    playAgainBtn.style.cssText = `
        position: fixed;
        top: 65%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 2vw 4vw;
        font-size: 3vw;
        font-weight: bold;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        border: none;
        border-radius: 1vw;
        cursor: pointer;
        z-index: 1001;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      `;
    playAgainBtn.onclick = () => window.location.reload();
    document.body.appendChild(playAgainBtn);
  } else {
    this.showGameOverMessage();
    setTimeout(() => window.location.reload(), 2000);
}
  }

  protected showVictoryMessage(): void {
  const message = document.createElement('div');
  message.id = 'game-message';
  message.innerHTML = `
      <div style="font-size: 5vw; margin-bottom: 2vw;">🎉 VICTORY! 🎉</div>
      <div style="font-size: 3vw;">Congratulations!</div>
      <div style="font-size: 2.5vw; margin-top: 1vw;">You have completed all levels!</div>
    `;
  message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #FFD700;
      font-weight: bold;
      text-align: center;
      background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,50,0,0.95));
      padding: 4vw 6vw;
      border-radius: 2vw;
      border: 4px solid #FFD700;
      z-index: 1000;
      box-shadow: 0 0 30px rgba(255,215,0,0.8);
      animation: fadeIn 0.5s ease-in;
    `;
  document.body.appendChild(message);
}
}