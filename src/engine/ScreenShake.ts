/**
 * ScreenShake - Adds impactful screen shake effects
 * Makes the game feel more dynamic and responsive
 */
export class ScreenShake {
    private shakeIntensity: number = 0;
    private shakeDuration: number = 0;
    private shakeDecay: number = 0.9;
    private offsetX: number = 0;
    private offsetY: number = 0;

    /**
     * Trigger a screen shake effect
     * @param intensity - How strong the shake is (0-20 recommended)
     * @param duration - How long it lasts in milliseconds
     */
    public shake(intensity: number, duration: number): void {
        this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
        this.shakeDuration = Math.max(this.shakeDuration, duration);
    }

    /**
     * Update the shake effect
     * @param deltaTime - Time since last frame in milliseconds
     */
    public update(deltaTime: number): void {
        if (this.shakeDuration > 0) {
            this.shakeDuration -= deltaTime;

            // Generate random offset based on intensity
            this.offsetX = (Math.random() - 0.5) * this.shakeIntensity * 2;
            this.offsetY = (Math.random() - 0.5) * this.shakeIntensity * 2;

            // Decay the intensity over time
            this.shakeIntensity *= this.shakeDecay;

            // Stop shaking when duration ends
            if (this.shakeDuration <= 0) {
                this.shakeIntensity = 0;
                this.offsetX = 0;
                this.offsetY = 0;
            }
        }
    }

    /**
     * Apply shake offset to canvas
     * @param ctx - Canvas rendering context
     */
    public apply(ctx: CanvasRenderingContext2D): void {
        if (this.shakeIntensity > 0) {
            ctx.translate(this.offsetX, this.offsetY);
        }
    }

    /**
     * Reset shake offset (call after rendering)
     * @param ctx - Canvas rendering context
     */
    public reset(ctx: CanvasRenderingContext2D): void {
        if (this.shakeIntensity > 0) {
            ctx.translate(-this.offsetX, -this.offsetY);
        }
    }

    /**
     * Check if currently shaking
     */
    public isShaking(): boolean {
        return this.shakeIntensity > 0;
    }

    /**
     * Stop all shaking immediately
     */
    public stop(): void {
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    /**
     * Get current shake offset (useful for debugging)
     */
    public getOffset(): { x: number; y: number } {
        return { x: this.offsetX, y: this.offsetY };
    }
}
