import { Player } from './Player';

export abstract class BaseLevel {
  protected gameRunning: boolean = true;
  protected levelCompleted: boolean = false;

  abstract update(deltaTime: number): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
  abstract checkCollisions(player: Player): void;
  abstract getLevelWidth(): number;
  abstract getLevelHeight(): number;

  public isCompleted(): boolean {
    return this.levelCompleted;
  }

  public endGame(won: boolean): void {
    this.gameRunning = false;
    const message = document.createElement('div');
    message.textContent = won ? 'You Win! Restarting...' : 'Game Over! Restarting...';
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