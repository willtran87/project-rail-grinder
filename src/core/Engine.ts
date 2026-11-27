/**
 * Engine - Sets up the Three.js renderer, scene, camera, lighting,
 * and the main animation loop.
 *
 * Uses a pixel art rendering pipeline: the scene is rendered to a
 * low-resolution render target, then upscaled to the screen with
 * nearest-neighbor filtering for crisp, chunky pixels.
 */

import * as THREE from 'three';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SHADOW_LAYER } from './bakeStatic';

/** How many times to divide the screen resolution for the pixel look.
 *  3 = each "pixel" is 3x3 screen pixels. Adjust for more/less chunky. */
/**
 * How many screen pixels make one game pixel. At least 2 (mild pixelation,
 * detail readable but stylized); on big screens it grows in whole steps so the
 * game always renders about TARGET_ROWS rows: 1080p → 2, 1440p → 3, 4K → 4.
 * That keeps the same chunky look on every screen and stops a 4K monitor
 * costing four times as much to draw. (Whole numbers only: an uneven scale
 * would make some pixels wider than others.)
 */
const TARGET_ROWS = 540;
export function pixelScaleFor(screenHeight: number): number {
  return Math.max(2, Math.round(screenHeight / TARGET_ROWS));
}

/** Half the width of the sun's shadow box (metres) */
const SHADOW_HALF_SIZE = 35;

/**
 * Bloom blur levels. three.js uses 5; at our half-resolution pixel-art target
 * the two widest levels are only a few pixels across, so 3 look the same and
 * save four render passes. Their strength is folded into the levels we keep.
 */
const BLOOM_LEVELS = 3;

/**
 * Final full-screen shader: takes the low-res HDR scene (with bloom already
 * added), applies tone mapping + sRGB output, then a simple colour grade:
 *   lift  = colour added to the shadows   (e.g. cool blue at night)
 *   gain  = colour multiplied into highlights (e.g. warm gold at dusk)
 *   saturation / contrast = overall punch
 * DayNightCycle changes these per time of day.
 */
const OUTPUT_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const OUTPUT_FRAGMENT = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform vec3 uLift;
  uniform vec3 uGain;
  uniform float uSaturation;
  uniform float uContrast;
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(texture2D(tDiffuse, vUv).rgb, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    vec3 c = gl_FragColor.rgb;
    c = c * uGain + uLift * (1.0 - c);
    float luma = dot(c, vec3(0.299, 0.587, 0.114));
    c = mix(vec3(luma), c, uSaturation);
    c = (c - 0.5) * uContrast + 0.5;
    gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
  }
