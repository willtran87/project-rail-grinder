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
/** Streak length: the tail trails this many seconds of travel behind the head */
const TRAIL_SECONDS = 0.035;
/** New sparks are brighter than white so the bloom pass makes them glow */
const HEAT_GLOW = 2.4;

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
  /**
   * Sparks are drawn as short line streaks (head → tail along the direction
   * of travel), 2 vertices each: a bright hot head and a dim fading tail.
   */
  readonly streaks: THREE.LineSegments;
  private sparks: Spark[] = [];
  private positions: Float32Array;
  private colors: Float32Array;
  private geometry: THREE.BufferGeometry;

  /** How brightly the sparks would light their surroundings (see GrindEffects) */
  readonly sparkLight = { position: new THREE.Vector3(), intensity: 0 };

  /** Multiple emit points along the grinding section */
  private emitPoints: EmitPoint[] = [];
  private emitting = false;
  private intensity = 1;
  /** 0..1 stone heat (see setEmitPoints) */
  private heat = 0;
  /** Indices of dead sparks, ready to reuse (no searching through all 800) */
  private freeIdx: number[] = [];
  private aliveCount = 0;
  /** The buffers already show no sparks: nothing to update or upload */
  private idle = true;

  constructor() {
    // 2 vertices (head + tail) per spark
    this.positions = new Float32Array(MAX_SPARKS * 6);
    this.colors = new Float32Array(MAX_SPARKS * 6);

    for (let i = 0; i < MAX_SPARKS; i++) {
      this.sparks.push({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        age: 0,
        maxAge: SPARK_LIFETIME,
        alive: false,
      });
      // Hide all initially (park both ends below the ground)
      this.positions[i * 6 + 1] = -100;
      this.positions[i * 6 + 4] = -100;
      this.freeIdx.push(MAX_SPARKS - 1 - i); // pop() hands out 0, 1, 2 …
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.AdditiveBlending, // overlapping sparks add up to white-hot
      transparent: true,
      depthWrite: false,
    });

    this.streaks = new THREE.LineSegments(this.geometry, material);
    this.streaks.frustumCulled = false;

  }

  /**
   * Set multiple emit points (one per grindstone or grinding car).
   * Call each frame while grinding with all active grind positions.
   */
  /**
   * @param intensity - ~pressure / 50: more pressure, more sparks
   * @param heat - 0..1 stone heat: hot stones throw longer, whiter-hot sparks
   */
  setEmitPoints(points: EmitPoint[], intensity: number, heat = 0): void {
    this.emitPoints = points;
    this.intensity = intensity;
    this.heat = heat;
    this.emitting = true;
  }

  /** Spark colour: 'good' orange-white, 'off' dull red, 'over' blue-white */
  mode: 'good' | 'off' | 'over' = 'good';

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

    // Nothing alive and nothing on screen: skip the loop and the GPU upload
    if (this.aliveCount === 0 && this.idle) {
      this.sparkLight.intensity *= 0.9;
      this.streaks.visible = false;
      return;
    }
    this.streaks.visible = true;

    // Update existing sparks
    for (let i = 0; i < MAX_SPARKS; i++) {
      const spark = this.sparks[i];
      const v = i * 6; // head vertex at v, tail vertex at v + 3
      if (!spark.alive) {
        this.positions[v + 1] = -100;
        this.positions[v + 4] = -100;
        continue;
      }

      spark.age += dt;
      if (spark.age >= spark.maxAge) {
        spark.alive = false;
        this.freeIdx.push(i);
        this.aliveCount--;
        // park it now (the dead-spark branch above won't run until next frame)
        this.positions[v + 1] = -100;
        this.positions[v + 4] = -100;
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

      if (this.mode === 'over') { const k = 1 - t; r = r * 0.6 + 0.3 * k; g = g * 0.6 + 0.4 * k; b = Math.max(b, 0.95 * k); }
      else if (this.mode === 'off') { g *= 0.55; b *= 0.4; }

      // Head: hot (brighter than white early on → bloom), cooling with age
      // Hotter stones: sparks stay white-hot longer (and glow harder)
      const heat = 1 + (HEAT_GLOW * (1 + this.heat * 0.6) - 1) * (1 - t);
      this.colors[v] = r * heat;
      this.colors[v + 1] = g * heat;
      this.colors[v + 2] = b * heat;
      // Tail: same hue, much dimmer, so each streak fades out behind
      this.colors[v + 3] = r * 0.12;
      this.colors[v + 4] = g * 0.12;
      this.colors[v + 5] = b * 0.12;

      this.positions[v] = spark.position.x;
      this.positions[v + 1] = spark.position.y;
      this.positions[v + 2] = spark.position.z;
      this.positions[v + 3] = spark.position.x - spark.velocity.x * TRAIL_SECONDS;
      this.positions[v + 4] = spark.position.y - spark.velocity.y * TRAIL_SECONDS;
      this.positions[v + 5] = spark.position.z - spark.velocity.z * TRAIL_SECONDS;
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.idle = this.aliveCount === 0; // this upload already shows them all gone

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

  /**
   * One-off celebratory fountain: `count` sparks shooting up and outward
   * from `origin` (used when a section is completed).
   */
  burst(origin: THREE.Vector3, count: number): void {
    for (let i = 0; i < count; i++) {
      const spark = this.freeSpark();
      if (!spark) return;
      spark.alive = true;
      spark.age = 0;
      spark.maxAge = SPARK_LIFETIME * (0.7 + Math.random() * 0.6);
      spark.position.copy(origin);
      const a = Math.random() * Math.PI * 2;
      const out = 0.5 + Math.random() * 1.5;
      spark.velocity.set(Math.cos(a) * out, 4 + Math.random() * 4, Math.sin(a) * out);
    }
  }

  /** Find a spark slot that isn't in use (or null if all 800 are flying) */
  /** A dead spark to reuse (the caller makes it alive), or null if all 800 are flying */
  private freeSpark(): Spark | null {
    const i = this.freeIdx.pop();
    if (i === undefined) return null;
    this.aliveCount++;
    return this.sparks[i];
  }

  private emitSpark(ep: EmitPoint): void {
    const spark = this.freeSpark();
    if (!spark) return;

    spark.alive = true;
    spark.age = 0;
    spark.maxAge = SPARK_LIFETIME * (0.4 + Math.random() * 0.6) * (0.85 + this.heat * 0.5);

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
    (this.streaks.material as THREE.Material).dispose();
  }
}
