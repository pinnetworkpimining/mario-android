export interface TouchButton {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  action: string;
  pressed: boolean;
}

export class TouchController {
  private buttons: TouchButton[] = [];
  private canvas: HTMLCanvasElement;
  private onKeyStateChange: (key: string, pressed: boolean) => void;

  constructor(canvas: HTMLCanvasElement, onKeyStateChange: (key: string, pressed: boolean) => void) {
    this.canvas = canvas;
    this.onKeyStateChange = onKeyStateChange;
    this.setupTouchButtons();
    this.setupEventListeners();
  }

  private setupTouchButtons(): void {
    const buttonSize = Math.min(window.innerWidth, window.innerHeight) * 0.12;
    const margin = 20;
    const bottomMargin = 40;

    this.buttons = [
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
        x: margin + buttonSize + 20,
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
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });

    window.addEventListener('resize', () => {
      this.setupTouchButtons();
    });
    
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.setupTouchButtons();
      }, 100);
    });
  }

  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
    
    for (const touch of Array.from(event.touches)) {
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      for (const button of this.buttons) {
        if (this.isPointInButton(x, y, button) && !button.pressed) {
          button.pressed = true;
          this.onKeyStateChange(button.action, true);
          break;
        }
      }
    }
  }

  private handleTouchMove(event: TouchEvent): void {
    event.preventDefault();
    
    // Reset all buttons first
    for (const button of this.buttons) {
      if (button.pressed) {
        button.pressed = false;
        this.onKeyStateChange(button.action, false);
      }
    }

    // Check current touches
    for (const touch of Array.from(event.touches)) {
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      for (const button of this.buttons) {
        if (this.isPointInButton(x, y, button) && !button.pressed) {
          button.pressed = true;
          this.onKeyStateChange(button.action, true);
          break;
        }
      }
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    
    // Reset all buttons that are no longer being touched
    for (const button of this.buttons) {
      let stillTouched = false;
      
      for (const touch of Array.from(event.touches)) {
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        if (this.isPointInButton(x, y, button)) {
          stillTouched = true;
          break;
        }
      }
      
      if (!stillTouched && button.pressed) {
        button.pressed = false;
        this.onKeyStateChange(button.action, false);
      }
    }
  }

  private isPointInButton(x: number, y: number, button: TouchButton): boolean {
    return x >= button.x && x <= button.x + button.width &&
           y >= button.y && y <= button.y + button.height;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    for (const button of this.buttons) {
      // Button background
      ctx.fillStyle = button.pressed ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(
        button.x + button.width / 2,
        button.y + button.height / 2,
        button.width / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Button border
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Button icon/text
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.font = `${button.width * 0.3}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let text = '';
      switch (button.action) {
        case 'ArrowLeft':
          text = '←';
          break;
        case 'ArrowRight':
          text = '→';
          break;
        case 'Space':
          text = '↑';
          break;
      }
      
      ctx.fillText(
        text,
        button.x + button.width / 2,
        button.y + button.height / 2
      );
    }
    
    ctx.restore();
  }

  public getButtons(): TouchButton[] {
    return this.buttons;
  }
}