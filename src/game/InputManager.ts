export class InputManager {
  private keys: Map<string, boolean> = new Map();

  public setKeyState(key: string, pressed: boolean): void {
    this.keys.set(key, pressed);
    console.log(`Touch event: ${key} set to ${pressed}`);
  }

  public isKeyPressed(key: string): boolean {
    return this.keys.get(key) || false;
  }

  public isKeyJustPressed(key: string): boolean {
    // This would need to track previous frame state for proper implementation
    // For now, just return the current state
    return this.keys.get(key) || false;
  }

  public initializeTouchControls(): void {
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');
    const jumpButton = document.getElementById('jumpButton');

    if (leftButton) {
      leftButton.addEventListener('touchstart', () => this.setKeyState('ArrowLeft', true));
      leftButton.addEventListener('touchend', () => this.setKeyState('ArrowLeft', false));
      leftButton.addEventListener('mousedown', () => this.setKeyState('ArrowLeft', true));
      leftButton.addEventListener('mouseup', () => this.setKeyState('ArrowLeft', false));
    }

    if (rightButton) {
      rightButton.addEventListener('touchstart', () => this.setKeyState('ArrowRight', true));
      rightButton.addEventListener('touchend', () => this.setKeyState('ArrowRight', false));
      rightButton.addEventListener('mousedown', () => this.setKeyState('ArrowRight', true));
      rightButton.addEventListener('mouseup', () => this.setKeyState('ArrowRight', false));
    }

    if (jumpButton) {
      jumpButton.addEventListener('touchstart', () => this.setKeyState('Space', true));
      jumpButton.addEventListener('touchend', () => this.setKeyState('Space', false));
      jumpButton.addEventListener('mousedown', () => this.setKeyState('Space', true));
      jumpButton.addEventListener('mouseup', () => this.setKeyState('Space', false));
    }
  }
}
