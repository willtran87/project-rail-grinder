/**
 * Engine - Sets up the Three.js renderer, scene, camera, lighting,
 * and the main animation loop.
 *
 * Uses a pixel art rendering pipeline: the scene is rendered to a
 * low-resolution render target, then upscaled to the screen with
 * nearest-neighbor filtering for crisp, chunky pixels.
 */

import * as THREE from 'three';

/** How many times to divide the screen resolution for the pixel look.
 *  3 = each "pixel" is 3x3 screen pixels. Adjust for more/less chunky. */
const PIXEL_SCALE = 2; // mild pixelation — detail readable but stylized

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

    this.renderTarget = new THREE.WebGLRenderTarget(lowW, lowH, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      depthBuffer: true,
      stencilBuffer: false,
    });

    // Fullscreen quad to display the pixelated render
    this.pixelQuadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.pixelQuadScene = new THREE.Scene();
    const quadGeo = new THREE.PlaneGeometry(2, 2);
    const quadMat = new THREE.MeshBasicMaterial({
      map: this.renderTarget.texture,
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
    this.directionalLight.shadow.mapSize.set(2048, 2048);
    this.directionalLight.shadow.camera.near = 1;
    this.directionalLight.shadow.camera.far = 200;
    this.directionalLight.shadow.camera.left = -60;
    this.directionalLight.shadow.camera.right = 60;
    this.directionalLight.shadow.camera.top = 60;
    this.directionalLight.shadow.camera.bottom = -60;
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

    // Step 2: Draw the low-res texture to the screen (upscaled with nearest filter)
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.pixelQuadScene, this.pixelQuadCamera);
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
  }

  dispose(): void {
    this.renderer.setAnimationLoop(null);
    this.renderer.dispose();
    this.renderTarget.dispose();
    window.removeEventListener('resize', this.resizeHandler);
  }
}
