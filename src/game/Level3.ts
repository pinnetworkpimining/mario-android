import { FlyingEnemy } from './FlyingEnemy';
import { Turtle } from './Turtle';
import { Level2 } from './Level2';

export class Level3 extends Level2 {
  protected platforms: Array<{ x: number; y: number; width: number; height: number }> = [];
  protected turtles: Turtle[] = [];
  protected flyingEnemies: FlyingEnemy[] = [];
  protected gameRunning: boolean = true;

  constructor() {
    super();
    this.createLevel();
    this.spawnEnemies();
  }

  protected createLevel(): void {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width : 1900;
    const height = canvas ? canvas.height : 900;
    const groundHeight = Math.round(height * 0.1);
    this.platforms.push({ x: 0, y: height - groundHeight, width: width, height: groundHeight });

    // More, smaller, and higher platforms for increased difficulty
    this.platforms.push({ x: width * 0.10, y: height * 0.55, width: width * 0.07, height: 18 });
    this.platforms.push({ x: width * 0.22, y: height * 0.45, width: width * 0.07, height: 18 });
    this.platforms.push({ x: width * 0.34, y: height * 0.35, width: width * 0.07, height: 18 });
    this.platforms.push({ x: width * 0.46, y: height * 0.25, width: width * 0.07, height: 18 });
    this.platforms.push({ x: width * 0.58, y: height * 0.15, width: width * 0.07, height: 18 });
    this.platforms.push({ x: width * 0.70, y: height * 0.25, width: width * 0.07, height: 18 });
    this.platforms.push({ x: width * 0.82, y: height * 0.35, width: width * 0.07, height: 18 });
    this.platforms.push({ x: width * 0.60, y: height * 0.60, width: width * 0.06, height: 18 });
  }

  protected spawnEnemies(): void {
    this.spawnTurtles();
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width : 1900;
    const height = canvas ? canvas.height : 900;
    // More flying enemies, placed above and between platforms
    this.flyingEnemies.push(new FlyingEnemy(width * 0.18, height * 0.40));
    this.flyingEnemies.push(new FlyingEnemy(width * 0.50, height * 0.20));
    this.flyingEnemies.push(new FlyingEnemy(width * 0.75, height * 0.30));
    this.flyingEnemies.push(new FlyingEnemy(width * 0.40, height * 0.50));
  }

  protected spawnTurtles(): void {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const width = canvas ? canvas.width : 1900;
    const height = canvas ? canvas.height : 900;
    const groundHeight = Math.round(height * 0.13);
    const groundY = height - groundHeight;
    // More turtles, some on ground, some on platforms
    this.turtles.push(new Turtle(width * 0.20, groundY - 32));
    this.turtles.push(new Turtle(width * 0.60, groundY - 32));
    this.turtles.push(new Turtle(width * 0.35, height * 0.32));
    this.turtles.push(new Turtle(width * 0.70, height * 0.22));
  }

  // update, render, checkCollisions inherited from Level2

  public endGame(won: boolean): void {
    if (won) {
      const message = document.createElement('div');
      message.textContent = 'Congratulations! You have completed the game!';
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

      // Add a play again button
      const playAgainBtn = document.createElement('button');
      playAgainBtn.textContent = 'Play Again';
      playAgainBtn.style.position = 'absolute';
      playAgainBtn.style.top = '60%';
      playAgainBtn.style.left = '50%';
      playAgainBtn.style.transform = 'translate(-50%, -50%)';
      playAgainBtn.style.padding = '10px 20px';
      playAgainBtn.style.fontSize = '18px';
      playAgainBtn.style.cursor = 'pointer';
      playAgainBtn.onclick = () => window.location.reload();
      document.body.appendChild(playAgainBtn);
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
