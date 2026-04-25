/**
 * SparkSystem - Grinding spark particles from multiple grindstone positions.
 *
 * The RG400 has 4 grinding cars, each with multiple grindstones.
 * Sparks spray from ALL active grinding points simultaneously,
 * creating the signature "river of fire" effect.
 */

import * as THREE from 'three';

const MAX_SPARKS = 800;
const GRAVITY = -9.8;
const SPARK_LIFETIME = 1.2;

interface Spark {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  age: number;
  maxAge: number;
  alive: boolean;
}

export interface EmitPoint {
  position: THREE.Vector3;
  forward: THREE.Vector3;
  right: THREE.Vector3;
}

export class SparkSystem {
  readonly points: THREE.Points;
  private sparks: Spark[] = [];
  private positions: Float32Array;
  private colors: Float32Array;
  private geometry: THREE.BufferGeometry;

  readonly sparkLight: THREE.PointLight;

  /** Multiple emit points along the grinding section */
  private emitPoints: EmitPoint[] = [];
  private emitting = false;
  private intensity = 1;

  constructor() {
    this.positions = new Float32Array(MAX_SPARKS * 3);
    this.colors = new Float32Array(MAX_SPARKS * 3);

    for (let i = 0; i < MAX_SPARKS; i++) {
      this.sparks.push({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        age: 0,
        maxAge: SPARK_LIFETIME,
        alive: false,
      });
      // Hide all initially
      this.positions[i * 3 + 1] = -100;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    const material = new THREE.PointsMaterial({
      size: 3,
      sizeAttenuation: false,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });

    this.points = new THREE.Points(this.geometry, material);
    this.points.frustumCulled = false;

    this.sparkLight = new THREE.PointLight(0xff8833, 0, 15);
  }

  /**
   * Set multiple emit points (one per grindstone or grinding car).
   * Call each frame while grinding with all active grind positions.
   */
  setEmitPoints(points: EmitPoint[], intensity: number): void {
    this.emitPoints = points;
    this.intensity = intensity;
    this.emitting = true;
  }

  stopEmitting(): void {
    this.emitting = false;
    this.emitPoints = [];
  }

  update(dt: number): void {
    // Emit new sparks from all points
    if (this.emitting && this.emitPoints.length > 0) {
      // Distribute sparks across all emit points
      const sparksPerPoint = Math.max(1, Math.floor((this.intensity * 6) / this.emitPoints.length));
      for (const ep of this.emitPoints) {
        for (let i = 0; i < sparksPerPoint; i++) {
          this.emitSpark(ep);
        }
      }
    }

    // Update existing sparks
    for (let i = 0; i < MAX_SPARKS; i++) {
      const spark = this.sparks[i];
      if (!spark.alive) {
        this.positions[i * 3 + 1] = -100;
        continue;
      }

      spark.age += dt;
      if (spark.age >= spark.maxAge) {
        spark.alive = false;
        continue;
      }

      // Physics
      spark.velocity.y += GRAVITY * dt;
      spark.position.addScaledVector(spark.velocity, dt);

      // Ground bounce
      if (spark.position.y < -0.5) {
        spark.position.y = -0.5;
        spark.velocity.y *= -0.3;
        spark.velocity.x *= 0.7;
        spark.velocity.z *= 0.7;
        spark.maxAge -= 0.2;
      }

      // Color: white → yellow → orange → red → dark
      const t = spark.age / spark.maxAge;
      let r: number, g: number, b: number;
      if (t < 0.1) {
        r = 1.0; g = 0.95; b = 0.7;
      } else if (t < 0.3) {
        r = 1.0; g = 0.7; b = 0.2;
      } else if (t < 0.6) {
        const s = (t - 0.3) / 0.3;
        r = 1.0; g = 0.7 - s * 0.5; b = 0.2 - s * 0.15;
      } else {
        const s = (t - 0.6) / 0.4;
        r = 1.0 - s * 0.6; g = 0.2 - s * 0.2; b = 0.05;
      }

      this.colors[i * 3] = r;
      this.colors[i * 3 + 1] = g;
      this.colors[i * 3 + 2] = b;

      this.positions[i * 3] = spark.position.x;
      this.positions[i * 3 + 1] = spark.position.y;
      this.positions[i * 3 + 2] = spark.position.z;
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;

    // Spark light follows the middle emit point
    if (this.emitting && this.emitPoints.length > 0) {
      const mid = this.emitPoints[Math.floor(this.emitPoints.length / 2)];
      this.sparkLight.position.copy(mid.position);
      this.sparkLight.position.y += 0.5;
      this.sparkLight.intensity = this.intensity * (2.5 + Math.random() * 2);
    } else {
      this.sparkLight.intensity *= 0.9;
    }
  }

  private emitSpark(ep: EmitPoint): void {
    let spark: Spark | null = null;
    for (const s of this.sparks) {
      if (!s.alive) { spark = s; break; }
    }
    if (!spark) return;

    spark.alive = true;
    spark.age = 0;
    spark.maxAge = SPARK_LIFETIME * (0.4 + Math.random() * 0.6);

    // Position at the emit point with slight random scatter
    spark.position.copy(ep.position);
    spark.position.x += (Math.random() - 0.5) * 0.3;
    spark.position.z += (Math.random() - 0.5) * 0.3;

    // Velocity: fan outward laterally
    const speed = 3 + Math.random() * 6;
    const sideDir = Math.random() > 0.5 ? 1 : -1;
    const lateralSpeed = speed * (0.4 + Math.random() * 0.6);
    const forwardSpeed = speed * (Math.random() - 0.3) * 0.4;
    const upSpeed = speed * (0.1 + Math.random() * 0.4);

    spark.velocity.set(0, 0, 0);
    spark.velocity.addScaledVector(ep.right, sideDir * lateralSpeed);
    spark.velocity.addScaledVector(ep.forward, forwardSpeed);
    spark.velocity.y = upSpeed;
  }

  dispose(): void {
    this.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}
