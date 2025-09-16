export class InputManager {
  private keys: Map<string, boolean> = new Map();

  public setKeyState(key: string, pressed: boolean): void {
    this.keys.set(key, pressed);
  }

  public isKeyPressed(key: string): boolean {
    return this.keys.get(key) || false;
  }

  public isKeyJustPressed(key: string): boolean {
    // This would need to track previous frame state for proper implementation
    // For now, just return the current state
    return this.keys.get(key) || false;
  }
}
