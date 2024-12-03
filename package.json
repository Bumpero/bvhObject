import { CollisionAwareObject } from "./src/CollisionAwareObject";
import { CollisionAwareMap } from "./src/CollisionAwareMap";

const objects = [
  new CollisionAwareObject("obj1", { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }),
  new CollisionAwareObject("obj2", { x: 2, y: 2, z: 2 }, { x: 1, y: 1, z: 1 }),
  new CollisionAwareObject("obj3", { x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }),
];

const map = new CollisionAwareMap(objects);

// Move objects
objects.forEach((obj, idx) => {
  obj.setVelocity({ x: idx * 0.5, y: idx * 0.5, z: 0 });
  obj.move();
});

// Detect collisions
map.detectCollisions();

// Log results
objects.forEach((obj) => {
  console.log(`Object ${obj.id} moved to:`, obj.getCurrentPosition());
  console.log(`Object ${obj.id} collided with:`, obj.getCollisionHistory());
});
