import { Game } from './game/Game';

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  const game = new Game(canvas);
  game.start();
});
