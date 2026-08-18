/* ==========================================================================
   Zero-Energy Wake-Up Receiver Sensor Network (MSP430) - Core Engine
   Features: Canvas Background, Live Node Simulator, Oscilloscope, Lightbox,
   Clock, Theme Switcher, Animated Counters, Block Diagram Inspector
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Modules
    initPreloader();
    initCanvasBackground();
    initMouseGlow();
    initThemeToggle();
    initDigitalClock();
    initNavbar();
    initTypingEffect();
    initScrollAnimations();
    initBlockDiagramInspector();
    initNodeSimulator();
    initGalleryCarousel();
    initLightbox();
    initScrollTop();
    initRippleEffect();
});

/* --- 1. Preloader Animation --- */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('loader-fill');
    const percentText = document.getElementById('loader-percent');

    if (!preloader || !fill || !percentText) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            fill.style.width = '100%';
            percentText.textContent = '100%';
            clearInterval(interval);

            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 400);
        } else {
            fill.style.width = `${progress}%`;
            percentText.textContent = `${progress}%`;
        }
    }, 60);
}

/* --- 2. Interactive Canvas Background (Circuit & Wireless Signals) --- */
function initCanvasBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let signalRings = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createParticles();
    }

    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Periodically spawn signal ripples on mouse movement
        if (Math.random() < 0.08) {
            signalRings.push({
                x: mouse.x,
                y: mouse.y,
                radius: 5,
                maxRadius: 60 + Math.random() * 40,
                alpha: 0.8,
                color: Math.random() > 0.5 ? '#00bfff' : '#00c853'
            });
        }
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.4 ? 'rgba(0, 191, 255, ' : 'rgba(0, 200, 83, ';
            this.baseAlpha = Math.random() * 0.4 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse attraction
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.baseAlpha + ')';
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        const count = Math.min(Math.floor((width * height) / 14000), 75);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connecting circuit lines between close particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    let alpha = (1 - dist / 130) * 0.15;
                    ctx.strokeStyle = `rgba(0, 191, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Update and draw signal wave rings
        for (let i = signalRings.length - 1; i >= 0; i--) {
            let ring = signalRings[i];
            ring.radius += 1.2;
            ring.alpha -= 0.015;

            if (ring.alpha <= 0 || ring.radius >= ring.maxRadius) {
                signalRings.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
            ctx.strokeStyle = ring.color.replace(')', `, ${ring.alpha})`).replace('rgb', 'rgba');
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        requestAnimationFrame(animate);
    }

    resize();
    animate();
}

/* --- 3. Mouse Cursor Glow --- */
function initMouseGlow() {
    const glow = document.getElementById('mouse-glow');
    if (!glow) return;

    document.addEventListener('mousemove', (e) => {
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
}

/* --- 4. Dark/Light Theme Switcher --- */
function initThemeToggle() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;

    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    btn.addEventListener('click', () => {
        const active = document.documentElement.getAttribute('data-theme');
        const newTheme = active === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        btn.innerHTML = theme === 'light'
            ? `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>`
            : `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>`;
    }
}

/* --- 5. Live Digital Clock --- */
function initDigitalClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;

    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hrs}:${mins}:${secs} IST`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/* --- 6. Sticky Navbar & Mobile Drawer --- */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

/* --- 7. Typing Text Animation --- */
function initTypingEffect() {
    const target = document.getElementById('typing-target');
    if (!target) return;

    const phrases = [
        "0.00 μA Zero Standby Consumption",
        "Sub-GHz Nanowatt Pattern Wake-Up",
        "MSP430 LPM4.5 Ultra-Low Power Core",
        "10+ Years Autonomous Sensor Lifespan"
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const current = phrases[phraseIdx];

        if (isDeleting) {
            target.textContent = current.substring(0, charIdx - 1);
            charIdx--;
        } else {
            target.textContent = current.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    type();
}

/* --- 8. Scroll Animations & Animated Counters --- */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');

                // Trigger stat counter if element is stat card
                if (entry.target.classList.contains('stat-card')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.glass-card, .stat-card, .timeline-card, .block-diagram-container').forEach(el => {
        observer.observe(el);
    });

    function animateCounter(card) {
        const numEl = card.querySelector('.stat-number');
        const circleEl = card.querySelector('.stat-circle-progress');
        if (!numEl) return;

        const targetVal = parseFloat(numEl.getAttribute('data-target'));
        const unit = numEl.getAttribute('data-unit') || '';
        const percent = parseFloat(numEl.getAttribute('data-percent') || 100);

        let start = 0;
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = targetVal / steps;

        const timer = setInterval(() => {
            start += increment;
            if (start >= targetVal) {
                numEl.textContent = `${targetVal}${unit}`;
                clearInterval(timer);
            } else {
                numEl.textContent = `${start.toFixed(targetVal % 1 !== 0 ? 1 : 0)}${unit}`;
            }
        }, stepTime);

        if (circleEl) {
            const radius = 54;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percent / 100) * circumference;
            circleEl.style.strokeDasharray = `${circumference}`;
            circleEl.style.strokeDashoffset = `${offset}`;
        }
    }
}

