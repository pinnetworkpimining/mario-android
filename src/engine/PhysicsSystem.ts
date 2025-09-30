/**
 * Professional Physics System
 * Handles collision detection, physics simulation, and spatial partitioning
 */

import { Logger } from './Logger';

export interface Vector2 {
  x: number;
  y: number;
}

export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PhysicsBody {
  id: string;
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  bounds: AABB;
  mass: number;
  friction: number;
  restitution: number;
  isStatic: boolean;
  isGrounded: boolean;
  tags: Set<string>;
}

export interface CollisionInfo {
  bodyA: PhysicsBody;
  bodyB: PhysicsBody;
  normal: Vector2;
  penetration: number;
  point: Vector2;
}

export class PhysicsSystem {
  private logger: Logger;
  private bodies: Map<string, PhysicsBody> = new Map();
  private gravity: Vector2 = { x: 0, y: 980 }; // pixels/second²
  private spatialGrid: Map<string, Set<string>> = new Map();
  private gridSize: number = 100;
  private collisionCallbacks: Map<string, Function[]> = new Map();

  constructor() {
    this.logger = Logger.getInstance();
    this.logger.info('PhysicsSystem initialized');
  }

  public createBody(config: Partial<PhysicsBody> & { id: string; position: Vector2; bounds: AABB }): PhysicsBody {
    const body: PhysicsBody = {
      velocity: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      mass: 1,
      friction: 0.8,
      restitution: 0.2,
      isStatic: false,
      isGrounded: false,
      tags: new Set(),
      ...config
    };

    this.bodies.set(body.id, body);
    this.updateSpatialGrid(body);
    
    this.logger.debug(`Created physics body: ${body.id}`);
    return body;
  }

  public removeBody(id: string): void {
    const body = this.bodies.get(id);
    if (body) {
      this.removeFromSpatialGrid(body);
      this.bodies.delete(id);
      this.logger.debug(`Removed physics body: ${id}`);
    }
  }

  public getBody(id: string): PhysicsBody | undefined {
    return this.bodies.get(id);
  }

  public update(deltaTime: number): void {
    const dt = deltaTime;

    // Update all bodies
    for (const body of this.bodies.values()) {
      if (!body.isStatic) {
        this.updateBody(body, dt);
      }
    }

    // Check collisions
    this.checkCollisions();

    // Update spatial grid
    for (const body of this.bodies.values()) {
      this.updateSpatialGrid(body);
    }
  }

  private updateBody(body: PhysicsBody, deltaTime: number): void {
    // Apply gravity
    if (!body.isGrounded) {
      body.acceleration.x += this.gravity.x;
      body.acceleration.y += this.gravity.y;
    }

    // Update velocity
    body.velocity.x += body.acceleration.x * deltaTime;
    body.velocity.y += body.acceleration.y * deltaTime;

    // Apply friction
    if (body.isGrounded) {
      body.velocity.x *= Math.pow(body.friction, deltaTime);
    }

    // Update position
    body.position.x += body.velocity.x * deltaTime;
    body.position.y += body.velocity.y * deltaTime;

    // Update bounds
    body.bounds.x = body.position.x;
    body.bounds.y = body.position.y;

    // Reset acceleration
    body.acceleration.x = 0;
    body.acceleration.y = 0;

    // Reset grounded state (will be set by collision detection)
    body.isGrounded = false;
  }

  private checkCollisions(): void {
    const checkedPairs = new Set<string>();

    for (const body of this.bodies.values()) {
      const nearbyBodies = this.getNearbyBodies(body);
      
      for (const otherBody of nearbyBodies) {
        if (body.id === otherBody.id) continue;
        
        const pairKey = [body.id, otherBody.id].sort().join('-');
        if (checkedPairs.has(pairKey)) continue;
        checkedPairs.add(pairKey);

        const collision = this.checkAABBCollision(body, otherBody);
        if (collision) {
          this.resolveCollision(collision);
          this.emitCollision(collision);
        }
      }
    }
  }

  private checkAABBCollision(bodyA: PhysicsBody, bodyB: PhysicsBody): CollisionInfo | null {
    const a = bodyA.bounds;
    const b = bodyB.bounds;

    if (a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y) {
      
      // Calculate overlap
      const overlapX = Math.min(a.x + a.width - b.x, b.x + b.width - a.x);
      const overlapY = Math.min(a.y + a.height - b.y, b.y + b.height - a.y);

      // Determine collision normal and penetration
      let normal: Vector2;
      let penetration: number;

      if (overlapX < overlapY) {
        // Horizontal collision
        normal = { x: a.x < b.x ? -1 : 1, y: 0 };
        penetration = overlapX;
      } else {
        // Vertical collision
        normal = { x: 0, y: a.y < b.y ? -1 : 1 };
        penetration = overlapY;
      }

      const point: Vector2 = {
        x: (a.x + a.width / 2 + b.x + b.width / 2) / 2,
        y: (a.y + a.height / 2 + b.y + b.height / 2) / 2
      };

      return {
        bodyA,
        bodyB,
        normal,
        penetration,
        point
      };
    }

    return null;
  }

