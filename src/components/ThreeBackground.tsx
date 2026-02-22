'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FOV = 45;
const CAM_Z = 5;
// Extra buffer so zoom/parallax never reveals edges
const BUFFER = 1.22;

function getPlaneDims(w: number, h: number) {
  const vFov = (FOV * Math.PI) / 180;
  const planeH = 2 * Math.tan(vFov / 2) * CAM_Z;
  const planeW = planeH * (w / h);
  return { planeW, planeH };
}

/** Map texture with CSS object-fit:cover behaviour */
function applyCoverUV(texture: THREE.Texture, planeW: number, planeH: number) {
  const texAspect = texture.image.width / texture.image.height;
  const planeAspect = planeW / planeH;
  if (planeAspect > texAspect) {
    // plane wider → crop top/bottom
    const scale = planeAspect / texAspect;
    texture.repeat.set(1, 1 / scale);
    texture.offset.set(0, (1 - 1 / scale) / 2);
  } else {
    // plane taller → crop left/right
    const scale = texAspect / planeAspect;
    texture.repeat.set(1 / scale, 1);
    texture.offset.set((1 - 1 / scale) / 2, 0);
  }
}

export default function ThreeBackground({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;
    const { planeW, planeH } = getPlaneDims(w, h);

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, w / h, 0.1, 100);
    camera.position.z = CAM_Z;

    // ── Main image plane ──────────────────────────────────────────────────────
    const geo = new THREE.PlaneGeometry(planeW * BUFFER, planeH * BUFFER);
    const mat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });
    const plane = new THREE.Mesh(geo, mat);
    scene.add(plane);

    new THREE.TextureLoader().load('/hero-bg.jpeg', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      applyCoverUV(texture, planeW * BUFFER, planeH * BUFFER);
      mat.map = texture;
      mat.color.set(0xffffff);
      mat.needsUpdate = true;
    });

    // ── Shimmer 1 — green tint over wet road area ─────────────────────────────
    const shimmerMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x22c55e),
      transparent: true,
      opacity: 0,
    });
    const shimmerMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(planeW * BUFFER, planeH * 0.14),
      shimmerMat
    );
    shimmerMesh.position.set(0, -planeH * 0.24, 0.01);
    scene.add(shimmerMesh);

    // ── Shimmer 2 — white light streak on road ────────────────────────────────
    const streakMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 0,
    });
    const streakMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(planeW * 0.28, planeH * 0.007),
      streakMat
    );
    streakMesh.position.set(0.1, -planeH * 0.19, 0.01);
    scene.add(streakMesh);

    // ── Mouse parallax state ──────────────────────────────────────────────────
    let rawX = 0;
    let rawY = 0;
    let smoothX = 0;
    let smoothY = 0;

    const onMouseMove = (e: MouseEvent) => {
      rawX = (e.clientX / window.innerWidth - 0.5) * 2;
      rawY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Resize handler ────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ────────────────────────────────────────────────────────
    let rafId: number;
    const t0 = performance.now();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = (performance.now() - t0) / 1000; // seconds

      // Smooth parallax (lerp factor 0.025 = very slow follow)
      smoothX += (rawX - smoothX) * 0.025;
      smoothY += (rawY - smoothY) * 0.025;

      // Organic auto-drift so the image breathes even without mouse
      const driftX = Math.sin(t * 0.07) * 0.022;
      const driftY = Math.cos(t * 0.05) * 0.014;

      // Move the plane, not the camera → no perspective distortion
      plane.position.x = smoothX * 0.055 + driftX;
      plane.position.y = smoothY * 0.038 + driftY;
      shimmerMesh.position.x = plane.position.x;
      streakMesh.position.x = 0.1 + plane.position.x * 0.3;

      // Subtle zoom: scale 1.00 → 1.03 over 20 s, continuous sine loop
      const zoomT = (Math.sin((t / 20) * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      const zoom = 1.0 + zoomT * 0.03;
      plane.scale.set(zoom, zoom, 1);

      // Wet-road shimmer — very low opacity, slow pulse
      shimmerMat.opacity = Math.max(0, Math.sin(t * 0.45) * 0.05);
      // Light streak — slightly faster, out of phase
      streakMat.opacity = Math.max(0, Math.sin(t * 0.85 + 2.1) * 0.065);

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}
