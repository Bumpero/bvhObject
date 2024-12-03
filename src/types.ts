export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export class AABB {
  min: Vector3;
  max: Vector3;

  constructor(min: Vector3, max: Vector3) {
    this.min = min;
    this.max = max;
  }

  intersects(other: AABB): boolean {
    return (
      this.min.x <= other.max.x &&
      this.max.x >= other.min.x &&
      this.min.y <= other.max.y &&
      this.max.y >= other.min.y &&
      this.min.z <= other.max.z &&
      this.max.z >= other.min.z
    );
  }
}
