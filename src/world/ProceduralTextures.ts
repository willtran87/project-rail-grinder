/**
 * ProceduralTextures - Generates canvas-based textures at runtime.
 *
 * No external image files needed. Creates:
 * - Train body panels with seams, rivets, and weathering
 * - Ground/terrain textures with grass and dirt variation
 * - Metallic rail textures
 */

import * as THREE from 'three';

/** Create a train body texture with panel lines, weathering, and numbering */
export function createTrainBodyTexture(
  baseColor: string,
  width = 512,
  height = 256,
  options: { panels?: boolean; weathering?: boolean; label?: string } = {}
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);

  // Weathering: darker at bottom, slightly lighter at top
  if (options.weathering !== false) {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(255,255,255,0.05)');
    grad.addColorStop(0.4, 'rgba(0,0,0,0)');
    grad.addColorStop(0.85, 'rgba(0,0,0,0.12)');
    grad.addColorStop(1.0, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Random grime spots at bottom
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = height * 0.75 + Math.random() * height * 0.25;
      const r = 5 + Math.random() * 15;
      ctx.fillStyle = `rgba(40,30,20,${0.05 + Math.random() * 0.1})`;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Panel lines
  if (options.panels !== false) {
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;

    // Vertical seams
    const panelW = width / (4 + Math.floor(Math.random() * 3));
    for (let x = panelW; x < width; x += panelW) {
      ctx.beginPath();
      ctx.moveTo(x, height * 0.05);
      ctx.lineTo(x, height * 0.95);
      ctx.stroke();
    }

    // Horizontal seam
    ctx.beginPath();
    ctx.moveTo(0, height * 0.35);
    ctx.lineTo(width, height * 0.35);
    ctx.stroke();

    // Rivet dots along seams
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    for (let x = panelW; x < width; x += panelW) {
      for (let y = height * 0.1; y < height * 0.9; y += 12) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Label/numbering
  if (options.label) {
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.textAlign = 'left';
    ctx.fillText(options.label, 20, height * 0.6);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Create a roughness map with panel detail */
export function createRoughnessMap(width = 256, height = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base roughness (medium)
  ctx.fillStyle = '#888';
  ctx.fillRect(0, 0, width, height);

  // Smoother on upper body, rougher on lower
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#777');
  grad.addColorStop(0.7, '#888');
  grad.addColorStop(1, '#bbb');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Noise for surface variation
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const v = 0x77 + Math.floor(Math.random() * 0x44);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Create a ground texture with grass/dirt variation */
export function createGroundTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base green
  ctx.fillStyle = '#3a5a2a';
  ctx.fillRect(0, 0, width, height);

  // Random grass variation
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const g = 0x30 + Math.floor(Math.random() * 0x40);
    ctx.fillStyle = `rgb(${0x20 + Math.floor(Math.random() * 0x20)},${g},${0x15 + Math.floor(Math.random() * 0x15)})`;
    ctx.fillRect(x, y, 2 + Math.random() * 4, 2 + Math.random() * 4);
  }

  // Dirt patches
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 20 + Math.random() * 40;
    ctx.fillStyle = `rgba(90,70,50,${0.2 + Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(20, 20);
  return tex;
}
