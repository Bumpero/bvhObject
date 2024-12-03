import { Vector3, AABB } from "./types";
import { CollisionAwareObject } from "./CollisionAwareObject";

class BVHNode {
  boundingBox: AABB;
  objects: CollisionAwareObject[];
  left: BVHNode | null;
  right: BVHNode | null;

  constructor(boundingBox: AABB, objects: CollisionAwareObject[] = []) {
    this.boundingBox = boundingBox;
    this.objects = objects;
    this.left = null;
    this.right = null;
  }

  isLeaf(): boolean {
    return this.left === null && this.right === null;
  }
}

export class CollisionAwareMap {
  root: BVHNode;

  constructor(objects: CollisionAwareObject[]) {
    const initialBox = this.computeBoundingBox(objects.map((obj) => obj.getAABB()));
    this.root = this.buildBVH(objects, initialBox);
  }

  private computeBoundingBox(aabbs: AABB[]): AABB {
    const min: Vector3 = {
      x: Math.min(...aabbs.map((a) => a.min.x)),
      y: Math.min(...aabbs.map((a) => a.min.y)),
      z: Math.min(...aabbs.map((a) => a.min.z)),
    };
    const max: Vector3 = {
      x: Math.max(...aabbs.map((a) => a.max.x)),
      y: Math.max(...aabbs.map((a) => a.max.y)),
      z: Math.max(...aabbs.map((a) => a.max.z)),
    };
    return new AABB(min, max);
  }

  private buildBVH(objects: CollisionAwareObject[], boundingBox: AABB): BVHNode {
    if (objects.length === 1) {
      return new BVHNode(boundingBox, objects);
    }

    const mid = Math.floor(objects.length / 2);
    objects.sort((a, b) => a.position.x - b.position.x);

    const leftObjects = objects.slice(0, mid);
    const rightObjects = objects.slice(mid);

    const leftBox = this.computeBoundingBox(leftObjects.map((obj) => obj.getAABB()));
    const rightBox = this.computeBoundingBox(rightObjects.map((obj) => obj.getAABB()));

    const node = new BVHNode(boundingBox);
    node.left = this.buildBVH(leftObjects, leftBox);
    node.right = this.buildBVH(rightObjects, rightBox);

    return node;
  }

  detectCollisions(): void {
    const detectCollisionsRecursive = (node: BVHNode): void => {
      if (node.isLeaf()) return;

      if (node.left && node.right) {
        this.checkCollisions(node.left.objects, node.right.objects);
      }
      if (node.left) detectCollisionsRecursive(node.left);
      if (node.right) detectCollisionsRecursive(node.right);
    };

    detectCollisionsRecursive(this.root);
  }

  private checkCollisions(objects1: CollisionAwareObject[], objects2: CollisionAwareObject[]): void {
    for (const obj1 of objects1) {
      for (const obj2 of objects2) {
        if (obj1.id !== obj2.id && obj1.getAABB().intersects(obj2.getAABB())) {
          obj1.recordCollision(obj2.id);
          obj2.recordCollision(obj1.id);
        }
      }
    }
  }
}
