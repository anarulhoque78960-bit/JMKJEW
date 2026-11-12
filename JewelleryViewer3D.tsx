import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Sun, Eye, ChevronDown, ChevronUp, Maximize2 } from 'lucide-react';

interface JewelleryViewer3DProps {
  modelType?: 'jhumka' | 'necklace' | 'ring' | 'box' | 'earring';
  productName?: string;
  initialFinish?: 'microgold' | 'rose' | 'platinum' | 'antique';
  className?: string;
  height?: string;
}

export const JewelleryViewer3D: React.FC<JewelleryViewer3DProps> = ({
  modelType = 'jhumka',
  productName = 'Mughal Chandbali Jhumka',
  initialFinish = 'microgold',
  className = '',
  height = '500px',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [metalFinish, setMetalFinish] = useState<'microgold' | 'rose' | 'platinum' | 'antique'>(initialFinish);
  const [gemTone, setGemTone] = useState<'emerald' | 'ruby' | 'diamond' | 'sapphire'>('emerald');
  const [lightPreset, setLightPreset] = useState<'boutique' | 'warm' | 'daylight'>('boutique');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References for live 3D updates without recreating the scene
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<{
    gold: THREE.MeshPhysicalMaterial;
    gem: THREE.MeshPhysicalMaterial;
    pearl: THREE.MeshPhysicalMaterial;
    velvet: THREE.MeshStandardMaterial;
  } | null>(null);
  const lightsRef = useRef<{
    keyLight: THREE.DirectionalLight;
    fillLight: THREE.HemisphereLight;
    pointLight: THREE.PointLight;
  } | null>(null);

  // Fashion Plating & Polish Palettes
  const METAL_COLORS = {
    'microgold': { color: 0xdfb150, metalness: 0.95, roughness: 0.22, name: '18K Micro Gold Polish' },
    'rose': { color: 0xdf9a8b, metalness: 0.92, roughness: 0.24, name: 'Rose Gold Polish' },
    'platinum': { color: 0xe0e2e8, metalness: 0.97, roughness: 0.16, name: 'Rhodium Silver Polish' },
    'antique': { color: 0xa98236, metalness: 0.88, roughness: 0.42, name: 'Antique Matte Gold' },
  };

  const GEM_COLORS = {
    emerald: { color: 0x0f824e, transmission: 0.75, roughness: 0.08, ior: 1.77, name: 'Zambian Emerald' },
    ruby: { color: 0x9b111e, transmission: 0.7, roughness: 0.08, ior: 1.76, name: 'Burmese Ruby' },
    diamond: { color: 0xf0f7ff, transmission: 0.92, roughness: 0.04, ior: 2.42, name: 'VVS Diamond' },
    sapphire: { color: 0x12368c, transmission: 0.72, roughness: 0.08, ior: 1.77, name: 'Royal Blue Sapphire' },
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software rendering
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c0c0e);
    scene.fog = new THREE.FogExp2(0x0c0c0e, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 5.2);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Environment reflection generator (Procedural Cube Texture)
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128);
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);
    // Minimal procedural reflection room
    const cubeScene = new THREE.Scene();
    const lightBoxGeo = new THREE.BoxGeometry(8, 8, 8);
    const lightBoxMat = new THREE.MeshBasicMaterial({
      color: 0xfff6dc,
      side: THREE.BackSide,
    });
    const lightBox = new THREE.Mesh(lightBoxGeo, lightBoxMat);
    cubeScene.add(lightBox);
    cubeCamera.update(renderer, cubeScene);
    scene.environment = cubeRenderTarget.texture;

    // Lighting Setup
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0xfff5ea, 0x1a1820, 1.2);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0xffdf80, 2.0, 10);
    pointLight.position.set(-3, 2, -2);
    scene.add(pointLight);

    lightsRef.current = { keyLight, fillLight, pointLight };

    // Ground Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    // Radial gradient canvas texture for realistic soft contact shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 5, 64, 64, 60);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.5;
    scene.add(shadowPlane);

    // Shared Luxury Materials
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: METAL_COLORS[metalFinish].color,
      metalness: METAL_COLORS[metalFinish].metalness,
      roughness: METAL_COLORS[metalFinish].roughness,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });

    const gemMat = new THREE.MeshPhysicalMaterial({
      color: GEM_COLORS[gemTone].color,
      roughness: GEM_COLORS[gemTone].roughness,
      metalness: 0.1,
      transmission: GEM_COLORS[gemTone].transmission,
      ior: GEM_COLORS[gemTone].ior,
      thickness: 1.2,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    const pearlMat = new THREE.MeshPhysicalMaterial({
      color: 0xfaf5ec,
      roughness: 0.3,
      metalness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xffe6d0),
    });

    const velvetMat = new THREE.MeshStandardMaterial({
      color: 0x093120,
      roughness: 0.85,
      metalness: 0.05,
    });

    materialsRef.current = { gold: goldMat, gem: gemMat, pearl: pearlMat, velvet: velvetMat };

    // Procedural 3D Subject Group
    const modelGroup = new THREE.Group();
    groupRef.current = modelGroup;

    // Build Model based on modelType
    if (modelType === 'jhumka' || modelType === 'earring') {
      // 1. Top Stud Disc with gemstone center
      const studGeo = new THREE.CylinderGeometry(0.5, 0.52, 0.08, 32);
      const studMesh = new THREE.Mesh(studGeo, goldMat);
      studMesh.position.y = 1.35;
      studMesh.castShadow = true;
      modelGroup.add(studMesh);

      // Stud Floral Petals (Instanced or ring of spheres)
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const petalGeo = new THREE.SphereGeometry(0.12, 16, 16);
        petalGeo.scale(1, 0.6, 1.4);
        const petalMesh = new THREE.Mesh(petalGeo, goldMat);
        petalMesh.position.set(Math.cos(angle) * 0.52, 1.35, Math.sin(angle) * 0.52);
        petalMesh.rotation.y = -angle;
        modelGroup.add(petalMesh);
      }

      // Stud Center Gemstone
      const centerGemGeo = new THREE.IcosahedronGeometry(0.24, 2);
      const centerGem = new THREE.Mesh(centerGemGeo, gemMat);
      centerGem.position.y = 1.42;
      modelGroup.add(centerGem);

      // Connecting Filigree Chain Links
      for (let i = 0; i < 3; i++) {
        const linkGeo = new THREE.TorusGeometry(0.12, 0.035, 12, 24);
        const linkMesh = new THREE.Mesh(linkGeo, goldMat);
        linkMesh.position.y = 1.15 - i * 0.18;
        if (i % 2 === 1) linkMesh.rotation.y = Math.PI / 2;
        modelGroup.add(linkMesh);
      }

      // 2. Main Jhumka Bell / Umbrella Dome
      const bellPoints = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        // Bell silhouette curve
        const r = Math.sin(t * Math.PI * 0.8) * 0.95 + 0.15;
        const y = (1 - t) * 0.9 - 0.2;
        bellPoints.push(new THREE.Vector2(r, y));
      }
      const bellGeo = new THREE.LatheGeometry(bellPoints, 36);
      const bellMesh = new THREE.Mesh(bellGeo, goldMat);
      bellMesh.castShadow = true;
      bellMesh.receiveShadow = true;
      modelGroup.add(bellMesh);

      // Bell Decorative Rim Torus
      const rimGeo = new THREE.TorusGeometry(1.02, 0.07, 16, 40);
      rimGeo.rotateX(Math.PI / 2);
      const rimMesh = new THREE.Mesh(rimGeo, goldMat);
      rimMesh.position.y = -0.2;
      modelGroup.add(rimMesh);

      // Lower hanging pearl drops and emerald tassels
      const dropCount = 14;
      for (let i = 0; i < dropCount; i++) {
        const angle = (i / dropCount) * Math.PI * 2;
        const px = Math.cos(angle) * 0.98;
        const pz = Math.sin(angle) * 0.98;

        // Droplet pin
        const pinGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8);
        const pinMesh = new THREE.Mesh(pinGeo, goldMat);
        pinMesh.position.set(px, -0.38, pz);
        modelGroup.add(pinMesh);

        // Hanging Pearl or Gem Bead
        const beadGeo = new THREE.SphereGeometry(0.11, 16, 16);
        beadGeo.scale(1, 1.25, 1);
        const beadMesh = new THREE.Mesh(beadGeo, i % 2 === 0 ? pearlMat : gemMat);
        beadMesh.position.set(px, -0.55, pz);
        modelGroup.add(beadMesh);
      }

      // Central suspended bell clapper jewel
      const clapperRodGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
      const clapperRod = new THREE.Mesh(clapperRodGeo, goldMat);
      clapperRod.position.y = 0.1;
      modelGroup.add(clapperRod);

      const clapperGemGeo = new THREE.OctahedronGeometry(0.28, 2);
      const clapperGem = new THREE.Mesh(clapperGemGeo, gemMat);
      clapperGem.position.y = -0.35;
      modelGroup.add(clapperGem);

    } else if (modelType === 'necklace') {
      // Elegant Neck Bust Silhouette (Stylized velvet jewelry bust)
      const bustGeo = new THREE.CylinderGeometry(1.2, 1.7, 2.2, 32);
      bustGeo.scale(1, 1, 0.7);
      const bustMat = new THREE.MeshStandardMaterial({
        color: 0x111114,
        roughness: 0.95,
      });
      const bust = new THREE.Mesh(bustGeo, bustMat);
      bust.position.y = -0.5;
      modelGroup.add(bust);

      // Golden Curved Torque Collar Necklace
      const curvePoints = [];
      const numSegments = 30;
      for (let i = 0; i <= numSegments; i++) {
        const theta = ((i / numSegments) - 0.5) * Math.PI * 1.25;
        const r = 1.3;
        const x = Math.sin(theta) * r;
        const z = (Math.cos(theta) * r * 0.75) - 0.2;
        const y = 0.3 - (Math.cos(theta) * 0.4);
        curvePoints.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const neckGeo = new THREE.TubeGeometry(curve, 40, 0.07, 12, false);
      const neckMesh = new THREE.Mesh(neckGeo, goldMat);
      neckMesh.castShadow = true;
      modelGroup.add(neckMesh);

      // Accent gems along collar
      for (let i = 4; i < numSegments - 4; i += 2) {
        const pt = curvePoints[i];
        const collarGemGeo = new THREE.SphereGeometry(0.08, 14, 14);
        const collarGem = new THREE.Mesh(collarGemGeo, pearlMat);
        collarGem.position.copy(pt);
        collarGem.position.y -= 0.06;
        modelGroup.add(collarGem);
      }

      // Central Imperial Pendant
      const pendantAnchor = curvePoints[Math.floor(numSegments / 2)];
      const pendantCollet = new THREE.CylinderGeometry(0.42, 0.45, 0.1, 24);
      pendantCollet.rotateX(Math.PI / 4);
      const colletMesh = new THREE.Mesh(pendantCollet, goldMat);
      colletMesh.position.set(pendantAnchor.x, pendantAnchor.y - 0.35, pendantAnchor.z + 0.15);
      modelGroup.add(colletMesh);

      // Faceted Teardrop Gemstone
      const mainGemGeo = new THREE.ConeGeometry(0.38, 0.65, 8);
      mainGemGeo.rotateX(Math.PI);
      const mainGem = new THREE.Mesh(mainGemGeo, gemMat);
      mainGem.position.set(pendantAnchor.x, pendantAnchor.y - 0.45, pendantAnchor.z + 0.2);
      modelGroup.add(mainGem);

      // Hanging pearl bead at pendant base
      const dropPearl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), pearlMat);
      dropPearl.position.set(pendantAnchor.x, pendantAnchor.y - 0.9, pendantAnchor.z + 0.16);
      modelGroup.add(dropPearl);

    } else if (modelType === 'ring') {
      // Luxury Solitaire Ring Shank
      const ringGeo = new THREE.TorusGeometry(1.0, 0.14, 24, 60);
      const ringMesh = new THREE.Mesh(ringGeo, goldMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.castShadow = true;
      modelGroup.add(ringMesh);

      // Cathedral Shoulders
      const shoulderGeo = new THREE.BoxGeometry(0.18, 0.22, 0.5);
      const leftShoulder = new THREE.Mesh(shoulderGeo, goldMat);
      leftShoulder.position.set(-0.65, 0.4, 0);
      leftShoulder.rotation.z = -Math.PI / 6;
      modelGroup.add(leftShoulder);

      const rightShoulder = new THREE.Mesh(shoulderGeo, goldMat);
      rightShoulder.position.set(0.65, 0.4, 0);
      rightShoulder.rotation.z = Math.PI / 6;
      modelGroup.add(rightShoulder);

      // Elevated 6-Prong Crown Basket
      const crownBase = new THREE.CylinderGeometry(0.38, 0.25, 0.25, 16);
      const crownBaseMesh = new THREE.Mesh(crownBase, goldMat);
      crownBaseMesh.position.y = 1.05;
      modelGroup.add(crownBaseMesh);

      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const prongGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.5, 12);
        const prong = new THREE.Mesh(prongGeo, goldMat);
        prong.position.set(Math.cos(angle) * 0.38, 1.25, Math.sin(angle) * 0.38);
        prong.rotation.z = -Math.cos(angle) * 0.15;
        prong.rotation.x = Math.sin(angle) * 0.15;
        modelGroup.add(prong);
      }

      // Brilliant Solitaire Gem
      const brilliantGeo = new THREE.IcosahedronGeometry(0.5, 2);
      const diamondSolitaire = new THREE.Mesh(brilliantGeo, gemMat);
      diamondSolitaire.position.y = 1.35;
      modelGroup.add(diamondSolitaire);

    } else if (modelType === 'box') {
      // Luxury Velvet Jewellery Casket
      const boxBaseGeo = new THREE.BoxGeometry(2.4, 0.9, 1.8);
      const boxBase = new THREE.Mesh(boxBaseGeo, velvetMat);
      boxBase.position.y = -0.4;
      boxBase.castShadow = true;
      boxBase.receiveShadow = true;
      modelGroup.add(boxBase);

      // Box Lid (Angled slightly open 40 degrees)
      const lidGroup = new THREE.Group();
      lidGroup.position.set(0, 0.05, -0.9);

      const lidGeo = new THREE.BoxGeometry(2.44, 0.3, 1.84);
      const lidMesh = new THREE.Mesh(lidGeo, velvetMat);
      lidMesh.position.set(0, 0.15, 0.9);
      lidMesh.castShadow = true;
      lidGroup.add(lidMesh);

      // Brass Hinges & Lock
      const lockGeo = new THREE.BoxGeometry(0.25, 0.25, 0.06);
      const lock = new THREE.Mesh(lockGeo, goldMat);
      lock.position.set(0, 0.15, 1.84);
      lidGroup.add(lock);

      lidGroup.rotation.x = -Math.PI / 4.5;
      modelGroup.add(lidGroup);

      // Interior Satin Pillows & Ring Slots
      const interiorGeo = new THREE.BoxGeometry(2.1, 0.2, 1.5);
      const interiorMat = new THREE.MeshStandardMaterial({
        color: 0x1f1f22,
        roughness: 0.6,
      });
      const interior = new THREE.Mesh(interiorGeo, interiorMat);
      interior.position.set(0, 0.0, 0);
      modelGroup.add(interior);

      // Showcase Ring resting inside the box
      const previewRing = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.05, 16, 32), goldMat);
      previewRing.position.set(0, 0.18, 0);
      previewRing.rotation.x = Math.PI / 2.5;
      modelGroup.add(previewRing);

      const previewGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 1), gemMat);
      previewGem.position.set(0, 0.26, 0.22);
      modelGroup.add(previewGem);

      // Gold Corner Edge Guards
      const cornerOffsets = [
        [-1.2, -0.4, -0.9],
        [1.2, -0.4, -0.9],
        [-1.2, -0.4, 0.9],
        [1.2, -0.4, 0.9],
      ];
      cornerOffsets.forEach(([cx, cy, cz]) => {
        const cornerGeo = new THREE.BoxGeometry(0.15, 0.8, 0.15);
        const corner = new THREE.Mesh(cornerGeo, goldMat);
        corner.position.set(cx, cy, cz);
        modelGroup.add(corner);
      });
    }

    scene.add(modelGroup);

    // Mouse Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch Support for Mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;
      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchmove', onTouchMove);
    container.addEventListener('touchend', onTouchEnd);

    // Zoom on Wheel
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(2.8, Math.min(8.0, camera.position.z + e.deltaY * 0.004));
    };
    container.addEventListener('wheel', onWheel, { passive: false });

    // Window Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      // Auto rotation when enabled and not dragging
      if (autoRotate && !isDragging) {
        targetRotationY += delta * 0.45;
      }

      // Smooth exponential damping
      modelGroup.rotation.y = THREE.MathUtils.damp(modelGroup.rotation.y, targetRotationY, 6, delta);
      modelGroup.rotation.x = THREE.MathUtils.damp(modelGroup.rotation.x, targetRotationX, 6, delta);

      // Subtle breathing float animation
      const elapsedTime = clock.getElapsedTime();
      modelGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.04;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('wheel', onWheel);

      // Cleanup
      scene.clear();
      renderer.dispose();
      cubeRenderTarget.dispose();
      shadowTex.dispose();
      goldMat.dispose();
      gemMat.dispose();
      pearlMat.dispose();
      velvetMat.dispose();
    };
  }, [modelType]);

  // Live update materials when user switches finish or gem
  useEffect(() => {
    if (!materialsRef.current) return;
    const config = METAL_COLORS[metalFinish];
    materialsRef.current.gold.color.setHex(config.color);
    materialsRef.current.gold.metalness = config.metalness;
    materialsRef.current.gold.roughness = config.roughness;
    materialsRef.current.gold.needsUpdate = true;
  }, [metalFinish]);

  useEffect(() => {
    if (!materialsRef.current) return;
    const config = GEM_COLORS[gemTone];
    materialsRef.current.gem.color.setHex(config.color);
    materialsRef.current.gem.roughness = config.roughness;
    materialsRef.current.gem.transmission = config.transmission;
    materialsRef.current.gem.ior = config.ior;
    materialsRef.current.gem.needsUpdate = true;
  }, [gemTone]);

  // Live update lighting
  useEffect(() => {
    if (!lightsRef.current) return;
    const { keyLight, fillLight, pointLight } = lightsRef.current;
    if (lightPreset === 'boutique') {
      keyLight.color.setHex(0xfffaed);
      keyLight.intensity = 2.8;
      fillLight.color.setHex(0xfff5ea);
      pointLight.color.setHex(0xffdf80);
      pointLight.intensity = 2.0;
    } else if (lightPreset === 'warm') {
      keyLight.color.setHex(0xffdf99);
      keyLight.intensity = 3.2;
      fillLight.color.setHex(0xffe2b8);
      pointLight.color.setHex(0xffb74d);
      pointLight.intensity = 2.6;
    } else {
      // Daylight Studio
      keyLight.color.setHex(0xffffff);
      keyLight.intensity = 3.0;
      fillLight.color.setHex(0xe8f0fe);
      pointLight.color.setHex(0xd0e2ff);
      pointLight.intensity = 1.6;
    }
  }, [lightPreset]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const delta = direction === 'in' ? -0.6 : 0.6;
    cameraRef.current.position.z = Math.max(2.6, Math.min(8.0, cameraRef.current.position.z + delta));
  };

  const resetCamera = () => {
    if (!cameraRef.current || !groupRef.current) return;
    cameraRef.current.position.set(0, 1.2, 5.2);
    groupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#131318] via-[#0d0d10] to-[#08080a] border border-[#dfb150]/25 shadow-2xl ${className}`}
      style={{ height: isFullscreen ? '90vh' : height }}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Top Left Spec Badge */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1.5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-[#dfb150]/30 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#dfb150]" />
          <span className="text-[11px] font-medium tracking-widest uppercase text-amber-200">
            3D Fashion Jewellery Inspection
          </span>
        </div>
        <div className="text-xs text-zinc-400 font-light pl-1">
          {productName} • <span className="text-[#dfb150] font-medium">{METAL_COLORS[metalFinish].name}</span>
        </div>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
            autoRotate
              ? 'bg-[#dfb150]/20 border-[#dfb150]/50 text-[#fbe8aa]'
              : 'bg-black/50 border-white/10 text-zinc-400 hover:text-white'
          }`}
          title={autoRotate ? 'Pause 360° Rotation' : 'Start 360° Rotation'}
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
        </button>
        <button
          onClick={() => handleZoom('in')}
          className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-zinc-300 hover:text-white backdrop-blur-md transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-zinc-300 hover:text-white backdrop-blur-md transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-zinc-300 hover:text-white backdrop-blur-md transition-all"
          title="Toggle Expanded View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Helper Hint */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-60 text-[11px] text-zinc-400 font-light tracking-wide flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
        <span>Click & drag to rotate 360° • Scroll to zoom</span>
      </div>

      {/* Unified Bottom Control Dock (Compliant with Three.js Skill Directives: Zero Viewport Occlusion) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-xl flex flex-col items-center">
        {/* Dock Collapse Toggle */}
        <button
          onClick={() => setIsHudCollapsed(!isHudCollapsed)}
          className="flex items-center gap-1 px-3 py-1 rounded-t-lg bg-[#141418]/90 border-t border-x border-[#dfb150]/30 text-[10px] uppercase tracking-wider text-amber-200/90 backdrop-blur-md hover:text-white transition-all shadow-lg"
        >
          {isHudCollapsed ? (
            <>
              <span>Custom Finishes</span>
              <ChevronUp className="w-3 h-3 text-[#dfb150]" />
            </>
          ) : (
            <>
              <span>Hide Controls</span>
              <ChevronDown className="w-3 h-3 text-[#dfb150]" />
            </>
          )}
        </button>

        {/* Dock Content */}
        {!isHudCollapsed && (
          <div className="w-full p-3.5 rounded-2xl bg-[#121217]/95 border border-[#dfb150]/30 backdrop-blur-xl shadow-2xl flex flex-col gap-3">
            {/* Plating Finish Selector */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                Plating Polish:
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'microgold', label: '18K Micro Gold', color: 'bg-[#dfb150]' },
                  { id: 'rose', label: 'Rose Gold', color: 'bg-[#df9a8b]' },
                  { id: 'platinum', label: 'Rhodium Silver', color: 'bg-[#d8dce6]' },
                  { id: 'antique', label: 'Antique Matte', color: 'bg-[#a98236]' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMetalFinish(item.id as any)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      metalFinish === item.id
                        ? 'bg-[#dfb150]/25 text-amber-200 border border-[#dfb150]/60'
                        : 'bg-zinc-800/60 text-zinc-300 border border-white/5 hover:border-zinc-600'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-sm`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gemstone Tone Selector & Lighting Rig */}
            <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                  Gemstone:
                </span>
                <div className="flex items-center gap-1">
                  {[
                    { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
                    { id: 'ruby', label: 'Ruby', bg: 'bg-rose-700' },
                    { id: 'diamond', label: 'Diamond', bg: 'bg-cyan-200' },
                    { id: 'sapphire', label: 'Sapphire', bg: 'bg-blue-600' },
                  ].map((gem) => (
                    <button
                      key={gem.id}
                      onClick={() => setGemTone(gem.id as any)}
                      className={`p-1.5 rounded-md border transition-all ${
                        gemTone === gem.id
                          ? 'border-[#dfb150] ring-1 ring-[#dfb150]/50'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      title={gem.label}
                    >
                      <span className={`block w-3.5 h-3.5 rounded-full ${gem.bg}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Lighting Presets */}
              <div className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-zinc-400" />
                {[
                  { id: 'boutique', label: 'Boutique' },
                  { id: 'warm', label: 'Candle' },
                  { id: 'daylight', label: 'Studio' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLightPreset(l.id as any)}
                    className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                      lightPreset === l.id
                        ? 'bg-[#dfb150] text-black font-semibold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
                <button
                  onClick={resetCamera}
                  className="px-2 py-0.5 rounded text-[11px] bg-zinc-800/80 text-zinc-400 hover:text-amber-200 transition-all ml-1 border border-white/5"
                >
                  Reset View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
