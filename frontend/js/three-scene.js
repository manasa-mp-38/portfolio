/**
 * ===================================================================
 * MANASA M P - 3D PORTFOLIO THREE.JS ENGINE
 * Interactive 3D Laptop Workspace & 3D Skills Sphere
 * Optimized with Raycasting, Fibonacci Sphere Distribution & Performance Capping
 * ===================================================================
 */

(function () {
  'use strict';

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLAvailable()) {
    console.warn("WebGL not supported in this browser. Falling back to CSS interface.");
    const fallbackEl = document.querySelector('.webgl-fallback-card');
    if (fallbackEl) fallbackEl.style.display = 'block';
    return;
  }

  let isReducedMotion = false;
  window.toggleReduceMotion = function (enabled) {
    isReducedMotion = enabled;
  };

  /* ===================================================================
     1. HERO 3D SCENE: INTERACTIVE LAPTOP & FLOATING CODE WORKSPACE
     =================================================================== */
  function initHeroScene() {
    const container = document.getElementById('hero-canvas-container');
    const canvas = document.getElementById('hero-canvas');
    if (!container || !canvas) return;

    const isMobile = window.innerWidth < 768;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 5.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 2.5, 20);
    cyanLight.position.set(3, 4, 3);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x9d4edd, 2.0, 20);
    purpleLight.position.set(-3, -2, 2);
    scene.add(purpleLight);

    // Laptop Group
    const laptopGroup = new THREE.Group();
    scene.add(laptopGroup);

    // Laptop Base Materials
    const darkMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f1422,
      metalness: 0.85,
      roughness: 0.25
    });

    const borderGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });

    // Base Chassis
    const baseGeo = new THREE.BoxGeometry(3.2, 0.12, 2.2);
    const baseMesh = new THREE.Mesh(baseGeo, darkMetalMaterial);
    baseMesh.position.y = -0.3;
    laptopGroup.add(baseMesh);

    // Keyboard Area Texture
    const keyboardCanvas = document.createElement('canvas');
    keyboardCanvas.width = 512;
    keyboardCanvas.height = 256;
    const kbCtx = keyboardCanvas.getContext('2d');
    kbCtx.fillStyle = '#0a0d18';
    kbCtx.fillRect(0, 0, 512, 256);
    // Draw subtle key grid
    kbCtx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    kbCtx.lineWidth = 2;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 14; c++) {
        kbCtx.strokeRect(20 + c * 34, 15 + r * 28, 30, 24);
      }
    }
    // Trackpad
    kbCtx.strokeStyle = 'rgba(157, 78, 221, 0.4)';
    kbCtx.strokeRect(180, 165, 150, 75);

    const kbTexture = new THREE.CanvasTexture(keyboardCanvas);
    const keyboardMat = new THREE.MeshBasicMaterial({ map: kbTexture });
    const kbGeo = new THREE.PlaneGeometry(3.0, 2.0);
    const kbMesh = new THREE.Mesh(kbGeo, keyboardMat);
    kbMesh.rotation.x = -Math.PI / 2;
    kbMesh.position.set(0, -0.23, 0);
    laptopGroup.add(kbMesh);

    // Laptop Screen Assembly
    const screenHinge = new THREE.Group();
    screenHinge.position.set(0, -0.24, -1.05);
    screenHinge.rotation.x = 0.25; // Open angle
    laptopGroup.add(screenHinge);

    // Screen Lid Back
    const lidGeo = new THREE.BoxGeometry(3.2, 2.1, 0.08);
    const lidMesh = new THREE.Mesh(lidGeo, darkMetalMaterial);
    lidMesh.position.set(0, 1.05, 0);
    screenHinge.add(lidMesh);

    // Dynamic Display Texture (Code Display)
    const codeCanvas = document.createElement('canvas');
    codeCanvas.width = 1024;
    codeCanvas.height = 640;
    const codeCtx = codeCanvas.getContext('2d');

    function drawScreenContent(tick) {
      codeCtx.fillStyle = '#060812';
      codeCtx.fillRect(0, 0, 1024, 640);

      // Terminal Header
      codeCtx.fillStyle = '#111827';
      codeCtx.fillRect(0, 0, 1024, 45);
      codeCtx.fillStyle = '#ef4444';
      codeCtx.beginPath(); codeCtx.arc(25, 22, 7, 0, Math.PI * 2); codeCtx.fill();
      codeCtx.fillStyle = '#f59e0b';
      codeCtx.beginPath(); codeCtx.arc(50, 22, 7, 0, Math.PI * 2); codeCtx.fill();
      codeCtx.fillStyle = '#10b981';
      codeCtx.beginPath(); codeCtx.arc(75, 22, 7, 0, Math.PI * 2); codeCtx.fill();

      codeCtx.fillStyle = '#94a3b8';
      codeCtx.font = '20px "JetBrains Mono", monospace';
      codeCtx.fillText("manasa@developer: ~/portfolio/backend", 110, 30);

      // Code Lines
      codeCtx.font = '22px "JetBrains Mono", monospace';
      const lines = [
        { t: "class DeveloperPortfolio {", c: "#9d4edd" },
        { t: "    private final String name = \"MANASA M P\";", c: "#00f0ff" },
        { t: "    private final String role = \"Python Full Stack | AI & Data Science\";", c: "#38bdf8" },
        { t: "    private final double academicCGPA = 8.47;", c: "#34d399" },
        { t: "    ", c: "#fff" },
        { t: "    public void launchInteractive3D() {", c: "#9d4edd" },
        { t: "        SpringApplication.run(PortfolioApplication.class);", c: "#fbbf24" },
        { t: "        ThreeJSEngine.renderScene(camera, particles);", c: "#00f0ff" },
        { t: "        System.out.println(\"Status: 100% Ready\");", c: "#34d399" },
        { t: "    }", c: "#9d4edd" },
        { t: "}", c: "#9d4edd" }
      ];

      lines.forEach((line, index) => {
        codeCtx.fillStyle = line.c;
        codeCtx.fillText(line.t, 35, 95 + index * 44);
      });

      // Blinking cursor
      if (Math.floor(tick / 30) % 2 === 0) {
        codeCtx.fillStyle = '#00f0ff';
        codeCtx.fillRect(35, 95 + lines.length * 44, 14, 26);
      }
    }

    drawScreenContent(0);
    const screenTexture = new THREE.CanvasTexture(codeCanvas);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenGeo = new THREE.PlaneGeometry(3.0, 1.9);
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 1.05, 0.045);
    screenHinge.add(screenMesh);

    // Glowing Halo Rings around Laptop
    const ringGeo = new THREE.TorusGeometry(2.8, 0.015, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.3 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.2;
    ringMesh.position.y = -0.4;
    laptopGroup.add(ringMesh);

    const ring2Geo = new THREE.TorusGeometry(3.3, 0.012, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x9d4edd, transparent: true, opacity: 0.2 });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = Math.PI / 2.5;
    ring2Mesh.position.y = -0.4;
    laptopGroup.add(ring2Mesh);

    // Floating Code Symbols / Cubes
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);

    const symbols = ["</>", "{}", "#", "fn", "py", "sql", "ai"];
    const symbolSprites = [];

    symbols.forEach((sym, idx) => {
      const symCanvas = document.createElement('canvas');
      symCanvas.width = 128;
      symCanvas.height = 128;
      const sCtx = symCanvas.getContext('2d');
      sCtx.fillStyle = 'rgba(16, 24, 46, 0.8)';
      sCtx.strokeStyle = idx % 2 === 0 ? '#00f0ff' : '#9d4edd';
      sCtx.lineWidth = 6;
      sCtx.beginPath();
      sCtx.roundRect(10, 10, 108, 108, 20);
      sCtx.fill();
      sCtx.stroke();

      sCtx.fillStyle = idx % 2 === 0 ? '#00f0ff' : '#9d4edd';
      sCtx.font = 'bold 44px "JetBrains Mono", monospace';
      sCtx.textAlign = 'center';
      sCtx.textBaseline = 'middle';
      sCtx.fillText(sym, 64, 64);

      const symTex = new THREE.CanvasTexture(symCanvas);
      const symMat = new THREE.SpriteMaterial({ map: symTex, transparent: true, opacity: 0.85 });
      const sprite = new THREE.Sprite(symMat);

      const angle = (idx / symbols.length) * Math.PI * 2;
      const radius = 2.4 + (idx % 3) * 0.4;
      sprite.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * 1.2 + 0.3,
        Math.sin(angle) * 1.5 - 0.5
      );
      sprite.scale.set(0.65, 0.65, 1);
      sprite.userData = { initialY: sprite.position.y, speed: 0.02 + idx * 0.005 };
      floatingGroup.add(sprite);
      symbolSprites.push(sprite);
    });

    // Ambient Starfield / Particle Constellation
    const particleCount = isMobile ? 180 : 350;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x00f0ff);
    const purpleColor = new THREE.Color(0x9d4edd);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const mixed = Math.random() > 0.5 ? cyanColor : purpleColor;
      particleColors[i * 3] = mixed.r;
      particleColors[i * 3 + 1] = mixed.g;
      particleColors[i * 3 + 2] = mixed.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Resize Handler
    function onResize() {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onResize);

    // Animation Loop
    let tick = 0;
    let isVisible = true;

    // Viewport Intersection Observer to save GPU
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { isVisible = entry.isIntersecting; });
    }, { threshold: 0.1 });
    observer.observe(container);

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      tick++;
      if (tick % 15 === 0) {
        drawScreenContent(tick);
        screenTexture.needsUpdate = true;
      }

      if (!isReducedMotion) {
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        laptopGroup.rotation.y = targetX * 0.45;
        laptopGroup.rotation.x = -targetY * 0.25;

        ringMesh.rotation.z += 0.005;
        ring2Mesh.rotation.z -= 0.003;

        symbolSprites.forEach((sp, i) => {
          sp.position.y = sp.userData.initialY + Math.sin(tick * 0.04 + i) * 0.15;
          sp.position.x += Math.cos(tick * 0.02 + i) * 0.002;
        });

        particles.rotation.y += 0.0008;
      }

      renderer.render(scene, camera);
    }

    animate();
  }

  /* ===================================================================
     2. SKILLS 3D SCENE: INTERACTIVE 3D SKILLS SPHERE
     =================================================================== */
  function initSkillsSphere() {
    const canvas = document.getElementById('skills-sphere-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 7.5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Skill Items from Resume (Only Truth)
    const skillsData = [
      { name: "Python", category: "Language", color: "#00f0ff", icon: "code" },
      { name: "C", category: "Language", color: "#38bdf8", icon: "code" },
      { name: "R", category: "Language", color: "#818cf8", icon: "code" },
      { name: "SQL", category: "Language", color: "#9d4edd", icon: "database" },
      { name: "JavaScript", category: "Language", color: "#facc15", icon: "code" },
      { name: "HTML", category: "Web", color: "#f97316", icon: "layout" },
      { name: "CSS", category: "Web", color: "#38bdf8", icon: "layout" },
      { name: "Bootstrap", category: "Web", color: "#a855f7", icon: "layout" },
      { name: "Pandas", category: "Library", color: "#10b981", icon: "cpu" },
      { name: "NumPy", category: "Library", color: "#06b6d4", icon: "cpu" },
      { name: "Seaborn", category: "Library", color: "#3b82f6", icon: "bar-chart-2" },
      { name: "Matplotlib", category: "Library", color: "#00f0ff", icon: "bar-chart" },
      { name: "VS Code", category: "Tool", color: "#0284c7", icon: "terminal" },
      { name: "Turbo C", category: "Tool", color: "#64748b", icon: "terminal" },
      { name: "Google Colab", category: "Tool", color: "#f59e0b", icon: "cloud" },
      { name: "Jupyter Notebook", category: "Tool", color: "#ea580c", icon: "book-open" },
      { name: "Online Learning", category: "Soft Skill", color: "#ec4899", icon: "award" },
      { name: "Leadership Skills", category: "Soft Skill", color: "#8b5cf6", icon: "users" },
      { name: "Communication Skills", category: "Soft Skill", color: "#14b8a6", icon: "message-square" }
    ];

    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Center Core Glow
    const coreGeo = new THREE.SphereGeometry(1.2, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    sphereGroup.add(new THREE.Mesh(coreGeo, coreMat));

    // Distribute skills along Fibonacci Sphere
    const total = skillsData.length;
    const sphereRadius = 3.6;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    const interactiveObjects = [];

    skillsData.forEach((skill, i) => {
      const y = 1 - (i / (total - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Create Text Sprite
      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = 256;
      spriteCanvas.height = 80;
      const sCtx = spriteCanvas.getContext('2d');

      // Tag pill background
      sCtx.fillStyle = 'rgba(14, 20, 36, 0.88)';
      sCtx.strokeStyle = skill.color;
      sCtx.lineWidth = 3;
      sCtx.beginPath();
      sCtx.roundRect(8, 8, 240, 64, 18);
      sCtx.fill();
      sCtx.stroke();

      // Skill Text
      sCtx.fillStyle = '#ffffff';
      sCtx.font = 'bold 24px "Inter", sans-serif';
      sCtx.textAlign = 'center';
      sCtx.textBaseline = 'middle';
      sCtx.fillText(skill.name, 128, 40);

      const texture = new THREE.CanvasTexture(spriteCanvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.95 });
      const sprite = new THREE.Sprite(material);

      sprite.position.set(x * sphereRadius, y * sphereRadius, z * sphereRadius);
      sprite.scale.set(1.4, 0.45, 1);
      sprite.userData = { skillInfo: skill };

      sphereGroup.add(sprite);
      interactiveObjects.push(sprite);

      // Connecting Node
      const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const nodeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(skill.color) });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(sprite.position);
      sphereGroup.add(nodeMesh);
    });

    // Drag / Touch Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0.002, y: 0.004 };

    function onPointerDown(e) {
      isDragging = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      previousMousePosition = { x: clientX, y: clientY };
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      rotationVelocity.y = deltaX * 0.005;
      rotationVelocity.x = deltaY * 0.005;

      sphereGroup.rotation.y += rotationVelocity.y;
      sphereGroup.rotation.x += rotationVelocity.x;

      previousMousePosition = { x: clientX, y: clientY };
    }

    function onPointerUp() {
      isDragging = false;
    }

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Raycasting for Skill Clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects);

      if (intersects.length > 0) {
        const selected = intersects[0].object.userData.skillInfo;
        if (selected && window.showSkillModal) {
          window.showSkillModal(selected);
        }
      }
    });

    // Resize Handler
    function onSphereResize() {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onSphereResize);

    // Animation Loop
    let isVisible = true;
    const sphereObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { isVisible = entry.isIntersecting; });
    }, { threshold: 0.1 });
    sphereObserver.observe(container);

    function animateSphere() {
      requestAnimationFrame(animateSphere);
      if (!isVisible) return;

      if (!isReducedMotion) {
        if (!isDragging) {
          rotationVelocity.x *= 0.96;
          rotationVelocity.y *= 0.96;

          sphereGroup.rotation.y += rotationVelocity.y + 0.002;
          sphereGroup.rotation.x += rotationVelocity.x;
        }
      }

      renderer.render(scene, camera);
    }

    animateSphere();
  }

  // Initialize all scenes when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initHeroScene();
    initSkillsSphere();
  });

})();
