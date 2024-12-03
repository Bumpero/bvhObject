import { Vector3, AABB } from "./types";

export class CollisionAwareObject {
  id: string;
  position: Vector3;
  size: Vector3;
  velocity: Vector3;
  movementHistory: Vector3[];
  collisionHistory: Set<string>;

  constructor(id: string, position: Vector3, size: Vector3, velocity: Vector3 = { x: 0, y: 0, z: 0 }) {
    this.id = id;
    this.position = position;
    this.size = size;
    this.velocity = velocity;
    this.movementHistory = [position];
    this.collisionHistory = new Set<string>();
  }

  move(): void {
    this.position = {
      x: this.position.x + this.velocity.x,
      y: this.position.y + this.velocity.y,
      z: this.position.z + this.velocity.z,
    };
    this.movementHistory.push({ ...this.position });
  }

  getCurrentPosition(): Vector3 {
    return { ...this.position };
  }

  getMovementHistory(): Vector3[] {
    return [...this.movementHistory];
  }

  getTotalDistanceTraveled(): number {
    let totalDistance = 0;
    for (let i = 1; i < this.movementHistory.length; i++) {
      const prev = this.movementHistory[i - 1];
      const curr = this.movementHistory[i];
      totalDistance += Math.sqrt(
        Math.pow(curr.x - prev.x, 2) +
        Math.pow(curr.y - prev.y, 2) +
        Math.pow(curr.z - prev.z, 2)
      );
    }
    return totalDistance;
  }

  getVelocity(): Vector3 {
    return { ...this.velocity };
  }

  setVelocity(newVelocity: Vector3): void {
    this.velocity = { ...newVelocity };
  }

  resetMovementHistory(): void {
    this.movementHistory = [{ ...this.position }];
  }

  getCollisionHistory(): string[] {
    return Array.from(this.collisionHistory);
  }

  clearCollisionHistory(): void {
    this.collisionHistory.clear();
  }

  recordCollision(otherId: string): void {
    this.collisionHistory.add(otherId);
  }

  getAABB(): AABB {
    const min = {
      x: this.position.x - this.size.x / 2,
      y: this.position.y - this.size.y / 2,
      z: this.position.z - this.size.z / 2,
    };
    const max = {
      x: this.position.x + this.size.x / 2,
      y: this.position.y + this.size.y / 2,
      z: this.position.z + this.size.z / 2,
    };
    return new AABB(min, max);
  }
}
