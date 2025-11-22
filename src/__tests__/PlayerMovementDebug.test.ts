import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Player } from '../game/Player';
import { InputSystem } from '../engine/InputSystem';

describe('Player Movement Debug', () => {
    let player: Player;
    let inputSystem: InputSystem;
    let mockCanvas: HTMLCanvasElement;

    beforeEach(() => {
        // Create mock canvas
        mockCanvas = document.createElement('canvas');
        mockCanvas.width = 800;
        mockCanvas.height = 600;

        // Initialize input system
        inputSystem = new InputSystem(mockCanvas);
        player = new Player(100, 100);
    });

    it('should track position changes and time over multiple frames', () => {
        const initialX = player.x;
        const initialY = player.y;

        console.log(`[TEST] Initial Position: (${initialX}, ${initialY})`);

        // Simulate ArrowRight key press on DOCUMENT (where InputSystem listens)
        const keyDownEvent = new KeyboardEvent('keydown', { code: 'ArrowRight' });
        document.dispatchEvent(keyDownEvent);

        console.log('[TEST] KeyDown: ArrowRight dispatched to document');

        // Update loop simulation
        const fps = 60;
        const deltaTime = 1000 / fps; // ~16.67ms
        const totalFrames = 10;

        for (let i = 1; i <= totalFrames; i++) {
            const prevX = player.x;
            player.update(deltaTime, inputSystem);

            const diffX = player.x - prevX;
            console.log(`[TEST] Frame ${i}: deltaTime=${deltaTime.toFixed(2)}ms, x=${player.x.toFixed(2)} (diff=${diffX.toFixed(4)}), y=${player.y.toFixed(2)}`);

            // Verify movement occurred
            expect(player.x).toBeGreaterThan(prevX);
        }

        const totalDistance = player.x - initialX;
        console.log(`[TEST] Total distance moved in ${totalFrames} frames: ${totalDistance.toFixed(2)}`);

        expect(player.x).toBeGreaterThan(initialX);
        expect(totalDistance).toBeGreaterThan(10); // Should move a significant amount
    });

    it('should jump and change Y position', () => {
        player.setOnGround(true);
        const initialY = player.y;

        console.log(`[TEST] Initial Y (On Ground): ${initialY}`);

        // Simulate Space key press
        const keyDownEvent = new KeyboardEvent('keydown', { code: 'Space' });
        document.dispatchEvent(keyDownEvent);

        console.log('[TEST] KeyDown: Space dispatched to document');

        // Update
        player.update(0.016, inputSystem);

        console.log(`[TEST] After Jump Update: y=${player.y}, velocityY=${player.getVelocityY()}`);

        expect(player.getVelocityY()).toBeLessThan(0);
        // Note: Y might not change in the first frame depending on update order (vel applied then pos?), 
        // but velocity MUST be negative.
        // In Player.ts: velocityY = -jumpPower; then y += velocityY * dt;
        // So Y should decrease (move up) in the same frame.
        expect(player.y).toBeLessThan(initialY);
    });
});
