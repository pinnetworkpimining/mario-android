export interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'explosion' | 'trail' | 'sparkle' | 'smoke';
  rotation?: number;
  rotationSpeed?: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];

  public addExplosion(x: number, y: number, color: string = '#FFD700'): void {
    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15;
      const speed = 150 + Math.random() * 150;

      this.particles.push({
        x: x,
        y: y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        life: 1500,
        maxLife: 1500,
        color: color,
        size: 4 + Math.random() * 4,
        type: 'explosion',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2
      });
    }
  }

  public addTrail(x: number, y: number, velocityX: number, velocityY: number): void {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x + Math.random() * 10 - 5,
        y: y + Math.random() * 10 - 5,
        velocityX: velocityX * 0.1 + Math.random() * 30 - 15,
        velocityY: velocityY * 0.1 + Math.random() * 30 - 15,
        life: 800,
        maxLife: 800,
        color: '#00FFFF',
        size: 3 + Math.random() * 2,
        type: 'trail'
      });
    }
  }

  public addSparkles(x: number, y: number, count: number = 5): void {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + Math.random() * 20 - 10,
        y: y + Math.random() * 20 - 10,
        velocityX: Math.random() * 60 - 30,
        velocityY: Math.random() * 60 - 30,
        life: 1000,
        maxLife: 1000,
        color: '#FFD700',
        size: 2 + Math.random() * 2,
        type: 'sparkle',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3
      });
    }
  }

  public addSmoke(x: number, y: number): void {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x + Math.random() * 15 - 7.5,
        y: y + Math.random() * 15 - 7.5,
        velocityX: Math.random() * 40 - 20,
        velocityY: -Math.random() * 80 - 20,
        life: 2000,
        maxLife: 2000,
        color: '#666666',
        size: 6 + Math.random() * 4,
        type: 'smoke'
      });
    }
  }

  /**
   * Add coin collection sparkle effect
   */
  public addCoinSparkle(x: number, y: number): void {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = 100 + Math.random() * 50;

      this.particles.push({
        x: x,
        y: y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 50,
        life: 600,
        maxLife: 600,
        color: '#FFD700',
        size: 3 + Math.random() * 2,
        type: 'sparkle',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.4
      });
    }
  }

  /**
   * Add jump dust effect
   */
  public addJumpDust(x: number, y: number): void {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + Math.random() * 30 - 15,
        y: y,
        velocityX: Math.random() * 80 - 40,
        velocityY: -Math.random() * 40 - 20,
        life: 400,
        maxLife: 400,
        color: '#CCCCCC',
        size: 3 + Math.random() * 2,
        type: 'smoke'
      });
    }
  }

  /**
   * Add landing impact effect
   */
  public addLandingImpact(x: number, y: number): void {
    for (let i = 0; i < 8; i++) {
      const angle = Math.PI + (Math.random() - 0.5) * Math.PI;
      const speed = 80 + Math.random() * 60;

      this.particles.push({
        x: x,
        y: y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        life: 500,
        maxLife: 500,
        color: '#AAAAAA',
        size: 2 + Math.random() * 2,
        type: 'smoke'
      });
    }
  }

  /**
   * Add power-up collection effect
   */
  public addPowerUpEffect(x: number, y: number, color: string = '#FF00FF'): void {
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const speed = 120 + Math.random() * 100;

      this.particles.push({
        x: x,
        y: y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        life: 1000,
        maxLife: 1000,
        color: color,
        size: 4 + Math.random() * 3,
        type: 'sparkle',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.5
      });
    }
  }


  public update(deltaTime: number): void {
    const dt = deltaTime;

    this.particles = this.particles.filter(particle => {
      particle.life -= deltaTime;

      if (particle.life <= 0) {
        return false;
      }

      // Update position
      particle.x += particle.velocityX * dt;
      particle.y += particle.velocityY * dt;

      // Update rotation
      if (particle.rotation !== undefined && particle.rotationSpeed !== undefined) {
        particle.rotation += particle.rotationSpeed;
      }

      // Apply physics based on particle type
      switch (particle.type) {
        case 'explosion':
          particle.velocityY += 300 * dt; // Gravity
          particle.velocityX *= 0.95; // Air resistance
          particle.velocityY *= 0.98;
          break;
        case 'trail':
          particle.velocityY += 200 * dt; // Light gravity
          particle.velocityX *= 0.98; // Air resistance
          break;
        case 'sparkle':
          particle.velocityY += 100 * dt; // Very light gravity
          particle.velocityX *= 0.99;
          break;
        case 'smoke':
          particle.velocityY += 50 * dt; // Buoyancy (negative gravity)
          particle.velocityX *= 0.95;
          particle.velocityY *= 0.95;
          break;
      }

      return true;
    });
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;

      ctx.save();
      ctx.translate(particle.x, particle.y);

      if (particle.rotation !== undefined) {
        ctx.rotate(particle.rotation);
      }

      // Render based on particle type
      switch (particle.type) {
        case 'explosion':
          ctx.fillStyle = particle.color;
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = particle.size * 2;
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'trail':
          ctx.fillStyle = particle.color;
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = particle.size;
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'sparkle':
          ctx.fillStyle = particle.color;
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = particle.size * 3;
          // Draw star shape
          this.drawStar(ctx, 0, 0, 5, particle.size, particle.size * 0.5);
          break;

        case 'smoke':
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = alpha * 0.6;
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;
      }

      ctx.restore();
    });

    ctx.restore();
  }

  private drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number): void {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  public getParticleCount(): number {
    return this.particles.length;
  }

  public clear(): void {
    this.particles = [];
  }
}