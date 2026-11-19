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

/** How many times to divide the screen resolution for the pixel look.
 *  3 = each "pixel" is 3x3 screen pixels. Adjust for more/less chunky. */
const PIXEL_SCALE = 2; // mild pixelation — detail readable but stylized

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

  /** Turn bloom off on slow machines (a future graphics-quality setting) */
  bloomEnabled = true;
  /** Colour grade uniforms. Tuned per time of day by DayNightCycle. */
  readonly grade: GradeUniforms;

  private updateCallbacks: Array<(dt: number) => void> = [];
  private resizeHandler: () => void;

  constructor(canvas: HTMLCanvasElement) {
    // Renderer setup - NO antialiasing for pixel art
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      logarithmicDepthBuffer: true,
    });
    this.renderer.setPixelRatio(1); // fixed at 1 for pixel art
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.autoClear = false;

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
    // Render at 1/PIXEL_SCALE resolution, then stretch to fill screen
    const lowW = Math.floor(window.innerWidth / PIXEL_SCALE);
    const lowH = Math.floor(window.innerHeight / PIXEL_SCALE);

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
    // follows the grinder (DayNightCycle) so it only needs to cover ~90m around it
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.near = 1;
    this.directionalLight.shadow.camera.far = 200;
    this.directionalLight.shadow.camera.left = -45;
    this.directionalLight.shadow.camera.right = 45;
    this.directionalLight.shadow.camera.top = 45;
    this.directionalLight.shadow.camera.bottom = -45;
    this.directionalLight.shadow.bias = -0.002;
    this.directionalLight.shadow.normalBias = 0.02;
    this.scene.add(this.directionalLight);

    // Handle window resize
    this.resizeHandler = this.onResize.bind(this);
    window.addEventListener('resize', this.resizeHandler);

    // Start the animation loop
    this.renderer.setAnimationLoop(this.animate.bind(this));
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

  private animate(): void {
    const dt = this.clock.getDelta();

    // Call all registered update functions
    for (const cb of this.updateCallbacks) {
      cb(dt);
    }

    // Step 1: Render the scene to the low-res render target
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

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);

    // Resize the low-res render target too
    const lowW = Math.floor(w / PIXEL_SCALE);
    const lowH = Math.floor(h / PIXEL_SCALE);
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