/* --- 9. Interactive Block Diagram Inspector --- */
const blockData = {
    antenna: {
        title: "RF Antenna & Energy Harvester",
        desc: "Compact sub-GHz patch antenna paired with a high-efficiency RF energy harvester circuit collecting ambient RF energy.",
        specs: [
            { label: "Operating Frequency", val: "868 MHz / 915 MHz ISM" },
            { label: "Harvester Efficiency", val: "68% @ -15 dBm" },
            { label: "Voltage Output", val: "0.2V to 1.8V Unregulated" }
        ],
        waveType: "sine"
    },
    filter: {
        title: "SAW Pass-Band Filter",
        desc: "Surface Acoustic Wave filter providing high attenuation against out-of-band interference signals.",
        specs: [
            { label: "Center Frequency", val: "868.3 MHz" },
            { label: "Bandwidth (-3dB)", val: "2.0 MHz" },
            { label: "Insertion Loss", val: "< 1.8 dB" }
        ],
        waveType: "filtered"
    },
    detector: {
        title: "Zero-Bias Schottky Envelope Detector",
        desc: "Passive diode envelope detector rectifying incoming RF burst pulses into baseband DC voltage pulses without battery bias.",
        specs: [
            { label: "Diode Model", val: "HSMS-2850 Zero-Bias" },
            { label: "Sensitivity", val: "-42 dBm Trigger" },
            { label: "Power Draw", val: "0.00 nW (Passive)" }
        ],
        waveType: "envelope"
    },
    comparator: {
        title: "Nanowatt Voltage Comparator & Pattern Demux",
        desc: "Ultra-low power comparator circuit matching incoming digital wake-up pattern against hardware node address.",
        specs: [
            { label: "Operating Current", val: "35 nW @ 1.2V" },
            { label: "Threshold Voltage", val: "150 mV Vref" },
            { label: "Address Length", val: "16-Bit Pattern Match" }
        ],
        waveType: "digital"
    },
    interrupt: {
        title: "MSP430 GPIO Interrupt Trigger Line",
        desc: "Dedicated hardware NMI/Interrupt pin driving the MSP430 out of deep LPM4.5 sleep state into active execution mode.",
        specs: [
            { label: "Wake-Up Latency", val: "< 4.5 μs" },
            { label: "Pin Assignment", val: "MSP430 P1.0 NMI" },
            { label: "Pulse Threshold", val: "High Signal Edge > 1.2V" }
        ],
        waveType: "pulse"
    },
    msp430: {
        title: "MSP430FR5994 / MSP430G2553 MCU Core",
        desc: "16-Bit ultra-low-power FRAM microcontroller executing sensor sampling algorithms and data payload encryption.",
        specs: [
            { label: "Deep Sleep (LPM4.5)", val: "45 nA Standby" },
            { label: "Active Mode Power", val: "118 μA/MHz" },
            { label: "Memory", val: "256 KB FRAM / 8KB SRAM" }
        ],
        waveType: "active"
    },
    transceiver: {
        title: "Sub-GHz RF Payload Transceiver",
        desc: "High-speed LoRa/FSK radio transmitting sensor data payload back to the central IoT gateway before returning node to zero sleep.",
        specs: [
            { label: "Tx Output Power", val: "+14 dBm (25mA)" },
            { label: "Data Rate", val: "50 kbps FSK" },
            { label: "Burst Duration", val: "12 ms Transmit" }
        ],
        waveType: "burst"
    }
};

function initBlockDiagramInspector() {
    const cards = document.querySelectorAll('.diagram-node-card');
    const titleEl = document.getElementById('inspector-title');
    const descEl = document.getElementById('inspector-desc');
    const specsEl = document.getElementById('inspector-specs');
    const canvas = document.getElementById('waveform-canvas');

    if (!cards.length || !canvas) return;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const key = card.getAttribute('data-block');
            const data = blockData[key];

            if (data) {
                titleEl.textContent = data.title;
                descEl.textContent = data.desc;

                specsEl.innerHTML = data.specs.map(s => `
          <li class="spec-item">
            <span class="spec-label">${s.label}</span>
            <span class="spec-val">${s.val}</span>
          </li>
        `).join('');

                drawWaveform(canvas, data.waveType);
            }
        });
    });

    // Default select first block
    cards[0].click();
}

