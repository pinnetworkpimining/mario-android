/**
 * Professional Input System
 * Handles keyboard, touch, and gamepad input with proper event management
 */

import { Logger } from './Logger';

export interface InputState {
  keys: Map<string, boolean>;
  touches: Map<number, Touch>;
  mousePosition: { x: number; y: number };
  mouseButtons: Map<number, boolean>;
}

export interface TouchButton {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  action: string;
  pressed: boolean;
}

export class InputSystem {
  private logger: Logger;
  private canvas: HTMLCanvasElement;
  private inputState: InputState;
  private touchButtons: TouchButton[] = [];
  private callbacks: Map<string, Function[]> = new Map();
  private dpr: number;

  constructor(canvas: HTMLCanvasElement) {
    this.logger = Logger.getInstance();
    this.canvas = canvas;
    this.dpr = window.devicePixelRatio || 1;
    this.inputState = {
      keys: new Map(),
      touches: new Map(),
      mousePosition: { x: 0, y: 0 },
      mouseButtons: new Map()
    };

    this.setupEventListeners();
    this.setupTouchButtons();

    this.logger.info('InputSystem initialized');
  }

  private setupEventListeners(): void {
    // Keyboard events
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));

    // Mouse events
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));

    // Touch events - listen on document for better mobile support
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    document.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });

    // Window events
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
  }

  private setupTouchButtons(): void {
    const buttonSize = Math.min(window.innerWidth, window.innerHeight) * 0.2;
    const margin = 20;
    const bottomMargin = 30;

    console.log(`Setting up touch buttons. Window: ${window.innerWidth}x${window.innerHeight}, DPR: ${this.dpr}`);

    this.touchButtons = [
      {
        id: 'left',
        x: margin,
        y: window.innerHeight - buttonSize - bottomMargin,
        width: buttonSize,
        height: buttonSize,
        action: 'ArrowLeft',
        pressed: false
      },
      {
        id: 'right',
        x: margin + buttonSize + 15,
        y: window.innerHeight - buttonSize - bottomMargin,
        width: buttonSize,
        height: buttonSize,
        action: 'ArrowRight',
        pressed: false
      },
      {
        id: 'jump',
        x: window.innerWidth - buttonSize - margin,
        y: window.innerHeight - buttonSize - bottomMargin,
        width: buttonSize,
        height: buttonSize,
        action: 'Space',
        pressed: false
      }
    ];

    console.log('Touch buttons:', this.touchButtons);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.inputState.keys.set(event.code, true);
    this.emit('keydown', event.code);

    // Prevent default for game keys
    if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
      event.preventDefault();
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.inputState.keys.set(event.code, false);
    this.emit('keyup', event.code);
  }

  private handleMouseDown(event: MouseEvent): void {
    this.inputState.mouseButtons.set(event.button, true);
    this.updateMousePosition(event);
    this.emit('mousedown', { button: event.button, x: this.inputState.mousePosition.x, y: this.inputState.mousePosition.y });
  }

  private handleMouseUp(event: MouseEvent): void {
    this.inputState.mouseButtons.set(event.button, false);
    this.updateMousePosition(event);
    this.emit('mouseup', { button: event.button, x: this.inputState.mousePosition.x, y: this.inputState.mousePosition.y });
  }

  private handleMouseMove(event: MouseEvent): void {
    this.updateMousePosition(event);
  }

  private updateMousePosition(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.inputState.mousePosition.x = event.clientX - rect.left;
    this.inputState.mousePosition.y = event.clientY - rect.top;
  }

  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
    console.log('Touch start event received');

    for (const touch of Array.from(event.touches)) {
      this.inputState.touches.set(touch.identifier, touch);

      const x = touch.clientX;
      const y = touch.clientY;

      console.log(`Touch at (${x}, ${y}), window: ${window.innerWidth}x${window.innerHeight}`);

      // Check touch buttons
      for (const button of this.touchButtons) {
        console.log(`Checking button ${button.id} at (${button.x}, ${button.y}) size ${button.width}x${button.height}`);
        if (this.isPointInButton(x, y, button) && !button.pressed) {
          console.log(`Button ${button.id} pressed, setting key ${button.action}`);
          button.pressed = true;
          this.inputState.keys.set(button.action, true);
          this.emit('keydown', button.action);
          break;
        }
      }
    }
  }

  private handleTouchMove(event: TouchEvent): void {
    event.preventDefault();

    // Reset all buttons first
    for (const button of this.touchButtons) {
      if (button.pressed) {
        button.pressed = false;
        this.inputState.keys.set(button.action, false);
        this.emit('keyup', button.action);
      }
    }

    // Check current touches
    for (const touch of Array.from(event.touches)) {
      this.inputState.touches.set(touch.identifier, touch);

      const x = touch.clientX;
      const y = touch.clientY;

      for (const button of this.touchButtons) {
        if (this.isPointInButton(x, y, button) && !button.pressed) {
          button.pressed = true;
          this.inputState.keys.set(button.action, true);
          this.emit('keydown', button.action);
          break;
        }
      }
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    event.preventDefault();

    // Remove ended touches
    for (const touch of Array.from(event.changedTouches)) {
      this.inputState.touches.delete(touch.identifier);
    }

    // Reset buttons that are no longer being touched
    for (const button of this.touchButtons) {
      let stillTouched = false;

      for (const touch of Array.from(event.touches)) {
        const x = touch.clientX;
        const y = touch.clientY;

        if (this.isPointInButton(x, y, button)) {
          stillTouched = true;
          break;
        }
      }

      if (!stillTouched && button.pressed) {
        button.pressed = false;
        this.inputState.keys.set(button.action, false);
        this.emit('keyup', button.action);
      }
    }
  }

  private handleResize(): void {
    this.setupTouchButtons();
    this.emit('resize', { width: window.innerWidth, height: window.innerHeight });
  }

  private handleOrientationChange(): void {
    setTimeout(() => {
      this.setupTouchButtons();
      this.emit('orientationchange', window.orientation);
    }, 100);
  }

  private isPointInButton(x: number, y: number, button: TouchButton): boolean {
    return x >= button.x && x <= button.x + button.width &&
           y >= button.y && y <= button.y + button.height;
  }

  public isKeyPressed(key: string): boolean {
    return this.inputState.keys.get(key) || false;
  }

  public isMouseButtonPressed(button: number): boolean {
    return this.inputState.mouseButtons.get(button) || false;
  }

  public getMousePosition(): { x: number; y: number } {
    return { ...this.inputState.mousePosition };
  }

  public getTouchButtons(): TouchButton[] {
    return [...this.touchButtons];
  }

  public on(event: string, callback: Function): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
  }

  public off(event: string, callback: Function): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          this.logger.error(`Error in input callback for event: ${event}`, error);
        }
      });
    }
  }

  public update(deltaTime: number): void {
    // Input system update logic if needed
  }

  public clearKeys(): void {
    this.inputState.keys.clear();
    // Also reset touch buttons
    for (const button of this.touchButtons) {
      button.pressed = false;
    }
  }

  public renderTouchControls(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (const button of this.touchButtons) {
      const x = button.x;
      const y = button.y;
      const width = button.width;
      const height = button.height;

      // Button background
      ctx.fillStyle = button.pressed ? 'rgba(0, 255, 255, 0.9)' : 'rgba(0, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(
        x + width / 2,
        y + height / 2,
        width / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Button border
      ctx.strokeStyle = button.pressed ? '#ff00ff' : '#00ffff';
      ctx.lineWidth = 2;
      if (button.pressed) {
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 10;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Button icon
      ctx.fillStyle = button.pressed ? '#ffffff' : '#1a1a2e';
      ctx.font = `bold ${width * 0.4}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let text = '';
      switch (button.action) {
        case 'ArrowLeft': text = '←'; break;
        case 'ArrowRight': text = '→'; break;
        case 'Space': text = '↑'; break;
      }

      ctx.fillText(
        text,
        x + width / 2,
        y + height / 2
      );
    }

    ctx.restore();
  }
}