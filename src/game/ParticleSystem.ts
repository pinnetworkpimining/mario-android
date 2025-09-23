export interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];

  public addExplosion(x: number, y: number, color: string = '#FFD700'): void {
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      const speed = 100 + Math.random() * 100;
      
      this.particles.push({
        x: x,
        y: y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        life: 1000,
        maxLife: 1000,
        color: color,
        size: 3 + Math.random() * 3
      });
    }
  }

  public addTrail(x: number, y: number, velocityX: number, velocityY: number): void {
    this.particles.push({
      x: x + Math.random() * 10 - 5,
      y: y + Math.random() * 10 - 5,
      velocityX: velocityX * 0.1 + Math.random() * 20 - 10,
      velocityY: velocityY * 0.1 + Math.random() * 20 - 10,
      life: 500,
      maxLife: 500,
      color: '#00FFFF',
      size: 2 + Math.random() * 2
    });
  }

  public update(deltaTime: number): void {
    const dt = deltaTime / 1000;

    this.particles = this.particles.filter(particle => {
      particle.life -= deltaTime;
      
      if (particle.life <= 0) {
        return false;
      }

      particle.x += particle.velocityX * dt;
      particle.y += particle.velocityY * dt;
      particle.velocityY += 200 * dt; // Gravity
      particle.velocityX *= 0.98; // Air resistance

      return true;
    });
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }

  public getParticleCount(): number {
    return this.particles.length;
  }
}