function drawWaveform(canvas, type) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.clientWidth;
    const h = canvas.height = canvas.clientHeight;

    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00bfff';
    ctx.beginPath();

    const centerY = h / 2;

    for (let x = 0; x < w; x++) {
        let y = centerY;
        if (type === 'sine') {
            y = centerY + Math.sin(x * 0.08) * 35;
        } else if (type === 'filtered') {
            y = centerY + Math.sin(x * 0.05) * (Math.sin(x * 0.01) * 30);
        } else if (type === 'envelope') {
            y = centerY - Math.abs(Math.sin(x * 0.04) * 45);
        } else if (type === 'digital') {
            y = centerY + (Math.floor(x / 30) % 2 === 0 ? -35 : 35);
        } else if (type === 'pulse') {
            y = (x > w * 0.4 && x < w * 0.6) ? centerY - 45 : centerY + 25;
        } else if (type === 'active') {
            y = centerY + (Math.random() - 0.5) * 40;
        } else if (type === 'burst') {
            y = centerY + (x > w * 0.2 && x < w * 0.8 ? Math.sin(x * 0.4) * 50 : 0);
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.stroke();
}

/* --- 10. Interactive Live Sensor Node Simulator --- */
function initNodeSimulator() {
    const triggerBtn = document.getElementById('trigger-wake-btn');
    const stateBadge = document.getElementById('sim-state-badge');
    const nodeBox = document.getElementById('sim-node-box');
    const scopeCanvas = document.getElementById('oscilloscope-canvas');

    if (!triggerBtn || !scopeCanvas) return;

    const ctx = scopeCanvas.getContext('2d');
    let isSimulating = false;
    let powerHistory = new Array(100).fill(0.05); // 50nW base

    function renderScope() {
        const w = scopeCanvas.width = scopeCanvas.clientWidth;
        const h = scopeCanvas.height = scopeCanvas.clientHeight;

        ctx.clearRect(0, 0, w, h);

        // Draw Grid
        ctx.strokeStyle = 'rgba(0, 191, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 30) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += 30) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Draw Power Wave
        ctx.strokeStyle = '#00c853';
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        const dx = w / (powerHistory.length - 1);
        for (let i = 0; i < powerHistory.length; i++) {
            const x = i * dx;
            const y = h - (powerHistory[i] * (h - 20));
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    setInterval(() => {
        if (!isSimulating) {
            powerHistory.shift();
            powerHistory.push(0.05 + (Math.random() - 0.5) * 0.01);
        }
        renderScope();
    }, 100);

    triggerBtn.addEventListener('click', () => {
        if (isSimulating) return;
        isSimulating = true;
        triggerBtn.disabled = true;

        // Sequence Stages
        stateBadge.textContent = "STAGE 1: RF Wake-Up Signal Detected";
        stateBadge.classList.add('active-wake');

        setTimeout(() => {
            stateBadge.textContent = "STAGE 2: Nanowatt Comparator Interrupt Triggered";
            // Push power spike
            for (let i = 0; i < 15; i++) {
                powerHistory.shift();
                powerHistory.push(0.25);
            }
        }, 800);

        setTimeout(() => {
            stateBadge.textContent = "STAGE 3: MSP430 Awakened (LPM4.5 -> Active Mode)";
            nodeBox.classList.add('awakened');
            for (let i = 0; i < 25; i++) {
                powerHistory.shift();
                powerHistory.push(0.85);
            }
        }, 1600);

        setTimeout(() => {
            stateBadge.textContent = "STAGE 4: Reading Sensors & Data Payload Transmitted";
            for (let i = 0; i < 20; i++) {
                powerHistory.shift();
                powerHistory.push(0.95);
            }
        }, 2500);

        setTimeout(() => {
            stateBadge.textContent = "STAGE 5: Returning to Zero-Energy Standby Sleep";
            nodeBox.classList.remove('awakened');
            stateBadge.classList.remove('active-wake');
            for (let i = 0; i < 15; i++) {
                powerHistory.shift();
                powerHistory.push(0.05);
            }
            isSimulating = false;
            triggerBtn.disabled = false;
        }, 3600);
    });
}

/* --- 11. Sliding Image Gallery Carousel --- */
function initGalleryCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (!track || !prevBtn || !nextBtn) return;

    const slides = Array.from(track.children);
    let currentIndex = 0;

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });

    // Auto slide every 6s
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }, 6000);
}

/* --- 12. Lightbox Preview Modal --- */
function initLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const modalCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');

    if (!modal || !modalImg) return;

    document.querySelectorAll('.slide-img-wrap img').forEach(img => {
        img.addEventListener('click', () => {
            modalImg.src = img.src;
            modalCaption.textContent = img.getAttribute('alt') || 'MSP430 Wake-Up Receiver Hardware';
            modal.classList.add('active');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

/* --- 13. Scroll To Top & FAB --- */
function initScrollTop() {
    const btn = document.getElementById('scroll-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* --- 14. Ripple Effect on Buttons --- */
function initRippleEffect() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const circle = document.createElement('span');
            circle.classList.add('ripple');
            const diameter = Math.max(rect.width, rect.height);
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
            circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
            this.appendChild(circle);

            setTimeout(() => circle.remove(), 600);
        });
    });
}