  private resolveCollision(collision: CollisionInfo): void {
    const { bodyA, bodyB, normal, penetration } = collision;

    // Don't resolve if both bodies are static
    if (bodyA.isStatic && bodyB.isStatic) return;

    // Calculate relative velocity
    const relativeVelocity: Vector2 = {
      x: bodyA.velocity.x - bodyB.velocity.x,
      y: bodyA.velocity.y - bodyB.velocity.y
    };

    // Calculate relative velocity in collision normal direction
    const velAlongNormal = relativeVelocity.x * normal.x + relativeVelocity.y * normal.y;

    // Don't resolve if velocities are separating
    if (velAlongNormal > 0) return;

    // Calculate restitution
    const restitution = Math.min(bodyA.restitution, bodyB.restitution);

    // Calculate impulse scalar
    let impulseScalar = -(1 + restitution) * velAlongNormal;
    impulseScalar /= (1 / bodyA.mass) + (1 / bodyB.mass);

    // Apply impulse
    const impulse: Vector2 = {
      x: impulseScalar * normal.x,
      y: impulseScalar * normal.y
    };

    if (!bodyA.isStatic) {
      bodyA.velocity.x += impulse.x / bodyA.mass;
      bodyA.velocity.y += impulse.y / bodyA.mass;
    }

    if (!bodyB.isStatic) {
      bodyB.velocity.x -= impulse.x / bodyB.mass;
      bodyB.velocity.y -= impulse.y / bodyB.mass;
    }

    // Positional correction to prevent sinking
    const percent = 0.8; // Usually 20% to 80%
    const slop = 0.01; // Usually 0.01 to 0.1
    const correction = Math.max(penetration - slop, 0) / ((1 / bodyA.mass) + (1 / bodyB.mass)) * percent;

    const correctionVector: Vector2 = {
      x: correction * normal.x,
      y: correction * normal.y
    };

    if (!bodyA.isStatic) {
      bodyA.position.x += correctionVector.x / bodyA.mass;
      bodyA.position.y += correctionVector.y / bodyA.mass;
    }

    if (!bodyB.isStatic) {
      bodyB.position.x -= correctionVector.x / bodyB.mass;
      bodyB.position.y -= correctionVector.y / bodyB.mass;
    }

    // Set grounded state for vertical collisions
    if (Math.abs(normal.y) > 0.7) {
      if (normal.y < 0 && !bodyA.isStatic) {
        bodyA.isGrounded = true;
      }
      if (normal.y > 0 && !bodyB.isStatic) {
        bodyB.isGrounded = true;
      }
    }
  }

  private updateSpatialGrid(body: PhysicsBody): void {
    // Remove from old grid cells
    this.removeFromSpatialGrid(body);

    // Add to new grid cells
    const minX = Math.floor(body.bounds.x / this.gridSize);
    const maxX = Math.floor((body.bounds.x + body.bounds.width) / this.gridSize);
    const minY = Math.floor(body.bounds.y / this.gridSize);
    const maxY = Math.floor((body.bounds.y + body.bounds.height) / this.gridSize);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const key = `${x},${y}`;
        if (!this.spatialGrid.has(key)) {
          this.spatialGrid.set(key, new Set());
        }
        this.spatialGrid.get(key)!.add(body.id);
      }
    }
  }

  private removeFromSpatialGrid(body: PhysicsBody): void {
    for (const [key, bodies] of this.spatialGrid.entries()) {
      bodies.delete(body.id);
      if (bodies.size === 0) {
        this.spatialGrid.delete(key);
      }
    }
  }

  private getNearbyBodies(body: PhysicsBody): PhysicsBody[] {
    const nearbyIds = new Set<string>();
    
    const minX = Math.floor(body.bounds.x / this.gridSize);
    const maxX = Math.floor((body.bounds.x + body.bounds.width) / this.gridSize);
    const minY = Math.floor(body.bounds.y / this.gridSize);
    const maxY = Math.floor((body.bounds.y + body.bounds.height) / this.gridSize);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const key = `${x},${y}`;
        const bodies = this.spatialGrid.get(key);
        if (bodies) {
          bodies.forEach(id => nearbyIds.add(id));
        }
      }
    }

    return Array.from(nearbyIds)
      .filter(id => id !== body.id)
      .map(id => this.bodies.get(id)!)
      .filter(Boolean);
  }

  public onCollision(bodyId: string, callback: (collision: CollisionInfo) => void): void {
    if (!this.collisionCallbacks.has(bodyId)) {
      this.collisionCallbacks.set(bodyId, []);
    }
    this.collisionCallbacks.get(bodyId)!.push(callback);
  }

  private emitCollision(collision: CollisionInfo): void {
    const callbacksA = this.collisionCallbacks.get(collision.bodyA.id);
    const callbacksB = this.collisionCallbacks.get(collision.bodyB.id);

    if (callbacksA) {
      callbacksA.forEach(callback => {
        try {
          callback(collision);
        } catch (error) {
          this.logger.error(`Error in collision callback for ${collision.bodyA.id}`, error);
        }
      });
    }

    if (callbacksB) {
      callbacksB.forEach(callback => {
        try {
          callback(collision);
        } catch (error) {
          this.logger.error(`Error in collision callback for ${collision.bodyB.id}`, error);
        }
      });
    }
  }

  public setGravity(x: number, y: number): void {
    this.gravity.x = x;
    this.gravity.y = y;
  }

  public getGravity(): Vector2 {
    return { ...this.gravity };
  }

  public getAllBodies(): PhysicsBody[] {
    return Array.from(this.bodies.values());
  }
}