`;

/** Colour-grade controls (see OUTPUT_FRAGMENT) */
export interface GradeUniforms {
  uLift: { value: THREE.Color };
  uGain: { value: THREE.Color };
  uSaturation: { value: number };
  uContrast: { value: number };
}

export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly clock: { getDelta: () => number };

  // Lighting references so other systems can adjust them
  readonly directionalLight: THREE.DirectionalLight;
  readonly ambientLight: THREE.HemisphereLight;

  // Pixel art rendering pipeline
  private renderTarget: THREE.WebGLRenderTarget;
  private pixelQuadScene: THREE.Scene;
  private pixelQuadCamera: THREE.OrthographicCamera;

  /** Glow around anything brighter than white (sparks, sun, lights). Tuned per time of day. */
  readonly bloom: UnrealBloomPass;
  /** Height of the low-res render target in pixels (for point-sprite sizing) */
  get renderHeight(): number { return this.renderTarget.height; }

  private pendingCapture: ((blob: Blob | null) => void) | null = null;

  /**
   * Grab the next finished frame as a PNG. (WebGL clears the canvas after
   * each frame, so we read it immediately after drawing, inside animate().)
   */
  captureFrame(): Promise<Blob | null> {
    return new Promise((resolve) => { this.pendingCapture = resolve; });
  }

  /**
   * Most frames per second to run (0 = as many as the screen shows).
   * Set from the graphics quality preset.
   */
  fpsCap = 0;
  /** When the next frame is due (ms, requestAnimationFrame clock) */
  private nextFrameAt = 0;

  /** Turn bloom off on slow machines (a future graphics-quality setting) */
  bloomEnabled = true;
  /** Colour grade uniforms. Tuned per time of day by DayNightCycle. */
  readonly grade: GradeUniforms;

  private updateCallbacks: Array<(dt: number) => void> = [];
  private resizeHandler: () => void;

  constructor(canvas: HTMLCanvasElement) {
    // Renderer setup - NO antialiasing for pixel art
    // (No logarithmic depth buffer: with near 0.5 m / far 800 m a normal depth
    // buffer has plenty of precision, and the log version writes depth from the
    // fragment shader, which stops the GPU skipping hidden pixels early.)
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
    });
    this.renderer.setPixelRatio(1); // fixed at 1 for pixel art
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.autoClear = false;
    // Count draw calls for the whole frame (scene + bloom + output), not per
    // render() call — the FPS overlay shows them
    this.renderer.info.autoReset = false;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);
    this.scene.fog = new THREE.Fog(0x1a1a2e, 50, 200);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.5,  // higher near plane prevents z-fighting
      800
    );
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);

    // Timer for delta time (replaces deprecated THREE.Clock)
    let lastTime = performance.now();
    this.clock = {
      getDelta: () => {
        const now = performance.now();
        const dt = (now - lastTime) / 1000;
        lastTime = now;
        return Math.min(dt, 0.1); // cap at 100ms to prevent huge jumps
      }
    };

    // --- Pixel art render target ---
    // Render at 1/scale resolution, then stretch to fill screen
    const scale0 = pixelScaleFor(window.innerHeight);
    const lowW = Math.floor(window.innerWidth / scale0);
    const lowH = Math.floor(window.innerHeight / scale0);

    // HalfFloat (not 8-bit) so colours brighter than white survive until tone
    // mapping — that's what lets sparks and the sun glow instead of clipping.
    this.renderTarget = new THREE.WebGLRenderTarget(lowW, lowH, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      depthBuffer: true,
      stencilBuffer: false,
    });

    // Bloom runs at the same low resolution, so the glow stays pixel-art chunky.
    // threshold: only linear brightness above ~0.9 glows (sparks, sun, lamps)
    this.bloom = new UnrealBloomPass(new THREE.Vector2(lowW, lowH), 0.4, 0.5, 0.9);
    this.trimBloomLevels();

    // Fullscreen quad to display the pixelated render (tone map + colour grade)
    this.pixelQuadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.pixelQuadScene = new THREE.Scene();
    const quadGeo = new THREE.PlaneGeometry(2, 2);
    this.grade = {
      uLift: { value: new THREE.Color(0, 0, 0) },
      uGain: { value: new THREE.Color(1, 1, 1) },
      uSaturation: { value: 1 },
      uContrast: { value: 1 },
    };
    const quadMat = new THREE.ShaderMaterial({
      uniforms: { tDiffuse: { value: this.renderTarget.texture }, ...this.grade },
      vertexShader: OUTPUT_VERTEX,
      fragmentShader: OUTPUT_FRAGMENT,
      depthTest: false,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(quadGeo, quadMat);
    this.pixelQuadScene.add(quad);

    // --- Lighting ---
    // Hemisphere light: sky color (blue-ish) and ground color (warm)
    this.ambientLight = new THREE.HemisphereLight(0x4466aa, 0x443322, 0.5);
    this.scene.add(this.ambientLight);

    // Directional light (moon/sun) - lower shadow resolution for pixel look
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    this.directionalLight.position.set(10, 20, 10);
    this.directionalLight.castShadow = true;
    // 1024 is plenty: the scene renders at half resolution, and the shadow box
    // sits just ahead of the camera (DayNightCycle), so 70 m covers everything
    // close enough for a shadow to be more than a pixel or two
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.near = 1;
    this.directionalLight.shadow.camera.far = 200;
    this.directionalLight.shadow.camera.left = -SHADOW_HALF_SIZE;
    this.directionalLight.shadow.camera.right = SHADOW_HALF_SIZE;
    this.directionalLight.shadow.camera.top = SHADOW_HALF_SIZE;
    this.directionalLight.shadow.camera.bottom = -SHADOW_HALF_SIZE;
    this.directionalLight.shadow.bias = -0.002;
    this.directionalLight.shadow.normalBias = 0.02;
    // The shadow map also draws the shadow-only proxy meshes (see bakeStatic)
    this.directionalLight.shadow.camera.layers.enable(SHADOW_LAYER);
    this.scene.add(this.directionalLight);

    // Handle window resize
    this.resizeHandler = this.onResize.bind(this);
    window.addEventListener('resize', this.resizeHandler);

    // Start the animation loop
    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  /**
   * Run bloom with fewer blur levels (see BLOOM_LEVELS). The pass loops over
   * `nMips`; the composite shader still reads all five textures, so the unused
   * ones get a weight of 0 and their share goes to the widest level we keep.
   */
  private trimBloomLevels(): void {
    const bloom = this.bloom as unknown as {
      nMips: number;
      bloomTintColors: THREE.Vector3[];
      compositeMaterial: THREE.ShaderMaterial;
    };
    const factors = bloom.compositeMaterial.uniforms.bloomFactors.value as number[];
    let dropped = 0;
    for (let i = BLOOM_LEVELS; i < factors.length; i++) { dropped += factors[i]; factors[i] = 0; }
    factors[BLOOM_LEVELS - 1] += dropped;
    bloom.nMips = BLOOM_LEVELS;
  }

  /**
   * Return true when nothing on screen can change (pause menu, job select,
   * reports): the 3D scene is then not drawn at all and the browser keeps
   * showing the last frame. Saves the whole GPU cost while in menus.
   */
  renderHold: () => boolean = () => false;
  /** Draw the next frame even if held (the canvas was cleared by a resize) */
  private forceFrame = true;

  /** True while shaders are being compiled in the background (see prewarm) */
  private compiling = false;

  /**
   * Compile every material's shader for the current scene and lights now,
   * in the background where the browser supports it. Call after building a
   * job's world or changing anything that changes shaders (shadows on/off).
   * While it runs, the last frame stays on screen instead of the game
   * freezing for a second or more mid-play.
   */
  prewarm(): void {
    this.compiling = true;
    // Compile for the low-res target the scene is really drawn into: shaders
    // for the screen (tone mapped, sRGB) are different programs
    const previous = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.renderTarget);
    const done = this.renderer.compileAsync(this.scene, this.camera);
    this.renderer.setRenderTarget(previous);
    done
      .catch(() => { /* fall back to compiling on first draw */ })
      .finally(() => { this.compiling = false; });
  }

  /** Register a callback to be called every frame with delta time */
  onUpdate(callback: (dt: number) => void): void {
    this.updateCallbacks.push(callback);
  }

  /** Remove an update callback */
  offUpdate(callback: (dt: number) => void): void {
    const idx = this.updateCallbacks.indexOf(callback);
    if (idx !== -1) this.updateCallbacks.splice(idx, 1);
  }

  private animate(time: number): void {
    // Frame cap: skip screen refreshes until the next frame is due. The due
    // time advances in fixed steps, so a 144 Hz screen averages a true 60 fps
    // (alternating 2 and 3 refreshes) instead of dropping to 48.
    if (this.fpsCap > 0) {
      const interval = 1000 / this.fpsCap;
      if (time < this.nextFrameAt - 1) return;
      this.nextFrameAt = Math.max(this.nextFrameAt + interval, time - interval);
    }
    const dt = this.clock.getDelta();

    // Call all registered update functions
    for (const cb of this.updateCallbacks) {
      cb(dt);
    }

    // Nothing can change (menus, pause): keep the last frame, draw nothing
    if (this.renderHold() && !this.forceFrame && !this.pendingCapture) return;
    this.forceFrame = false;

    // Shaders still compiling in the background: keep showing the last frame
    if (this.compiling) {
      this.renderer.setRenderTarget(null);
      this.renderer.clear();
      this.renderer.render(this.pixelQuadScene, this.pixelQuadCamera);
      return;
    }

    // Step 1: Render the scene to the low-res render target
    this.renderer.info.reset(); // stats (draw calls etc.) cover the whole frame
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

    // Step 1b: Add bloom (glow) on top of the low-res image, in place
    if (this.bloomEnabled) {
      this.bloom.render(this.renderer, null as unknown as THREE.WebGLRenderTarget, this.renderTarget, dt, false);
    }

    // Step 2: Draw the low-res texture to the screen (upscaled with nearest filter)
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.pixelQuadScene, this.pixelQuadCamera);

    // Screenshot requested? Read the canvas now, while this frame is still in it
    if (this.pendingCapture) {
      const resolve = this.pendingCapture;
      this.pendingCapture = null;
      this.renderer.domElement.toBlob(resolve, 'image/png');
    }
  }

  private onResize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.forceFrame = true; // resizing clears the canvas: draw one fresh frame
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);

    // Resize the low-res render target too
    const scale = pixelScaleFor(h);
    const lowW = Math.floor(w / scale);
    const lowH = Math.floor(h / scale);
    this.renderTarget.setSize(lowW, lowH);
    this.bloom.setSize(lowW, lowH);
  }

  dispose(): void {
    this.renderer.setAnimationLoop(null);
    this.renderer.dispose();
    this.renderTarget.dispose();
    window.removeEventListener('resize', this.resizeHandler);
  }
}
