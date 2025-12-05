// ABOUTME: Canvas-based physics animations for teach-me lesson visuals
// ABOUTME: Each lesson gets an interactive, educational animation

(function() {
  'use strict';

  // Animation registry - maps visual types to their animation functions
  const Animations = {};

  // Utility: Create and setup canvas
  function createCanvas(container, width = 210, height = 180) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    container.innerHTML = '';
    container.appendChild(canvas);
    return canvas.getContext('2d');
  }

  // Utility: Animation loop helper
  function animate(drawFn, ctx) {
    let animationId;
    let running = true;

    function loop() {
      if (!running) return;
      drawFn();
      animationId = requestAnimationFrame(loop);
    }

    loop();

    return {
      stop: () => {
        running = false;
        if (animationId) cancelAnimationFrame(animationId);
      }
    };
  }

  // Color palette (Wikipedia-native, simplified)
  const Colors = {
    primary: '#36c',       // Main accent (Wikipedia blue)
    secondary: '#54595d',  // Muted gray
    nucleus: '#72777d',    // Gray for nucleus particles
    electron: '#36c',      // Blue for electrons
    bg: '#f8f9fa',
    text: '#202122',
    textMuted: '#72777d',
    border: '#c8ccd1',
    // Legacy aliases (for compatibility)
    proton: '#72777d',
    neutron: '#72777d',
    success: '#36c',
    warning: '#54595d'
  };

  // ============================================
  // LESSON 1: What is an Atom? (Orbiting electrons)
  // ============================================
  Animations['atom-basic'] = function(container) {
    const ctx = createCanvas(container);
    const canvas = ctx.canvas;
    const cx = canvas.width / 2, cy = canvas.height / 2;
    let time = 0;

    const electrons = [
      { orbit: 35, speed: 0.02, angle: 0 },
      { orbit: 35, speed: 0.02, angle: Math.PI },
      { orbit: 60, speed: -0.015, angle: Math.PI / 2 },
      { orbit: 60, speed: -0.015, angle: Math.PI * 1.5 }
    ];

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw orbit paths
      ctx.strokeStyle = 'rgba(54, 102, 204, 0.2)';
      ctx.lineWidth = 1;
      [35, 60].forEach(r => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw nucleus (protons + neutrons)
      const pulse = Math.sin(time * 0.08) * 0.1 + 1;
      const nucleons = [
        { x: -5, y: -5, color: Colors.proton },
        { x: 5, y: -5, color: Colors.neutron },
        { x: -5, y: 5, color: Colors.neutron },
        { x: 5, y: 5, color: Colors.proton }
      ];

      nucleons.forEach(n => {
        ctx.beginPath();
        ctx.arc(cx + n.x, cy + n.y, 8 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
      });

      // Draw electrons
      electrons.forEach(e => {
        e.angle += e.speed;
        const ex = cx + Math.cos(e.angle) * e.orbit;
        const ey = cy + Math.sin(e.angle) * e.orbit;

        // Electron
        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, Math.PI * 2);
        ctx.fillStyle = Colors.electron;
        ctx.fill();
      });

      time++;
    }

    return animate(draw, ctx);
  };

  // ============================================
  // LESSON 2: Size & Scale (Simple concentric circles)
  // ============================================
  Animations['scale'] = function(container) {
    const ctx = createCanvas(container);
    const canvas = ctx.canvas;
    const cx = canvas.width / 2, cy = 70;
    let time = 0;

    const items = [
      { label: 'Atom', size: '100 pm', r: 6 },
      { label: 'Virus', size: '100 nm', r: 18 },
      { label: 'Cell', size: '10 μm', r: 35 },
      { label: 'Hair', size: '100 μm', r: 55 }
    ];

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pulse = 1 + Math.sin(time * 0.03) * 0.05;
      const active = Math.floor((time / 90) % items.length);

      // Draw concentric circles
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const r = item.r * pulse;
        const isActive = i === active;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? 'rgba(54, 102, 204, 0.3)' : 'rgba(114, 119, 125, 0.15)';
        ctx.fill();
        ctx.strokeStyle = isActive ? Colors.primary : Colors.border;
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.stroke();
      }

      // Legend
      ctx.font = '10px -apple-system, sans-serif';
      let ly = 140;
      items.forEach((item, i) => {
        const isActive = i === active;
        ctx.fillStyle = isActive ? Colors.primary : Colors.textMuted;
        ctx.textAlign = 'left';
        ctx.fillText(item.label, 20, ly);
        ctx.textAlign = 'right';
        ctx.fillText(item.size, canvas.width - 20, ly);
        ly += 14;
      });

      time++;
    }

    return animate(draw, ctx);
  };

  // ============================================
  // LESSON 3: Mass Distribution (Simple donut chart)
  // ============================================
  Animations['mass'] = function(container) {
    const ctx = createCanvas(container);
    const canvas = ctx.canvas;
    const cx = canvas.width / 2, cy = 70;
    const radius = 50;
    let time = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Nucleus portion (99.94%)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, 0, Math.PI * 2 * 0.9994);
      ctx.closePath();
      ctx.fillStyle = Colors.nucleus;
      ctx.fill();

      // Electron portion (0.06%) with pulse
      const pulse = 1 + Math.sin(time * 0.1) * 0.2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius * pulse, Math.PI * 2 * 0.9994, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = Colors.electron;
      ctx.fill();

      // Center hole
      ctx.beginPath();
      ctx.arc(cx, cy, 25, 0, Math.PI * 2);
      ctx.fillStyle = Colors.bg;
      ctx.fill();

      // Center text
      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 12px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('99.94%', cx, cy + 4);

      // Legend
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = Colors.nucleus;
      ctx.fillRect(30, 145, 10, 10);
      ctx.fillStyle = Colors.text;
      ctx.fillText('Nucleus', 44, 154);

      ctx.fillStyle = Colors.electron;
      ctx.fillRect(30, 162, 10, 10);
      ctx.fillStyle = Colors.text;
      ctx.fillText('Electrons (0.06%)', 44, 171);

      time++;
    }

    return animate(draw, ctx);
  };

  // ============================================
  // LESSON 4: Electric Charge (Ion animation)
  // ============================================
  Animations['charge'] = function(container) {
    const ctx = createCanvas(container);
    let time = 0;
    let transferPhase = 0; // 0-100 for electron transfer animation

    function drawAtom(x, y, protons, electrons, label, sublabel, charge) {
      // Nucleus
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fillStyle = Colors.proton + '40';
      ctx.fill();
      ctx.strokeStyle = Colors.proton;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Proton count
      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 12px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(protons + '+', x, y + 4);

      // Electrons orbiting
      for (let i = 0; i < electrons; i++) {
        const angle = (Math.PI * 2 / electrons) * i + time * 0.02;
        const ex = x + Math.cos(angle) * 32;
        const ey = y + Math.sin(angle) * 32;

        ctx.beginPath();
        ctx.arc(ex, ey, 5, 0, Math.PI * 2);
        ctx.fillStyle = Colors.electron;
        ctx.fill();
      }

      // Pulsing charge labels for charged ions
      if (charge !== 0) {
        const pulse = 1 + Math.sin(time * 0.08) * 0.2;
        const glowSize = 25 * pulse;

        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        if (charge > 0) {
          gradient.addColorStop(0, 'rgba(221, 51, 51, 0.3)');
          gradient.addColorStop(1, 'rgba(221, 51, 51, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(54, 102, 204, 0.3)');
          gradient.addColorStop(1, 'rgba(54, 102, 204, 0)');
        }
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Labels
      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 11px -apple-system, sans-serif';
      ctx.fillText(label, x, y + 55);
      ctx.font = '10px -apple-system, sans-serif';
      ctx.fillStyle = Colors.textMuted;
      ctx.fillText(sublabel, x, y + 68);
    }

    function draw() {
      ctx.clearRect(0, 0, 260, 280);

      // Draw orbit rings
      [[65, 70], [130, 70], [195, 70]].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 32, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(54, 102, 204, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Neutral atom (11p, 11e - Sodium)
      drawAtom(65, 70, 11, 11, 'Neutral', '11p = 11e', 0);

      // Cation (11p, 10e - Na+)
      drawAtom(130, 70, 11, 10, 'Cation +', '11p > 10e', 1);

      // Anion (17p, 18e - Cl-)
      drawAtom(195, 70, 17, 18, 'Anion −', '17p < 18e', -1);

      // Electron transfer animation (Na → Cl)
      transferPhase = (transferPhase + 0.5) % 200;
      if (transferPhase < 100) {
        const progress = transferPhase / 100;
        const startX = 130;
        const startY = 70;
        const endX = 195;
        const endY = 70;

        // Electron position during transfer
        const ex = startX + (endX - startX) * progress;
        const ey = startY + (endY - startY) * progress + Math.sin(progress * Math.PI) * -20;

        // Draw transferring electron
        ctx.beginPath();
        ctx.arc(ex, ey, 6, 0, Math.PI * 2);
        ctx.fillStyle = Colors.electron;
        ctx.fill();

        // Trail effect
        ctx.strokeStyle = Colors.electron + '60';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(startX + (endX - startX) / 2, startY - 20, ex, ey);
        ctx.stroke();
      }

      // Attraction/repulsion visualization
      const forceY = 150;

      // Na+ and Cl- attraction (force lines)
      for (let i = 0; i < 3; i++) {
        const offset = (i - 1) * 8;
        const wave = Math.sin(time * 0.05 + i * 0.5) * 2;

        ctx.strokeStyle = Colors.success + '40';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(130, forceY + offset);
        ctx.quadraticCurveTo(162.5, forceY + offset + wave, 195, forceY + offset);
        ctx.stroke();

        // Arrow heads
        ctx.fillStyle = Colors.success + '40';
        ctx.beginPath();
        ctx.moveTo(195, forceY + offset);
        ctx.lineTo(190, forceY + offset - 3);
        ctx.lineTo(190, forceY + offset + 3);
        ctx.closePath();
        ctx.fill();
      }

      // Labels for charges
      ctx.fillStyle = Colors.proton;
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+', 130, forceY - 8);

      ctx.fillStyle = Colors.electron;
      ctx.fillText('−', 195, forceY - 8);

      ctx.fillStyle = Colors.textMuted;
      ctx.font = '9px -apple-system, sans-serif';
      ctx.fillText('attraction', 162.5, forceY + 25);

      // Explanation
      ctx.fillStyle = Colors.textMuted;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Opposite charges attract • Like charges repel', 130, 260);

      time++;
    }

    return animate(draw, ctx);
  };


  // ============================================
  // LESSON 5: Subatomic Particles (Comparison)
  // ============================================
  Animations['particles'] = function(container) {
    const ctx = createCanvas(container);
    const canvas = container.querySelector('canvas');
    let time = 0;
    let selectedParticle = null;
    let hoverParticle = null;
    let massBarProgress = 0;

    const particles = [
      { name: 'Proton', symbol: 'p⁺', charge: '+1', mass: '1.673×10⁻²⁷ kg', color: Colors.proton, x: 65, hasQuarks: true },
      { name: 'Neutron', symbol: 'n⁰', charge: '0', mass: '1.675×10⁻²⁷ kg', color: Colors.neutron, x: 130, hasQuarks: true },
      { name: 'Electron', symbol: 'e⁻', charge: '−1', mass: '9.11×10⁻³¹ kg', color: Colors.electron, x: 195, hasQuarks: false }
    ];

    // Click handler for particle selection
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const y = 80;

      particles.forEach((p, i) => {
        const bounce = Math.sin(time * 0.05 + i * 0.5) * 3;
        const size = p.name === 'Electron' ? 8 : 35;
        const dist = Math.sqrt((mouseX - p.x) ** 2 + (mouseY - (y + bounce)) ** 2);
        if (dist < size) {
          selectedParticle = selectedParticle === i ? null : i;
        }
      });
    });

    // Hover handler for quark visualization
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const y = 80;

      let foundHover = null;
      particles.forEach((p, i) => {
        const bounce = Math.sin(time * 0.05 + i * 0.5) * 3;
        const size = p.name === 'Electron' ? 8 : 35;
        const dist = Math.sqrt((mouseX - p.x) ** 2 + (mouseY - (y + bounce)) ** 2);
        if (dist < size) {
          foundHover = i;
        }
      });
      hoverParticle = foundHover;
      canvas.style.cursor = foundHover !== null ? 'pointer' : 'default';
    });

    function draw() {
      ctx.clearRect(0, 0, 260, 280);

      particles.forEach((p, i) => {
        const y = 80;
        const bounce = Math.sin(time * 0.05 + i * 0.5) * 3;
        const isSelected = selectedParticle === i;
        const isHovered = hoverParticle === i;

        // Size-to-scale visualization: electron is tiny
        const size = p.name === 'Electron' ? 8 : 35;

        // Highlight ring if selected
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(p.x, y + bounce, size + 6, 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Particle circle
        ctx.beginPath();
        ctx.arc(p.x, y + bounce, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Show quarks on hover for proton/neutron
        if (isHovered && p.hasQuarks) {
          const quarkSize = 6;
          const quarkPositions = p.name === 'Proton'
            ? [{x: -8, y: -5, label: 'u'}, {x: 8, y: -5, label: 'u'}, {x: 0, y: 8, label: 'd'}]
            : [{x: -8, y: -5, label: 'd'}, {x: 8, y: -5, label: 'd'}, {x: 0, y: 8, label: 'u'}];

          quarkPositions.forEach(q => {
            ctx.beginPath();
            ctx.arc(p.x + q.x, y + bounce + q.y, quarkSize, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = Colors.text;
            ctx.font = 'bold 8px -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(q.label, p.x + q.x, y + bounce + q.y + 3);
          });
        } else {
          // Symbol (only show when not hovering with quarks)
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 14px -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(p.symbol, p.x, y + bounce + 5);
        }

        // Name
        ctx.fillStyle = Colors.text;
        ctx.font = 'bold 11px -apple-system, sans-serif';
        ctx.fillText(p.name, p.x, y + 55);

        // Charge
        ctx.fillStyle = Colors.textMuted;
        ctx.font = '10px -apple-system, sans-serif';
        ctx.fillText('Charge: ' + p.charge, p.x, y + 70);

        // Detailed properties panel if selected
        if (isSelected) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2;
          ctx.fillRect(15, 145, 230, 30);
          ctx.strokeRect(15, 145, 230, 30);

          ctx.fillStyle = Colors.text;
          ctx.font = 'bold 10px -apple-system, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(p.name + ' Properties:', 20, 158);
          ctx.font = '9px -apple-system, sans-serif';
          ctx.fillStyle = Colors.textMuted;
          ctx.fillText('Mass: ' + p.mass, 20, 170);
          if (p.hasQuarks) {
            ctx.fillText(p.name === 'Proton' ? 'Quarks: 2 up, 1 down' : 'Quarks: 1 up, 2 down', 140, 170);
          } else {
            ctx.fillText('Elementary particle (no substructure)', 140, 170);
          }
        }
      });

      // Mass comparison note
      ctx.fillStyle = Colors.textMuted;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('It takes 1,836 electrons to equal one proton\'s mass', 130, 190);

      // Animated mass comparison bar
      if (massBarProgress < 1) {
        massBarProgress += 0.01;
      }

      ctx.fillStyle = Colors.bg;
      ctx.fillRect(40, 205, 180, 12);
      ctx.strokeStyle = Colors.border;
      ctx.strokeRect(40, 205, 180, 12);

      // Proton mass bar (animated fill)
      ctx.fillStyle = Colors.proton;
      ctx.fillRect(40, 205, 180 * massBarProgress, 12);

      // Electron mass bar (tiny sliver)
      ctx.fillStyle = Colors.electron;
      ctx.fillRect(40, 205, 0.1 * massBarProgress, 12);

      ctx.fillStyle = Colors.text;
      ctx.font = '9px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Proton mass', 40, 233);
      ctx.textAlign = 'right';
      ctx.fillText('Electron (to scale: barely visible)', 220, 233);

      // Interaction hint
      ctx.fillStyle = Colors.textMuted;
      ctx.font = 'italic 8px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Click a particle for details • Hover proton/neutron to see quarks', 130, 255);

      time++;
    }

    return animate(draw, ctx);
  };

  // ============================================
  // LESSON 6: Inside the Nucleus
  // ============================================
  Animations['nucleus'] = function(container) {
    const ctx = createCanvas(container);
    let time = 0;
    let zoomLevel = 0;

    // Create nucleons with random positions
    const nucleons = [];
    for (let i = 0; i < 12; i++) {
      nucleons.push({
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        isProton: i < 6
      });
    }

    function draw() {
      ctx.clearRect(0, 0, 260, 280);
      const cx = 130, cy = 110;

      // Zoom-in effect for first 60 frames to emphasize tiny scale
      if (time < 60) {
        zoomLevel = Math.min(1, zoomLevel + 0.02);
        const scale = 0.3 + (zoomLevel * 0.7);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.translate(-cx, -cy);
      }

      // Nuclear force range boundary - animated pulsing shows 1fm limit
      const rangePulse = 1 + Math.sin(time * 0.04) * 0.05;
      ctx.fillStyle = 'rgba(20, 134, 109, 0.08)';
      ctx.beginPath();
      ctx.arc(cx, cy, 55 * rangePulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(20, 134, 109, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Update and draw nucleons
      nucleons.forEach(n => {
        // Move
        n.x += n.vx;
        n.y += n.vy;

        // Bounce off boundary
        const dist = Math.sqrt(n.x * n.x + n.y * n.y);
        if (dist > 40) {
          n.vx *= -0.8;
          n.vy *= -0.8;
          const angle = Math.atan2(n.y, n.x);
          n.x = Math.cos(angle) * 40;
          n.y = Math.sin(angle) * 40;
        }

        // Draw nucleon
        ctx.beginPath();
        ctx.arc(cx + n.x, cy + n.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = n.isProton ? Colors.proton : Colors.neutron;
        ctx.fill();
      });

      // Force lines - stronger/brighter when particles are closer
      for (let i = 0; i < nucleons.length; i++) {
        for (let j = i + 1; j < nucleons.length; j++) {
          const n1 = nucleons[i], n2 = nucleons[j];
          const d = Math.sqrt((n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2);
          if (d < 30) {
            const strength = 1 - (d / 30);
            const alpha = 0.1 + (strength * 0.4);
            ctx.strokeStyle = `rgba(20, 134, 109, ${alpha})`;
            ctx.lineWidth = 1 + (strength * 2);
            ctx.beginPath();
            ctx.moveTo(cx + n1.x, cy + n1.y);
            ctx.lineTo(cx + n2.x, cy + n2.y);
            ctx.stroke();
          }
        }
      }

      // Repulsion arrows between protons - showing EM repulsion they overcome
      const protons = nucleons.filter(n => n.isProton);
      for (let i = 0; i < protons.length; i++) {
        for (let j = i + 1; j < protons.length; j++) {
          const p1 = protons[i], p2 = protons[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 25 && Math.random() < 0.3) {
            const angle = Math.atan2(dy, dx);
            const arrowLen = 8;

            ctx.strokeStyle = 'rgba(212, 107, 8, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx + p1.x - Math.cos(angle) * 12, cy + p1.y - Math.sin(angle) * 12);
            ctx.lineTo(cx + p1.x - Math.cos(angle) * (12 + arrowLen), cy + p1.y - Math.sin(angle) * (12 + arrowLen));
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cx + p2.x + Math.cos(angle) * 12, cy + p2.y + Math.sin(angle) * 12);
            ctx.lineTo(cx + p2.x + Math.cos(angle) * (12 + arrowLen), cy + p2.y + Math.sin(angle) * (12 + arrowLen));
            ctx.stroke();
          }
        }
      }

      if (time < 60) {
        ctx.restore();
      }

      // Labels
      ctx.fillStyle = Colors.textMuted;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Strong force range (~1 fm)', cx, cy + 75);

      // Legend
      ctx.font = '11px -apple-system, sans-serif';
      ctx.textAlign = 'left';

      ctx.fillStyle = Colors.proton;
      ctx.beginPath();
      ctx.arc(50, 210, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = Colors.text;
      ctx.fillText('Protons (6)', 62, 214);

      ctx.fillStyle = Colors.neutron;
      ctx.beginPath();
      ctx.arc(50, 230, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = Colors.text;
      ctx.fillText('Neutrons (6)', 62, 234);

      ctx.fillStyle = Colors.success;
      ctx.fillText('— Strong nuclear force', 130, 224);

      ctx.fillStyle = Colors.warning;
      ctx.fillText('← EM repulsion', 130, 238);

      time++;
    }

    return animate(draw, ctx);
  };

  // ============================================
  // LESSON 7: Electron Cloud & Orbitals
  // ============================================
  Animations['orbitals'] = function(container) {
    const ctx = createCanvas(container);
    let time = 0;
    let rotationAngle = 0;
    let transitionPhase = 0;
    let particles = [];

    // Initialize probability density particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 35,
        speed: Math.random() * 0.02 + 0.01,
        life: Math.random() * 60
      });
    }

    function draw() {
      ctx.clearRect(0, 0, 260, 280);
      const cx = 130, cy = 100;

      // 3D rotation effect - slowly rotate orbitals
      rotationAngle += 0.005;

      // Transition animation (Bohr to quantum cloud)
      if (time < 60) {
        transitionPhase = 0;
      } else if (time < 120) {
        transitionPhase = (time - 60) / 60;
      } else {
        transitionPhase = 1;
      }

      // Reset time to loop transition
      if (time > 300) time = 0;

      // s-orbital (sphere) with 3D rotation effect
      const sRadius = 35 + Math.sin(time * 0.03) * 3;
      const sGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, sRadius);
      sGradient.addColorStop(0, `rgba(54, 102, 204, ${0.5 * transitionPhase})`);
      sGradient.addColorStop(0.7, `rgba(54, 102, 204, ${0.2 * transitionPhase})`);
      sGradient.addColorStop(1, 'rgba(54, 102, 204, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, sRadius, 0, Math.PI * 2);
      ctx.fillStyle = sGradient;
      ctx.fill();

      // Draw Bohr orbit during early transition phase
      if (transitionPhase < 1) {
        ctx.strokeStyle = `rgba(54, 102, 204, ${0.3 * (1 - transitionPhase)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting electron in Bohr model
        const bohrAngle = time * 0.05;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(bohrAngle) * 40, cy + Math.sin(bohrAngle) * 40, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(54, 102, 204, ${1 - transitionPhase})`;
        ctx.fill();
      }

      // Probability density particles - appear more in high-probability regions
      particles.forEach(p => {
        p.angle += p.speed;
        p.life++;

        // Reset particle when life expires
        if (p.life > 60) {
          p.life = 0;
          p.distance = Math.random() * 35;
        }

        // Particles appear more frequently near nucleus (high probability)
        const prob = 1 - (p.distance / 35);
        const alpha = (Math.sin(p.life * 0.1) * 0.5 + 0.5) * prob * transitionPhase;

        if (alpha > 0.1) {
          const px = cx + Math.cos(p.angle) * p.distance;
          const py = cy + Math.sin(p.angle) * p.distance;

          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(54, 102, 204, ${alpha})`;
          ctx.fill();
        }
      });

      // p-orbital (dumbbell) with 3D rotation
      const pOffset = 55;
      const pPulse = 1 + Math.sin(time * 0.04) * 0.1;
      const perspectiveX = Math.cos(rotationAngle) * 5;

      ctx.fillStyle = `rgba(20, 134, 109, ${0.3 * transitionPhase})`;
      ctx.beginPath();
      ctx.ellipse(cx + perspectiveX, cy - pOffset * pPulse, 18, 30, rotationAngle * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + perspectiveX, cy + pOffset * pPulse, 18, 30, rotationAngle * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // d-orbital (cloverleaf pattern) - third visualization
      const dRadius = 25;
      const dDistance = 80;
      ctx.fillStyle = `rgba(212, 107, 8, ${0.25 * transitionPhase})`;

      // Four lobes in cloverleaf pattern
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i + rotationAngle;
        const lobeCx = cx + Math.cos(angle) * dDistance;
        const lobeCy = cy + Math.sin(angle) * dDistance;

        ctx.beginPath();
        ctx.ellipse(lobeCx, lobeCy, dRadius * Math.cos(rotationAngle * 0.5 + i) * 0.3 + dRadius * 0.7, dRadius, angle, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nucleus dot
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = Colors.proton;
      ctx.fill();

      // Labels
      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 11px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('s-orbital', cx - 70, cy + 5);
      ctx.fillText('p-orbital', cx, cy - 75);
      ctx.fillText('d-orbital', cx + 70, cy + 5);

      // Explanation
      ctx.fillStyle = Colors.textMuted;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.fillText('Orbitals show probability of finding electron', cx, 200);
      ctx.fillText('Denser color = higher probability', cx, 215);

      // Probability indicator
      ctx.fillStyle = Colors.electron;
      const probGradient = ctx.createLinearGradient(60, 240, 200, 240);
      probGradient.addColorStop(0, 'rgba(54, 102, 204, 0.1)');
      probGradient.addColorStop(1, 'rgba(54, 102, 204, 0.8)');
      ctx.fillStyle = probGradient;
      ctx.fillRect(60, 235, 140, 10);

      ctx.fillStyle = Colors.textMuted;
      ctx.font = '9px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Low', 60, 258);
      ctx.textAlign = 'right';
      ctx.fillText('High', 200, 258);

      time++;
    }

    return animate(draw, ctx);
  };

  // ============================================
  // LESSON 8: Isotopes
  // ============================================
  Animations['isotopes'] = function(container) {
    const ctx = createCanvas(container);
    let time = 0;
    let currentIsotope = 0;
    let transitionTime = 0;

    const isotopes = [
      { name: 'Protium', symbol: '¹H', neutrons: 0, mass: 1, stable: true },
      { name: 'Deuterium', symbol: '²H', neutrons: 1, mass: 2, stable: true },
      { name: 'Tritium', symbol: '³H', neutrons: 2, mass: 3, stable: false }
    ];

    const stabilityColors = {
      stable: '#14866d',
      unstable: '#d46b08'
    };

    function draw() {
      ctx.clearRect(0, 0, 260, 280);

      // Auto-cycle through isotopes
      transitionTime++;
      if (transitionTime > 100) {
        transitionTime = 0;
        currentIsotope = (currentIsotope + 1) % isotopes.length;
      }

      const iso = isotopes[currentIsotope];
      const y = 90;
      const x = 130;
      const electronAngle = time * 0.03;

      // Stability indicator background
      const stabilityColor = iso.stable ? stabilityColors.stable : stabilityColors.unstable;
      ctx.fillStyle = stabilityColor + '20';
      ctx.fillRect(0, 0, 260, 280);

      // Electron orbit
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(54, 102, 204, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Electron
      const ex = x + Math.cos(electronAngle) * 35;
      const ey = y + Math.sin(electronAngle) * 35;
      ctx.beginPath();
      ctx.arc(ex, ey, 4, 0, Math.PI * 2);
      ctx.fillStyle = Colors.electron;
      ctx.fill();

      // Proton (always 1 for hydrogen)
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fillStyle = Colors.proton;
      ctx.fill();

      // Neutrons arranged around proton
      for (let n = 0; n < iso.neutrons; n++) {
        const angle = (Math.PI * 2 / Math.max(3, iso.neutrons)) * n + Math.PI / 6;
        const nx = x + Math.cos(angle) * 10;
        const ny = y + Math.sin(angle) * 10;
        ctx.beginPath();
        ctx.arc(nx, ny, 8, 0, Math.PI * 2);
        ctx.fillStyle = Colors.neutron;
        ctx.fill();
      }

      // Symbol (top center)
      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 24px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(iso.symbol, x, 40);

      // Name
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.fillStyle = Colors.text;
      ctx.fillText(iso.name, x, y + 60);

      // Neutron counter
      ctx.fillStyle = Colors.textMuted;
      ctx.font = '12px -apple-system, sans-serif';
      ctx.fillText(`Neutrons: ${iso.neutrons}`, x, y + 78);

      // Mass number display
      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 18px -apple-system, sans-serif';
      ctx.fillText(`Mass: ${iso.mass}`, x, y + 100);

      // Stability indicator
      ctx.fillStyle = stabilityColor;
      ctx.font = 'bold 12px -apple-system, sans-serif';
      ctx.fillText(iso.stable ? '✓ Stable' : '⚠ Radioactive', x, y + 120);

      // Side-by-side comparison (small versions)
      const miniY = 200;
      isotopes.forEach((miniIso, i) => {
        const miniX = 50 + i * 70;
        const isActive = i === currentIsotope;
        const opacity = isActive ? 1 : 0.4;

        // Mini nucleus
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(miniX, miniY, 8, 0, Math.PI * 2);
        ctx.fillStyle = Colors.proton;
        ctx.fill();

        // Mini neutrons
        for (let n = 0; n < miniIso.neutrons; n++) {
          ctx.beginPath();
          ctx.arc(miniX + 6, miniY - 6 + n * 6, 4, 0, Math.PI * 2);
          ctx.fillStyle = Colors.neutron;
          ctx.fill();
        }

        // Label
        ctx.fillStyle = isActive ? Colors.text : Colors.textMuted;
        ctx.font = isActive ? 'bold 10px -apple-system, sans-serif' : '9px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(miniIso.symbol, miniX, miniY + 25);

        ctx.globalAlpha = 1;
      });

      // Progress indicators
      ctx.fillStyle = Colors.border;
      for (let i = 0; i < isotopes.length; i++) {
        ctx.beginPath();
        ctx.arc(130 - 20 + i * 20, 260, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = Colors.electron;
      ctx.beginPath();
      ctx.arc(130 - 20 + currentIsotope * 20, 260, 5, 0, Math.PI * 2);
      ctx.fill();

      time++;
    }

    return animate(draw, ctx);
  };


  // ============================================
  // LESSON 9: Atomic Mass
  // ============================================
  Animations['mass-number'] = function(container) {
    const ctx = createCanvas(container);
    let time = 0;
    let calculatorPhase = 0;

    function draw() {
      ctx.clearRect(0, 0, 260, 280);
      const cx = 130, cy = 85;

      // Element box with pulsing highlight on mass number
      const massNumPulse = Math.sin(time * 0.08) * 0.15 + 1;
      ctx.strokeStyle = Colors.electron;
      ctx.lineWidth = 3;
      ctx.strokeRect(cx - 50, cy - 60, 100, 120);
      ctx.fillStyle = '#fff';
      ctx.fillRect(cx - 48, cy - 58, 96, 116);

      // Mass number (top left) with pulsing highlight
      const massGlow = massNumPulse > 1.1 ? `rgba(212, 107, 8, ${(massNumPulse - 1) * 2})` : 'transparent';
      ctx.fillStyle = massGlow;
      ctx.fillRect(cx - 45, cy - 50, 20, 16);

      // Mass number (top left)
      ctx.fillStyle = Colors.textMuted;
      ctx.font = '14px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('12', cx - 40, cy - 40);

      // Atomic number (bottom left)
      ctx.fillText('6', cx - 40, cy + 50);

      // Element symbol
      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 48px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('C', cx, cy + 15);

      // Annotations with animated arrows
      const arrowPulse = Math.sin(time * 0.05) * 3;

      // Mass number annotation with formula
      ctx.strokeStyle = Colors.warning;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + 55, cy - 45);
      ctx.lineTo(cx + 80 + arrowPulse, cy - 45);
      ctx.stroke();
      ctx.fillStyle = Colors.warning;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Mass number (A)', cx + 85, cy - 50);
      ctx.fillText('A = Z + N', cx + 85, cy - 38);

      // Atomic number annotation
      ctx.strokeStyle = Colors.success;
      ctx.beginPath();
      ctx.moveTo(cx - 55, cy + 45);
      ctx.lineTo(cx - 80 - arrowPulse, cy + 45);
      ctx.stroke();
      ctx.fillStyle = Colors.success;
      ctx.textAlign = 'right';
      ctx.fillText('Atomic number (Z)', cx - 85, cy + 40);
      ctx.fillText('= protons', cx - 85, cy + 52);

      // Interactive A=Z+N calculator - animated breakdown
      calculatorPhase = (time / 60) % 3;

      ctx.fillStyle = Colors.text;
      ctx.font = '11px -apple-system, sans-serif';
      ctx.textAlign = 'center';

      if (calculatorPhase < 1) {
        // Show protons
        ctx.fillStyle = Colors.proton;
        ctx.fillText('6 protons (Z)', cx, cy + 90);
      } else if (calculatorPhase < 2) {
        // Show neutrons
        ctx.fillStyle = Colors.neutron;
        ctx.fillText('+ 6 neutrons (N)', cx, cy + 90);
      } else {
        // Show result
        ctx.fillStyle = Colors.warning;
        ctx.fillText('= 12 mass number (A)', cx, cy + 90);
      }

      // Periodic table connection - show element position
      ctx.strokeStyle = Colors.border;
      ctx.lineWidth = 1;
      ctx.strokeRect(25, 180, 210, 70);

      ctx.fillStyle = Colors.textMuted;
      ctx.font = '9px -apple-system, sans-serif';
      ctx.fillText('Periodic Table Position', cx, 195);

      // Mini periodic table with Carbon highlighted
      const periodicX = 40;
      const periodicY = 210;
      const cellSize = 18;

      for (let i = 0; i < 10; i++) {
        const x = periodicX + (i % 5) * (cellSize + 2);
        const y = periodicY + Math.floor(i / 5) * (cellSize + 2);

        if (i === 5) {
          // Carbon - highlighted
          ctx.fillStyle = Colors.warning + '40';
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.strokeStyle = Colors.warning;
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, cellSize, cellSize);

          ctx.fillStyle = Colors.text;
          ctx.font = 'bold 11px -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('C', x + cellSize/2, y + cellSize/2 + 4);
        } else {
          ctx.strokeStyle = Colors.border;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }

      // Mass in daltons
      ctx.fillStyle = Colors.electron;
      ctx.font = 'bold 11px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Mass ≈ 12 Da', 145, 225);

      ctx.fillStyle = Colors.textMuted;
      ctx.font = '9px -apple-system, sans-serif';
      ctx.fillText('(12 × 1.66×10⁻²⁷ kg)', 145, 238);

      time++;
    }

    return animate(draw, ctx);
  };

    // ============================================
  // LESSON 10: Atomic Size (Clean, focused design)
  // ============================================
  Animations['size'] = function(container) {
    const ctx = createCanvas(container);
    let time = 0;

    // Four atoms showing size progression
    const atoms = [
      { symbol: 'He', radius: 32, color: '#a855f7' },
      { symbol: 'C', radius: 77, color: Colors.electron },
      { symbol: 'Fe', radius: 126, color: Colors.warning },
      { symbol: 'Cs', radius: 265, color: Colors.proton }
    ];

    // Scale display radii proportionally (smallest=10, largest=40)
    const minR = 10, maxR = 40;
    const minRadius = 32, maxRadius = 265;
    atoms.forEach(a => {
      a.displayR = minR + (a.radius - minRadius) / (maxRadius - minRadius) * (maxR - minR);
    });

    function draw() {
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cy = 75;

      // Calculate total width to center the atoms
      let totalWidth = 0;
      atoms.forEach((a, i) => {
        totalWidth += a.displayR * 2;
        if (i < atoms.length - 1) totalWidth += 12;
      });

      let x = (W - totalWidth) / 2;

      // Draw atoms
      atoms.forEach((atom, i) => {
        const bounce = Math.sin(time * 0.03 + i * 0.7) * 3;
        const centerX = x + atom.displayR;

        // Glow effect
        const gradient = ctx.createRadialGradient(centerX, cy + bounce, 0, centerX, cy + bounce, atom.displayR * 1.3);
        gradient.addColorStop(0, atom.color + '40');
        gradient.addColorStop(1, atom.color + '00');
        ctx.beginPath();
        ctx.arc(centerX, cy + bounce, atom.displayR * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Atom circle
        ctx.beginPath();
        ctx.arc(centerX, cy + bounce, atom.displayR, 0, Math.PI * 2);
        ctx.fillStyle = atom.color + '30';
        ctx.fill();
        ctx.strokeStyle = atom.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Symbol
        ctx.fillStyle = Colors.text;
        ctx.font = `bold ${Math.max(10, atom.displayR * 0.5)}px -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(atom.symbol, centerX, cy + bounce + 4);

        // Radius below
        ctx.fillStyle = Colors.textMuted;
        ctx.font = '9px -apple-system, sans-serif';
        ctx.fillText(atom.radius + ' pm', centerX, cy + atom.displayR + 20 + bounce);

        x += atom.displayR * 2 + 12;
      });

      // Size trend label
      ctx.fillStyle = Colors.textMuted;
      ctx.font = '9px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('← Smaller          Larger →', W / 2, H - 8);

      time++;
    }

    return animate(draw, ctx);
  };

  // ============================================
  // LESSON 11: Radioactive Decay
  // ============================================
  Animations['decay'] = function(container) {
    const ctx = createCanvas(container);
    let time = 0;
    let particles = [];
    let decayPhase = 0; // 0: parent, 1: daughter, 2: granddaughter
    let phaseTimer = 0;
    let sampleCount = 16; // Half-life visualization
    let halfLifeTimer = 0;
    let geigerClicks = [];

    function emitParticle(type, fromX, fromY) {
      particles.push({
        type,
        x: fromX || 130,
        y: fromY || 80,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 3 - 1,
        life: 60
      });

      // Add Geiger counter click effect
      geigerClicks.push({
        x: (fromX || 130) + (Math.random() - 0.5) * 40,
        y: (fromY || 80) + (Math.random() - 0.5) * 40,
        life: 20,
        size: 15
      });
    }

    function draw() {
      ctx.clearRect(0, 0, 260, 280);

      // Decay chain animation (parent → daughter → granddaughter)
      phaseTimer++;
      if (phaseTimer > 150) {
        phaseTimer = 0;
        decayPhase = (decayPhase + 1) % 3;
      }

      const nucleusX = 70;
      const nucleusY = 70;

      // Draw parent nucleus
      if (decayPhase === 0) {
        ctx.beginPath();
        ctx.arc(nucleusX, nucleusY, 30, 0, Math.PI * 2);
        ctx.fillStyle = Colors.proton + '60';
        ctx.fill();
        ctx.strokeStyle = Colors.proton;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = Colors.text;
        ctx.font = 'bold 11px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('U-238', nucleusX, nucleusY - 5);
        ctx.font = '9px -apple-system, sans-serif';
        ctx.fillStyle = Colors.textMuted;
        ctx.fillText('Parent', nucleusX, nucleusY + 8);

        // Emit alpha particle
        if (phaseTimer === 140) {
          emitParticle('alpha', nucleusX, nucleusY);
        }
      }

      // Draw daughter nucleus forming
      if (decayPhase === 1) {
        ctx.beginPath();
        ctx.arc(nucleusX, nucleusY, 28, 0, Math.PI * 2);
        ctx.fillStyle = Colors.success + '60';
        ctx.fill();
        ctx.strokeStyle = Colors.success;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = Colors.text;
        ctx.font = 'bold 11px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Th-234', nucleusX, nucleusY - 5);
        ctx.font = '9px -apple-system, sans-serif';
        ctx.fillStyle = Colors.textMuted;
        ctx.fillText('Daughter', nucleusX, nucleusY + 8);

        // Emit beta particle
        if (phaseTimer === 140) {
          emitParticle('beta', nucleusX, nucleusY);
        }
      }

      // Draw granddaughter nucleus
      if (decayPhase === 2) {
        ctx.beginPath();
        ctx.arc(nucleusX, nucleusY, 26, 0, Math.PI * 2);
        ctx.fillStyle = Colors.electron + '60';
        ctx.fill();
        ctx.strokeStyle = Colors.electron;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = Colors.text;
        ctx.font = 'bold 11px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Pa-234', nucleusX, nucleusY - 5);
        ctx.font = '9px -apple-system, sans-serif';
        ctx.fillStyle = Colors.textMuted;
        ctx.fillText('Granddaughter', nucleusX, nucleusY + 8);

        // Emit gamma ray
        if (phaseTimer === 140) {
          emitParticle('gamma', nucleusX, nucleusY);
        }
      }

      // Update and draw particles
      particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.life--;

        const alpha = p.life / 60;

        if (p.type === 'alpha') {
          ctx.fillStyle = `rgba(221, 51, 51, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = '8px -apple-system, sans-serif';
          ctx.fillText('α', p.x, p.y + 3);
        } else if (p.type === 'beta') {
          ctx.fillStyle = `rgba(114, 119, 125, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Gamma ray (wavy line)
          ctx.strokeStyle = `rgba(212, 107, 8, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(p.x - 10, p.y);
          for (let i = 0; i < 20; i++) {
            ctx.lineTo(p.x - 10 + i, p.y + Math.sin(i + time * 0.3) * 3);
          }
          ctx.stroke();
        }

        return p.life > 0 && p.y < 280;
      });

      // Geiger counter visual clicks
      geigerClicks = geigerClicks.filter(click => {
        click.life--;
        click.size += 1.5;
        const alpha = click.life / 20;

        ctx.strokeStyle = `rgba(212, 107, 8, ${alpha * 0.6})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(click.x, click.y, click.size, 0, Math.PI * 2);
        ctx.stroke();

        return click.life > 0;
      });

      // Half-life visualization with sample count
      halfLifeTimer++;
      if (halfLifeTimer > 100 && sampleCount > 1) {
        halfLifeTimer = 0;
        sampleCount = Math.max(1, Math.floor(sampleCount / 2));
      }

      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 10px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Half-Life Sample:', 145, 65);

      // Draw grid of atoms showing decay
      const gridStartX = 145;
      const gridStartY = 75;
      const atomSize = 8;
      const atomSpacing = 12;

      for (let i = 0; i < 16; i++) {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const x = gridStartX + col * atomSpacing;
        const y = gridStartY + row * atomSpacing;

        if (i < sampleCount) {
          // Active (not decayed)
          ctx.beginPath();
          ctx.arc(x, y, atomSize / 2, 0, Math.PI * 2);
          ctx.fillStyle = Colors.proton;
          ctx.fill();
        } else {
          // Decayed
          ctx.beginPath();
          ctx.arc(x, y, atomSize / 2, 0, Math.PI * 2);
          ctx.fillStyle = Colors.border;
          ctx.fill();
        }
      }

      ctx.fillStyle = Colors.textMuted;
      ctx.font = '9px -apple-system, sans-serif';
      ctx.fillText(`${sampleCount}/16 remain`, 155, 130);

      // Decay types legend
      const types = [
        { name: 'Alpha (α)', desc: 'Helium nucleus', color: Colors.proton, y: 170 },
        { name: 'Beta (β)', desc: 'Electron/positron', color: Colors.neutron, y: 195 },
        { name: 'Gamma (γ)', desc: 'High-energy photon', color: Colors.warning, y: 220 }
      ];

      types.forEach(t => {
        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.arc(30, t.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = Colors.text;
        ctx.font = 'bold 10px -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(t.name, 42, t.y + 3);

        ctx.fillStyle = Colors.textMuted;
        ctx.font = '9px -apple-system, sans-serif';
        ctx.fillText(t.desc, 110, t.y + 3);
      });

      // Decay chain label
      ctx.fillStyle = Colors.textMuted;
      ctx.font = '9px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Decay chain in action', nucleusX, 115);

      time++;
    }

    return animate(draw, ctx);
  };

// ============================================
  // LESSON 12: Magnetic Properties (IMPROVED VERSION)
  // ============================================
  Animations['magnetic'] = function(container) {
    const ctx = createCanvas(container);
    let time = 0;
    let alignmentPhase = 0;

    // Domain arrows (initially random)
    const domains = [];
    for (let i = 0; i < 6; i++) {
      domains.push({
        x: 180 + (i % 3) * 22,
        y: 45 + Math.floor(i / 3) * 25,
        angle: Math.random() * Math.PI * 2,
        targetAngle: Math.PI / 2
      });
    }

    // Compass needle
    let needleAngle = 0;
    let needleTargetAngle = Math.PI / 2;

    function draw() {
      ctx.clearRect(0, 0, 260, 280);

      // Left section: Paired vs Unpaired electrons
      ctx.fillStyle = Colors.textMuted;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Paired (cancel)', 50, 20);
      ctx.fillText('Unpaired (magnetic)', 115, 20);

      // Paired electrons (spin up + spin down)
      const pairedY = 40;
      const spinRotation = time * 0.05;

      // Left electron spinning
      ctx.save();
      ctx.translate(40, pairedY);
      ctx.rotate(spinRotation);
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fillStyle = Colors.electron;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(0, -3);
      ctx.lineTo(-3, -5);
      ctx.moveTo(0, -3);
      ctx.lineTo(3, -5);
      ctx.stroke();
      ctx.restore();

      // Right electron spinning opposite
      ctx.save();
      ctx.translate(60, pairedY);
      ctx.rotate(-spinRotation);
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fillStyle = Colors.electron;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.lineTo(0, 3);
      ctx.lineTo(-3, 5);
      ctx.moveTo(0, 3);
      ctx.lineTo(3, 5);
      ctx.stroke();
      ctx.restore();

      // Cancel effect (X mark)
      ctx.strokeStyle = Colors.warning;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(45, 55);
      ctx.lineTo(55, 65);
      ctx.moveTo(55, 55);
      ctx.lineTo(45, 65);
      ctx.stroke();

      // Unpaired electron spinning
      ctx.save();
      ctx.translate(115, pairedY);
      ctx.rotate(spinRotation);
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fillStyle = Colors.electron;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(0, -4);
      ctx.lineTo(-4, -7);
      ctx.moveTo(0, -4);
      ctx.lineTo(4, -7);
      ctx.stroke();
      ctx.restore();

      // Magnetic moment arrow from unpaired electron
      ctx.strokeStyle = Colors.success;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(115, pairedY - 20);
      ctx.lineTo(115, pairedY - 35);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(115, pairedY - 35);
      ctx.lineTo(110, pairedY - 30);
      ctx.lineTo(120, pairedY - 30);
      ctx.closePath();
      ctx.fillStyle = Colors.success;
      ctx.fill();

      // Divider
      ctx.strokeStyle = Colors.border;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, 80);
      ctx.lineTo(250, 80);
      ctx.stroke();

      // Domain alignment animation
      alignmentPhase = Math.min(alignmentPhase + 0.008, 1);

      ctx.fillStyle = Colors.textMuted;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Magnetic domains', 180, 30);
      ctx.fillText('aligning in field', 180, 40);

      domains.forEach(d => {
        d.angle += (d.targetAngle - d.angle) * alignmentPhase * 0.1;

        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.angle);
        ctx.fillStyle = Colors.proton;
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(6, 0);
        ctx.lineTo(6, -2);
        ctx.lineTo(10, 0);
        ctx.lineTo(6, 2);
        ctx.lineTo(6, 0);
        ctx.fill();
        ctx.restore();
      });

      // Magnetic field lines (horizontal)
      ctx.strokeStyle = 'rgba(20, 134, 109, 0.3)';
      ctx.lineWidth = 1;

      for (let i = 0; i < 4; i++) {
        const y = 100 + i * 15;
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(130, y);
        ctx.stroke();
      }

      // Magnet representation (left side)
      ctx.fillStyle = Colors.proton;
      ctx.fillRect(20, 170, 35, 30);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('N', 37.5, 190);

      ctx.fillStyle = Colors.electron;
      ctx.fillRect(55, 170, 35, 30);
      ctx.fillStyle = '#fff';
      ctx.fillText('S', 72.5, 190);

      // Compass needle responding to field
      needleAngle += (needleTargetAngle - needleAngle) * 0.05;

      ctx.fillStyle = Colors.textMuted;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Compass', 130, 155);

      // Compass circle
      ctx.strokeStyle = Colors.border;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(130, 180, 25, 0, Math.PI * 2);
      ctx.stroke();

      // Compass needle
      ctx.save();
      ctx.translate(130, 180);
      ctx.rotate(needleAngle);

      // North end (red)
      ctx.fillStyle = Colors.proton;
      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.lineTo(0, -20);
      ctx.lineTo(3, 0);
      ctx.closePath();
      ctx.fill();

      // South end (white/gray)
      ctx.fillStyle = Colors.textMuted;
      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.lineTo(0, 20);
      ctx.lineTo(3, 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Explanation
      ctx.fillStyle = Colors.textMuted;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Electron spin creates magnetic moment', 130, 230);
      ctx.fillText('Ferromagnetic materials have aligned domains', 130, 245);
      ctx.fillText('Unpaired electrons give net magnetism', 130, 260);

      time++;
    }

    return animate(draw, ctx);
  };

  // ============================================
  // LESSON 13: Energy Levels & Spectra
  // ============================================
  Animations['spectra'] = function(container) {
    const ctx = createCanvas(container);
    let time = 0;
    let electronLevel = 1;
    let photon = null;
    let transitionTime = 0;
    let mode = 'emission'; // 'emission' or 'absorption'
    let currentElement = 'hydrogen'; // 'hydrogen', 'helium', or 'neon'

    const levels = [
      { n: 1, y: 180, energy: '-13.6 eV' },
      { n: 2, y: 130, energy: '-3.4 eV' },
      { n: 3, y: 90, energy: '-1.5 eV' }
    ];

    // Color mapping for photon energies based on transition
    const getPhotonColor = (fromLevel, toLevel) => {
      const energyDiff = Math.abs(fromLevel - toLevel);
      if (energyDiff === 1) return '#ff4444'; // Red (low energy)
      if (energyDiff === 2) return '#aa44ff'; // Violet (high energy)
      return '#44aaff'; // Blue-green (medium energy)
    };

    // Element-specific spectral lines
    const elementSpectra = {
      hydrogen: [
        { wavelength: 656, color: '#ff4444', name: 'H-α' },
        { wavelength: 486, color: '#44aaff', name: 'H-β' },
        { wavelength: 434, color: '#4444ff', name: 'H-γ' },
        { wavelength: 410, color: '#aa44ff', name: 'H-δ' }
      ],
      helium: [
        { wavelength: 587, color: '#ffdd44', name: 'He' },
        { wavelength: 501, color: '#44ff88', name: 'He' },
        { wavelength: 447, color: '#4488ff', name: 'He' },
        { wavelength: 668, color: '#ff6644', name: 'He' }
      ],
      neon: [
        { wavelength: 640, color: '#ff3333', name: 'Ne' },
        { wavelength: 614, color: '#ff6633', name: 'Ne' },
        { wavelength: 585, color: '#ffaa33', name: 'Ne' },
        { wavelength: 540, color: '#88ff44', name: 'Ne' }
      ]
    };

    // Interactive click handling
    ctx.canvas.style.cursor = 'pointer';
    ctx.canvas.addEventListener('click', (e) => {
      const rect = ctx.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if clicked on energy levels
      levels.forEach((level, index) => {
        if (x >= 60 && x <= 200 && Math.abs(y - level.y) < 10) {
          const targetLevel = index + 1;
          if (targetLevel !== electronLevel) {
            if (targetLevel > electronLevel) {
              // Absorption: electron moves up
              mode = 'absorption';
              photon = {
                x: 30,
                y: levels[targetLevel - 1].y,
                vy: 0,
                vx: 3,
                life: 30,
                color: getPhotonColor(electronLevel, targetLevel),
                toLevel: targetLevel
              };
            } else {
              // Emission: electron moves down
              mode = 'emission';
              photon = {
                x: 130,
                y: levels[electronLevel - 1].y,
                vy: 2,
                vx: 0,
                life: 40,
                color: getPhotonColor(electronLevel, targetLevel)
              };
            }
            electronLevel = targetLevel;
            transitionTime = 0;
          }
        }
      });

      // Check if clicked on element selector area
      if (y >= 255 && y <= 275) {
        if (x >= 10 && x <= 60) currentElement = 'hydrogen';
        else if (x >= 65 && x <= 115) currentElement = 'helium';
        else if (x >= 120 && x <= 170) currentElement = 'neon';
      }
    });

    function draw() {
      ctx.clearRect(0, 0, 260, 280);

      // Energy level lines
      levels.forEach(level => {
        ctx.strokeStyle = Colors.border;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(60, level.y);
        ctx.lineTo(200, level.y);
        ctx.stroke();

        // Level label
        ctx.fillStyle = Colors.textMuted;
        ctx.font = '10px -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`n=${level.n}`, 40, level.y + 4);
        ctx.textAlign = 'right';
        ctx.fillText(level.energy, 220, level.y + 4);
      });

      // Electron
      const currentY = levels[electronLevel - 1].y;
      ctx.beginPath();
      ctx.arc(130, currentY - 8, 8, 0, Math.PI * 2);
      ctx.fillStyle = Colors.electron;
      ctx.fill();

      // Photon emission/absorption
      if (photon) {
        photon.y += photon.vy;
        photon.x += photon.vx || 0;
        photon.life--;

        // Wavy photon line with color-coding
        ctx.strokeStyle = photon.color || Colors.warning;
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (mode === 'absorption') {
          // Absorption: photon moves horizontally toward electron
          for (let i = 0; i < 15; i++) {
            const px = photon.x + i;
            const py = photon.y + Math.sin(i * 0.5 + time * 0.2) * 4;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
        } else {
          // Emission: photon moves downward
          for (let i = 0; i < 20; i++) {
            const px = photon.x - 10 + i;
            const py = photon.y + Math.sin(i * 0.5 + time * 0.2) * 4;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
        }
        ctx.stroke();

        if (photon.life <= 0) photon = null;
      }

      // Transition logic for automatic animation
      transitionTime++;
      if (transitionTime > 120 && !photon) {
        transitionTime = 0;
        const newLevel = electronLevel === 1 ? 3 : electronLevel - 1;

        if (newLevel < electronLevel) {
          // Emission
          mode = 'emission';
          photon = {
            x: 130,
            y: currentY,
            vy: 2,
            vx: 0,
            life: 40,
            color: getPhotonColor(electronLevel, newLevel)
          };
        } else {
          // Absorption
          mode = 'absorption';
          photon = {
            x: 30,
            y: levels[newLevel - 1].y,
            vy: 0,
            vx: 3,
            life: 30,
            color: getPhotonColor(electronLevel, newLevel)
          };
        }
        electronLevel = newLevel;
      }

      // Spectrum bar with element name
      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${currentElement.charAt(0).toUpperCase() + currentElement.slice(1)} Spectrum`, 130, 220);

      // Spectral lines - element specific
      const spectralLines = elementSpectra[currentElement];

      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(50, 230, 160, 20);

      spectralLines.forEach(line => {
        const x = 50 + ((line.wavelength - 400) / 300) * 160;
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 230);
        ctx.lineTo(x, 250);
        ctx.stroke();
      });

      // Element selector buttons
      ctx.fillStyle = Colors.textMuted;
      ctx.font = '9px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Click to change element:', 85, 265);

      // Hydrogen button
      ctx.fillStyle = currentElement === 'hydrogen' ? Colors.electron : Colors.border;
      ctx.fillRect(10, 255, 50, 20);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px -apple-system, sans-serif';
      ctx.fillText('H', 35, 268);

      // Helium button
      ctx.fillStyle = currentElement === 'helium' ? Colors.success : Colors.border;
      ctx.fillRect(65, 255, 50, 20);
      ctx.fillStyle = '#fff';
      ctx.fillText('He', 90, 268);

      // Neon button
      ctx.fillStyle = currentElement === 'neon' ? Colors.warning : Colors.border;
      ctx.fillRect(120, 255, 50, 20);
      ctx.fillStyle = '#fff';
      ctx.fillText('Ne', 145, 268);

      // Mode indicator
      ctx.fillStyle = Colors.textMuted;
      ctx.font = '9px -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`Mode: ${mode}`, 250, 20);
      ctx.fillText('Click levels to jump', 250, 32);

      time++;
    }

    return animate(draw, ctx);
  };

  // ============================================
  // LESSON 14: Chemical Bonding
  // ============================================
  Animations['bonding'] = function(container) {
    const ctx = createCanvas(container);
    let time = 0;
    let transferPhase = 0; // For electron transfer animation
    let bondBroken = false; // Track bond state for click interaction

    // Interactive click handling for bond breaking
    ctx.canvas.style.cursor = 'pointer';
    ctx.canvas.addEventListener('click', () => {
      bondBroken = !bondBroken;
      time = 0; // Reset animation phase
    });

    function draw() {
      ctx.clearRect(0, 0, 260, 280);

      // Ionic bond (NaCl) with step-by-step electron transfer
      const ionicY = 55;
      transferPhase = (time % 120) / 120; // 0 to 1 cycle

      // Electron transfer progress (0 = on Na, 1 = on Cl)
      const transferProgress = Math.min(1, Math.max(0, (transferPhase - 0.2) * 2));
      const electronX = 80 + (160 - 80) * transferProgress;
      const electronY = ionicY - Math.sin(transferProgress * Math.PI) * 15;

      // Na (becoming Na+)
      const naCharge = transferProgress > 0.7 ? '+' : '';
      ctx.beginPath();
      ctx.arc(80, ionicY, 22, 0, Math.PI * 2);
      ctx.fillStyle = Colors.proton + (transferProgress > 0.7 ? '40' : '20');
      ctx.fill();
      ctx.strokeStyle = Colors.proton;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Na' + (naCharge ? '⁺' : ''), 80, ionicY + 5);

      // Cl (becoming Cl-)
      const clCharge = transferProgress > 0.7 ? '-' : '';
      ctx.beginPath();
      ctx.arc(160, ionicY, 28, 0, Math.PI * 2);
      ctx.fillStyle = Colors.electron + (transferProgress > 0.7 ? '40' : '20');
      ctx.fill();
      ctx.strokeStyle = Colors.electron;
      ctx.stroke();
      ctx.fillText('Cl' + (clCharge ? '⁻' : ''), 160, ionicY + 5);

      // Transferring electron
      if (transferPhase > 0.2 && transferPhase < 0.9) {
        ctx.beginPath();
        ctx.arc(electronX, electronY, 4, 0, Math.PI * 2);
        ctx.fillStyle = Colors.electron;
        ctx.fill();
      }

      // Attraction line (appears after transfer)
      if (transferProgress > 0.7) {
        const pulse = Math.sin(time * 0.08) * 3;
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = Colors.success;
        ctx.beginPath();
        ctx.moveTo(102 + pulse, ionicY);
        ctx.lineTo(132 - pulse, ionicY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.fillStyle = Colors.textMuted;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.fillText('Ionic Bond (electron transfer)', 120, ionicY + 40);

      // Covalent bond (H2) with electron sharing "dance"
      const covalentY = 130;
      const bondStretch = bondBroken ? 40 : Math.sin(time * 0.06) * 3;
      const overlapAlpha = bondBroken ? 0 : 0.3;

      // H atoms
      ctx.beginPath();
      ctx.arc(90 - bondStretch, covalentY, 20, 0, Math.PI * 2);
      ctx.fillStyle = Colors.success + '40';
      ctx.fill();
      ctx.strokeStyle = Colors.success;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(150 + bondStretch, covalentY, 20, 0, Math.PI * 2);
      ctx.fillStyle = Colors.success + '40';
      ctx.fill();
      ctx.stroke();

      // Shared electron cloud (overlap region) - enhanced dance
      if (!bondBroken) {
        ctx.beginPath();
        ctx.ellipse(120, covalentY, 15 + Math.sin(time * 0.04) * 2, 25, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(54, 102, 204, ${overlapAlpha})`;
        ctx.fill();
      }

      // Dancing electrons in overlap
      if (!bondBroken) {
        const eAngle = time * 0.05;
        ctx.beginPath();
        ctx.arc(120 + Math.cos(eAngle) * 8, covalentY + Math.sin(eAngle) * 15, 4, 0, Math.PI * 2);
        ctx.fillStyle = Colors.electron;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(120 + Math.cos(eAngle + Math.PI) * 8, covalentY + Math.sin(eAngle + Math.PI) * 15, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 12px -apple-system, sans-serif';
      ctx.fillText('H', 90 - bondStretch, covalentY + 5);
      ctx.fillText('H', 150 + bondStretch, covalentY + 5);

      ctx.fillStyle = Colors.textMuted;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.fillText('Covalent Bond (electron sharing)', 120, covalentY + 40);

      // Polar covalent bond (H2O)
      const waterY = 210;

      // Oxygen atom (larger, pulls electrons more)
      ctx.beginPath();
      ctx.arc(120, waterY, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#ff6b6b40';
      ctx.fill();
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 12px -apple-system, sans-serif';
      ctx.fillText('O', 120, waterY + 5);

      // Partial negative charge on oxygen
      ctx.font = 'bold 9px -apple-system, sans-serif';
      ctx.fillStyle = '#ff6b6b';
      ctx.fillText('δ-', 120, waterY - 20);

      // Hydrogen atoms
      const h1X = 90;
      const h1Y = waterY + 20;
      const h2X = 150;
      const h2Y = waterY + 20;

      ctx.beginPath();
      ctx.arc(h1X, h1Y, 16, 0, Math.PI * 2);
      ctx.fillStyle = Colors.success + '30';
      ctx.fill();
      ctx.strokeStyle = Colors.success;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 10px -apple-system, sans-serif';
      ctx.fillText('H', h1X, h1Y + 4);

      ctx.beginPath();
      ctx.arc(h2X, h2Y, 16, 0, Math.PI * 2);
      ctx.fillStyle = Colors.success + '30';
      ctx.fill();
      ctx.strokeStyle = Colors.success;
      ctx.stroke();
      ctx.fillText('H', h2X, h2Y + 4);

      // Partial positive charges on hydrogens
      ctx.font = 'bold 8px -apple-system, sans-serif';
      ctx.fillStyle = Colors.success;
      ctx.fillText('δ+', h1X, h1Y - 14);
      ctx.fillText('δ+', h2X, h2Y - 14);

      // Polar bonds (electrons pulled toward O)
      const polarPulse = Math.sin(time * 0.06) * 2;
      ctx.strokeStyle = '#ff6b6b80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(h1X + 8, h1Y - 8);
      ctx.lineTo(120 - 12 - polarPulse, waterY + 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(h2X - 8, h2Y - 8);
      ctx.lineTo(120 + 12 + polarPulse, waterY + 12);
      ctx.stroke();

      ctx.fillStyle = Colors.textMuted;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.fillText('Polar Covalent (unequal sharing)', 120, waterY + 45);

      // Interactive hint
      ctx.fillStyle = Colors.textMuted;
      ctx.font = '9px -apple-system, sans-serif';
      ctx.fillText('Click to break/form H-H bond', 130, 270);

      time++;
    }

    return animate(draw, ctx);
  };

  // ============================================
  // LESSON 15: Forces Within Atoms
  // ============================================
  Animations['forces'] = function(container) {
    const ctx = createCanvas(container);
    let time = 0;
    let exploding = false;
    let explosionTime = 0;
    let particles = [];

    // Click handler for explosion
    container.querySelector('canvas').addEventListener('click', () => {
      if (!exploding) {
        exploding = true;
        explosionTime = 0;
        // Create explosion particles
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          particles.push({
            x: 130,
            y: 100,
            vx: Math.cos(angle) * (2 + Math.random() * 2),
            vy: Math.sin(angle) * (2 + Math.random() * 2),
            size: 8 + Math.random() * 6
          });
        }
      } else {
        // Reset on click during explosion
        exploding = false;
        explosionTime = 0;
        particles = [];
      }
    });

    function draw() {
      ctx.clearRect(0, 0, 260, 280);
      const cx = 130, cy = 100;

      if (exploding) {
        // Explosion animation
        explosionTime++;

        // Draw exploding particles
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.size *= 0.98;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = Colors.proton;
          ctx.fill();
        });

        // Explosion flash
        if (explosionTime < 10) {
          ctx.fillStyle = `rgba(255, 100, 0, ${1 - explosionTime / 10})`;
          ctx.beginPath();
          ctx.arc(cx, cy, explosionTime * 15, 0, Math.PI * 2);
          ctx.fill();
        }

        // Reset after explosion
        if (explosionTime > 60) {
          exploding = false;
          particles = [];
        }

        // Message
        ctx.fillStyle = Colors.warning;
        ctx.font = 'bold 12px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Without strong force...', cx, 150);
        ctx.fillText('NUCLEAR EXPLOSION!', cx, 165);

      } else {
        // Normal animation showing force balance

        // Force range visualization - EM extends far, strong force only at 1fm
        ctx.globalAlpha = 0.15;
        // EM force extends far
        ctx.fillStyle = Colors.warning;
        ctx.beginPath();
        ctx.arc(cx, cy, 100, 0, Math.PI * 2);
        ctx.fill();

        // Strong force only at 1fm (nuclear scale)
        ctx.fillStyle = Colors.success;
        ctx.beginPath();
        ctx.arc(cx, cy, 42, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Tug-of-war animation between forces
        const tugOfWar = Math.sin(time * 0.08) * 2;
        const repulsion = Math.sin(time * 0.05) * 3;

        // Nucleus background
        ctx.beginPath();
        ctx.arc(cx, cy, 35, 0, Math.PI * 2);
        ctx.fillStyle = Colors.proton + '30';
        ctx.fill();

        // Protons with repulsion and tug-of-war
        ctx.beginPath();
        ctx.arc(cx - 12 - repulsion + tugOfWar, cy, 12, 0, Math.PI * 2);
        ctx.fillStyle = Colors.proton;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx + 12 + repulsion - tugOfWar, cy, 12, 0, Math.PI * 2);
        ctx.fillStyle = Colors.proton;
        ctx.fill();

        // Repulsion arrows (EM force) - pulsing
        const emPulse = 1 + Math.sin(time * 0.1) * 0.3;
        ctx.strokeStyle = Colors.warning;
        ctx.lineWidth = 2 * emPulse;

        // Left arrow
        ctx.beginPath();
        ctx.moveTo(cx - 30, cy);
        ctx.lineTo(cx - 45, cy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 45, cy);
        ctx.lineTo(cx - 40, cy - 5);
        ctx.lineTo(cx - 40, cy + 5);
        ctx.closePath();
        ctx.fillStyle = Colors.warning;
        ctx.fill();

        // Right arrow
        ctx.beginPath();
        ctx.moveTo(cx + 30, cy);
        ctx.lineTo(cx + 45, cy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 45, cy);
        ctx.lineTo(cx + 40, cy - 5);
        ctx.lineTo(cx + 40, cy + 5);
        ctx.closePath();
        ctx.fill();

        // Strong force (containing) - pulsing inward
        const strongPulse = 1 - Math.sin(time * 0.1) * 0.15;
        ctx.strokeStyle = Colors.success;
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.arc(cx, cy, 40 * strongPulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Inward arrows showing strong force compression
        ctx.strokeStyle = Colors.success;
        ctx.lineWidth = 2;
        // Top
        ctx.beginPath();
        ctx.moveTo(cx, cy - 50);
        ctx.lineTo(cx, cy - 35);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy - 35);
        ctx.lineTo(cx - 4, cy - 40);
        ctx.lineTo(cx + 4, cy - 40);
        ctx.closePath();
        ctx.fillStyle = Colors.success;
        ctx.fill();

        // Labels
        ctx.fillStyle = Colors.warning;
        ctx.font = '10px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('EM: infinite range', cx - 60, cy - 55);

        ctx.fillStyle = Colors.success;
        ctx.fillText('Strong: 1 fm only', cx + 60, cy - 55);
      }

      // Force comparison bars (always visible)
      const barY = 180;
      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 11px -apple-system, sans-serif';
      ctx.textAlign = 'left';

      // Gravity (weakest)
      ctx.fillStyle = Colors.textMuted;
      ctx.fillRect(40, barY, 180 * 0.00000001, 12);
      ctx.font = '9px -apple-system, sans-serif';
      ctx.fillText('Gravity (10⁻³⁸)', 45, barY + 10);

      // EM force
      ctx.fillStyle = Colors.warning;
      ctx.fillRect(40, barY + 18, 180 * 0.007, 12);
      ctx.font = '9px -apple-system, sans-serif';
      ctx.fillText('Electromagnetic (1)', 45, barY + 28);

      // Strong force
      ctx.fillStyle = Colors.success;
      ctx.fillRect(40, barY + 36, 180, 12);
      ctx.fillText('Strong Nuclear (100×)', 45, barY + 46);

      // Instructions
      ctx.fillStyle = Colors.textMuted;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      if (!exploding) {
        ctx.fillText('Click to see what happens if strong force fails!', 130, 255);
        ctx.fillText('Forces are in constant tug-of-war', 130, 270);
      } else {
        ctx.fillText('Click again to reset', 130, 270);
      }

      time++;
    }

    return animate(draw, ctx);
  };

  // ============================================
  // LESSON 16: Origin of Atoms
  // ============================================
  Animations['origin'] = function(container) {
    const ctx = createCanvas(container);
    let time = 0;
    let particles = [];
    let periodicElements = [];

    function draw() {
      ctx.clearRect(0, 0, 260, 280);

      // Cosmic timeline with accurate markers
      const timelineY = 25;
      ctx.strokeStyle = Colors.border;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, timelineY);
      ctx.lineTo(230, timelineY);
      ctx.stroke();

      // Timeline markers
      const markers = [
        { x: 30, label: '0', subtext: 'Big Bang' },
        { x: 90, label: '3 min', subtext: 'H, He' },
        { x: 150, label: '100M yr', subtext: 'First stars' },
        { x: 210, label: 'Today', subtext: 'Heavy elements' }
      ];

      markers.forEach(m => {
        ctx.beginPath();
        ctx.arc(m.x, timelineY, 3, 0, Math.PI * 2);
        ctx.fillStyle = Colors.electron;
        ctx.fill();
        ctx.fillStyle = Colors.text;
        ctx.font = 'bold 8px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(m.label, m.x, timelineY - 8);
        ctx.fillStyle = Colors.textMuted;
        ctx.font = '7px -apple-system, sans-serif';
        ctx.fillText(m.subtext, m.x, timelineY + 15);
      });

      // Stellar fusion visualization
      const fusionY = 60;
      const fusionPhase = (time / 60) % 3;

      // Background for fusion area
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(20, fusionY - 10, 220, 50);

      if (fusionPhase < 1) {
        // Stage 1: Hydrogen fusion
        ctx.fillStyle = Colors.proton;
        ctx.font = 'bold 16px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('H + H', 90, fusionY + 15);
        ctx.fillText('→', 130, fusionY + 15);
        ctx.fillStyle = Colors.warning + '80';
        ctx.fillText('He', 170, fusionY + 15);

        ctx.fillStyle = Colors.textMuted;
        ctx.font = '8px -apple-system, sans-serif';
        ctx.fillText('Stellar cores: H → He', 130, fusionY + 30);
      } else if (fusionPhase < 2) {
        // Stage 2: Helium to Carbon
        ctx.fillStyle = Colors.warning;
        ctx.font = 'bold 16px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('He + He', 80, fusionY + 15);
        ctx.fillText('→', 130, fusionY + 15);
        ctx.fillStyle = Colors.electron + '80';
        ctx.fillText('C, O', 180, fusionY + 15);

        ctx.fillStyle = Colors.textMuted;
        ctx.font = '8px -apple-system, sans-serif';
        ctx.fillText('Massive stars: He → C, O', 130, fusionY + 30);
      } else {
        // Stage 3: Iron limit
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 16px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('C + O → Fe', 130, fusionY + 15);

        ctx.fillStyle = Colors.textMuted;
        ctx.font = '8px -apple-system, sans-serif';
        ctx.fillText('Fe: fusion stops here', 130, fusionY + 30);
      }

      // Supernova explosion creating heavy elements
      const supernovaY = 125;
      const explosionPulse = Math.sin(time * 0.08) * 5;

      // Explosion burst
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time * 0.05;
        const length = 20 + explosionPulse;
        ctx.beginPath();
        ctx.moveTo(130, supernovaY);
        ctx.lineTo(130 + Math.cos(angle) * length, supernovaY + Math.sin(angle) * length);
        ctx.stroke();
      }

      // Heavy elements labels
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Au', 110, supernovaY - 25);
      ctx.fillText('Pt', 150, supernovaY - 25);
      ctx.fillText('U', 130, supernovaY + 35);

      ctx.fillStyle = Colors.textMuted;
      ctx.font = '8px -apple-system, sans-serif';
      ctx.fillText('Supernova: heavy elements', 130, supernovaY + 48);

      // Periodic table fill animation
      const periodicY = 170;
      ctx.fillStyle = Colors.text;
      ctx.font = 'bold 9px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Periodic Table Fill:', 25, periodicY);

      // Mini periodic table (first 18 elements)
      const elements = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'];
      const cellSize = 12;
      const startX = 25;

      // Elements appear over time
      const visibleCount = Math.min(elements.length, Math.floor(time / 8) % (elements.length + 10));

      for (let i = 0; i < visibleCount; i++) {
        const col = i % 9;
        const row = Math.floor(i / 9);
        const x = startX + col * (cellSize + 2);
        const y = periodicY + 10 + row * (cellSize + 2);

        // Color by origin
        let color;
        if (i < 2) color = Colors.proton;  // H, He - Big Bang
        else if (i < 8) color = Colors.warning;  // Li to O - Stars
        else color = Colors.electron;  // Beyond - Supernovae

        ctx.fillStyle = color + '40';
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);

        ctx.fillStyle = Colors.text;
        ctx.font = 'bold 7px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(elements[i], x + cellSize/2, y + cellSize/2 + 2);
      }

      // Legend
      const legendY = periodicY + 45;
      ctx.fillStyle = Colors.proton;
      ctx.fillRect(25, legendY, 8, 8);
      ctx.fillStyle = Colors.text;
      ctx.font = '7px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Big Bang', 36, legendY + 6);

      ctx.fillStyle = Colors.warning;
      ctx.fillRect(80, legendY, 8, 8);
      ctx.fillStyle = Colors.text;
      ctx.fillText('Stars', 91, legendY + 6);

      ctx.fillStyle = Colors.electron;
      ctx.fillRect(115, legendY, 8, 8);
      ctx.fillStyle = Colors.text;
      ctx.fillText('Supernovae', 126, legendY + 6);

      // Updated quote
      ctx.fillStyle = Colors.textMuted;
      ctx.font = 'italic 9px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('"YOUR atoms are star stuff"', 130, 255);
      ctx.font = '8px -apple-system, sans-serif';
      ctx.fillText('— Carl Sagan (personalized)', 130, 268);

      time++;
    }

    return animate(draw, ctx);
  };

  // ============================================
  // LESSON 17: History of Atomic Theory
  // ============================================
  Animations['history'] = function(container) {
    const ctx = createCanvas(container);
    let time = 0;

    const milestones = [
      { year: '400 BCE', name: 'Democritus', idea: '"Atomos" (uncuttable)', y: 50, experiment: 'Philosophy' },
      { year: '1803', name: 'Dalton', idea: 'Solid sphere model', y: 100, experiment: 'Fixed ratios' },
      { year: '1897', name: 'Thomson', idea: 'Plum pudding model', y: 150, experiment: 'Cathode rays' },
      { year: '1911', name: 'Rutherford', idea: 'Nuclear model', y: 200, experiment: 'Gold foil' },
      { year: '1926', name: 'Schrödinger', idea: 'Quantum model', y: 250, experiment: 'Wave equation' }
    ];

    function draw() {
      ctx.clearRect(0, 0, 260, 280);

      // Timeline line
      ctx.strokeStyle = Colors.border;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(50, 40);
      ctx.lineTo(50, 260);
      ctx.stroke();

      // Animated highlight with slower transition
      const highlightIndex = Math.floor((time / 100) % milestones.length);
      const transitionProgress = ((time % 100) / 100);

      milestones.forEach((m, i) => {
        const isHighlighted = i === highlightIndex;
        const scale = isHighlighted ? 1.1 : 1;

        // Timeline dot with pulse effect
        const pulseScale = isHighlighted ? 1 + Math.sin(time * 0.1) * 0.15 : 1;
        ctx.beginPath();
        ctx.arc(50, m.y, 8 * scale * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted ? Colors.electron : Colors.border;
        ctx.fill();

        // Year
        ctx.fillStyle = isHighlighted ? Colors.electron : Colors.textMuted;
        ctx.font = `${isHighlighted ? 'bold ' : ''}10px -apple-system, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(m.year, 38, m.y + 4);

        // Name and idea
        ctx.textAlign = 'left';
        ctx.fillStyle = isHighlighted ? Colors.text : Colors.textMuted;
        ctx.font = `${isHighlighted ? 'bold ' : ''}11px -apple-system, sans-serif`;
        ctx.fillText(m.name, 65, m.y - 8);

        ctx.fillStyle = Colors.textMuted;
        ctx.font = '9px -apple-system, sans-serif';
        ctx.fillText(m.idea, 65, m.y + 4);

        // Experiment label (small)
        if (isHighlighted) {
          ctx.fillStyle = Colors.textMuted;
          ctx.font = '8px -apple-system, sans-serif';
          ctx.fillText(m.experiment, 65, m.y + 16);
        }

        // Model visualization with morphing animation
        const modelX = 215;
        if (isHighlighted) {
          ctx.save();
          ctx.translate(modelX, m.y);

          if (i === 0) {
            // Democritus: simple circle (philosophical)
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.strokeStyle = Colors.textMuted;
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
          } else if (i === 1) {
            // Dalton: solid sphere (morphing size)
            const morphSize = 12 + Math.sin(time * 0.08) * 1;
            ctx.beginPath();
            ctx.arc(0, 0, morphSize, 0, Math.PI * 2);
            ctx.fillStyle = Colors.neutron;
            ctx.fill();
            ctx.strokeStyle = Colors.border;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          } else if (i === 2) {
            // Thomson: plum pudding with rotating electrons
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.fillStyle = Colors.proton + '40';
            ctx.fill();
            ctx.strokeStyle = Colors.proton + '60';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Electrons embedded in positive charge
            for (let e = 0; e < 5; e++) {
              const angle = (Math.PI * 2 / 5) * e + time * 0.03;
              const radius = 7 + Math.sin(time * 0.05 + e) * 2;
              ctx.beginPath();
              ctx.arc(Math.cos(angle) * radius, Math.sin(angle) * radius, 2.5, 0, Math.PI * 2);
              ctx.fillStyle = Colors.electron;
              ctx.fill();
            }
          } else if (i === 3) {
            // Rutherford: nuclear model with gold foil visualization
            // Tiny dense nucleus
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fillStyle = Colors.proton;
            ctx.fill();

            // Electron orbit
            ctx.beginPath();
            ctx.arc(0, 0, 16, 0, Math.PI * 2);
            ctx.strokeStyle = Colors.electron + '40';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Orbiting electron
            const orbitAngle = time * 0.05;
            ctx.beginPath();
            ctx.arc(Math.cos(orbitAngle) * 16, Math.sin(orbitAngle) * 16, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = Colors.electron;
            ctx.fill();

            // Gold foil experiment - show particle deflection (subtle)
            if (transitionProgress > 0.5) {
              const particleY = -20 + (transitionProgress - 0.5) * 80;
              ctx.beginPath();
              ctx.arc(-25, particleY, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = Colors.warning;
              ctx.fill();
            }
          } else if (i === 4) {
            // Quantum: probability cloud with animated density
            const cloudRadius = 18;
            const particles = 30;

            // Nucleus
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fillStyle = Colors.proton;
            ctx.fill();

            // Probability cloud as scattered dots
            for (let p = 0; p < particles; p++) {
              const angle = (Math.PI * 2 / particles) * p + time * 0.02;
              const distance = Math.abs(Math.sin(time * 0.04 + p * 0.3)) * cloudRadius;
              const opacity = Math.max(0.1, 1 - distance / cloudRadius);
              const size = 1 + opacity * 1.5;

              ctx.beginPath();
              ctx.arc(Math.cos(angle) * distance, Math.sin(angle) * distance, size, 0, Math.PI * 2);
              ctx.fillStyle = Colors.electron + Math.floor(opacity * 255).toString(16).padStart(2, '0');
              ctx.fill();
            }
          }

          ctx.restore();
        }
      });

      // Draw "Current Understanding" label at bottom
      if (highlightIndex === 4) {
        ctx.fillStyle = Colors.electron;
        ctx.font = 'bold 9px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Current Model', 130, 270);
      }

      time++;
    }

    return animate(draw, ctx);
  };

  // ============================================
  // Public API
  // ============================================
  let currentAnimation = null;

  window.LessonAnimations = {
    // Start animation for a visual type
    start: function(visualType, container) {
      this.stop(); // Stop any existing animation

      if (Animations[visualType]) {
        currentAnimation = Animations[visualType](container);
      } else {
        console.warn('[LessonAnimations] No animation for:', visualType);
      }
    },

    // Stop current animation
    stop: function() {
      if (currentAnimation) {
        currentAnimation.stop();
        currentAnimation = null;
      }
    },

    // Check if animation exists for type
    has: function(visualType) {
      return !!Animations[visualType];
    }
  };

  console.log('[LessonAnimations] Module loaded with', Object.keys(Animations).length, 'animations');
})();
