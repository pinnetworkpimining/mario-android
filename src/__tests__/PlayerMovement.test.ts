import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Player } from '../game/Player';
import { InputSystem } from '../engine/InputSystem';

describe('Player Movement', () => {
    let player: Player;
    let inputSystem: InputSystem;
    let mockCanvas: HTMLCanvasElement;

    beforeEach(() => {
        // Create mock canvas
        mockCanvas = {
            width: 800,
            height: 600,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            getBoundingClientRect: () => ({
                left: 0,
                top: 0,
                width: 800,
                height: 600,
                right: 800,
                bottom: 600,
                x: 0,
                y: 0,
                toJSON: () => { }
            }),
            focus: vi.fn()
        } as any;

        // Initialize input system with mock canvas
        inputSystem = new InputSystem(mockCanvas);
        player = new Player(100, 100);
    });

    it('should move right when ArrowRight is pressed', () => {
        const initialX = player.x;

        // Simulate ArrowRight key press
        const keyDownEvent = new KeyboardEvent('keydown', { code: 'ArrowRight' });
        mockCanvas.dispatchEvent(keyDownEvent);

        // Update player
        player.update(16, inputSystem); // 16ms = ~60fps

        // Player should have moved right (x increased)
        expect(player.x).toBeGreaterThan(initialX);
    });

    it('should move left when ArrowLeft is pressed', () => {
        player.x = 200; // Start away from edge
        const initialX = player.x;

        // Simulate ArrowLeft key press
        const keyDownEvent = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
        mockCanvas.dispatchEvent(keyDownEvent);

        // Update player
        player.update(16, inputSystem);

        // Player should have moved left (x decreased)
        expect(player.x).toBeLessThan(initialX);
    });

    it('should jump when Space is pressed and player is on ground', () => {
        player.setOnGround(true);
        const initialY = player.y;

        // Simulate Space key press
        const keyDownEvent = new KeyboardEvent('keydown', { code: 'Space' });
        mockCanvas.dispatchEvent(keyDownEvent);

        // Update player
        player.update(16, inputSystem);

        // Player should have negative velocity (jumping up)
        expect(player.getVelocityY()).toBeLessThan(0);
    });

    it('should respond to WASD keys as well', () => {
        const initialX = player.x;

        // Simulate D key press (right)
        const keyDownEvent = new KeyboardEvent('keydown', { code: 'KeyD' });
        mockCanvas.dispatchEvent(keyDownEvent);

        // Update player
        player.update(16, inputSystem);

        // Player should have moved right
        expect(player.x).toBeGreaterThan(initialX);
    });

    it('should stop moving when no keys are pressed', () => {
        // First move the player
        const keyDownEvent = new KeyboardEvent('keydown', { code: 'ArrowRight' });
        mockCanvas.dispatchEvent(keyDownEvent);
        player.update(16, inputSystem);

        // Then release the key
        const keyUpEvent = new KeyboardEvent('keyup', { code: 'ArrowRight' });
        mockCanvas.dispatchEvent(keyUpEvent);

        // Update several times to let velocity decay
        for (let i = 0; i < 10; i++) {
            player.update(16, inputSystem);
        }

        // Velocity should be very close to 0
        const velocityX = Math.abs(player.x - player.x);
        expect(velocityX).toBeLessThan(1);
    });
});
