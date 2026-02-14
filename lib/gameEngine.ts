import { GAME_CONSTANTS, HEART_PATTERNS, GAP_BETWEEN_PATTERNS, JULES_MESSAGES } from '../constants';
import { CatObject, HeartObject, Particle, CloudObject, SceneryObject, ButterflyObject, BirdObject } from '../types';

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;


  score: number = 0;
  distance: number = 0;
  speed: number = GAME_CONSTANTS.SCROLL_SPEED_BASE;
  gameOver: boolean = false;
  victory: boolean = false;
  frameCount: number = 0;


  bart: CatObject;
  jules: CatObject;
  hearts: HeartObject[] = [];
  particles: Particle[] = [];


  clouds: CloudObject[] = [];
  scenery: SceneryObject[] = [];
  butterflies: ButterflyObject[] = [];
  birds: BirdObject[] = [];


  groundY: number;
  julesJumpQueue: number | null = null;
  nextSpawnDistance: number = 0;
  nextScenerySpawn: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;
    this.groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_Y_OFFSET;


    this.bart = {
      x: GAME_CONSTANTS.CANVAS_WIDTH * 0.25,
      y: this.groundY - 36,
      width: 44,
      height: 36,
      velocity_y: 0,
      isJumping: false,
      color: '#FF8C00',
      name: 'BART'
    };

    this.jules = {
      x: (GAME_CONSTANTS.CANVAS_WIDTH * 0.25) - GAME_CONSTANTS.JULES_FOLLOW_DISTANCE,
      y: this.groundY - 36,
      width: 44,
      height: 36,
      velocity_y: 0,
      isJumping: false,
      color: '#FFFFFF',
      patches: true,
      name: 'JULES',
      message: '',
      messageTimer: 0
    };

    this.reset();
  }

  reset() {
    this.score = 0;
    this.distance = 0;
    this.speed = GAME_CONSTANTS.SCROLL_SPEED_BASE;
    this.gameOver = false;
    this.victory = false;
    this.hearts = [];
    this.particles = [];
    this.clouds = [];
    this.scenery = [];
    this.butterflies = [];
    this.birds = [];
    this.nextSpawnDistance = 500;
    this.nextScenerySpawn = 0;

    this.bart.y = this.groundY - 36;
    this.bart.velocity_y = 0;
    this.bart.isJumping = false;

    this.jules.y = this.groundY - 36;
    this.jules.velocity_y = 0;
    this.jules.isJumping = false;
    this.jules.message = "";
    this.jules.messageTimer = 0;
    this.julesJumpQueue = null;


    this.initScenery();
  }

  initScenery() {

    for (let i = 0; i < 6; i++) {
      this.clouds.push({
        x: Math.random() * GAME_CONSTANTS.CANVAS_WIDTH,
        y: 20 + Math.random() * 100,
        width: 60 + Math.random() * 60,
        speed: 0.2 + Math.random() * 0.5
      });
    }


    for (let i = 0; i < 3; i++) {
      this.spawnSceneryItem(i * 300 + 100);
    }
  }

  jump() {
    if (this.bart.isJumping || this.gameOver || this.victory) return;

    this.bart.velocity_y = GAME_CONSTANTS.JUMP_FORCE;
    this.bart.isJumping = true;


    setTimeout(() => {
      if (!this.gameOver && !this.victory) {
        this.jules.velocity_y = GAME_CONSTANTS.JUMP_FORCE;
        this.jules.isJumping = true;
      }
    }, GAME_CONSTANTS.JUMP_DELAY);
  }

  update(isPlaying: boolean) {
    this.frameCount++;

    this.updateBackgroundElements();


    if (this.victory) {
      this.updateParticles();

      if (this.frameCount % 15 === 0) {
        const x = Math.random() * GAME_CONSTANTS.CANVAS_WIDTH;
        const y = Math.random() * (GAME_CONSTANTS.CANVAS_HEIGHT / 2);
        this.spawnFireworkBurst(x, y, 40);
      }

      this.bart.y = this.groundY - this.bart.height;
      this.jules.y = this.groundY - this.jules.height;
      return;
    }

    if (!isPlaying) {
      this.bart.y = this.groundY - this.bart.height;
      this.jules.y = this.groundY - this.jules.height;
      return;
    }

    if (this.gameOver) {
      return;
    }

    this.distance += this.speed;


    if (this.score > 0 && this.score % 50 === 0) {

    }


    this.applyPhysics(this.bart);
    this.applyPhysics(this.jules);


    if (this.jules.messageTimer && this.jules.messageTimer > 0) {
      this.jules.messageTimer--;
      if (this.jules.messageTimer <= 0) {
        this.jules.message = "";
      }
    } else {

      if (Math.random() < 0.02) {
        const msg = JULES_MESSAGES[Math.floor(Math.random() * JULES_MESSAGES.length)];
        this.jules.message = msg;
        this.jules.messageTimer = 180;
      }
    }


    if (this.distance > this.nextSpawnDistance) {
      this.spawnPattern();
    }


    if (this.distance > this.nextScenerySpawn) {
      this.spawnSceneryItem(GAME_CONSTANTS.CANVAS_WIDTH + 100);
      this.nextScenerySpawn = this.distance + 200 + Math.random() * 300;
    }


    if (Math.random() < 0.015) {
      this.butterflies.push({
        x: GAME_CONSTANTS.CANVAS_WIDTH + 50,
        y: this.groundY - 50 - Math.random() * 100,
        baseY: this.groundY - 50 - Math.random() * 100,
        speed: 2 + Math.random() * 1,
        color: Math.random() > 0.5 ? '#FF69B4' : '#00FFFF', // Pink or Cyan
        offset: Math.random() * Math.PI * 2
      });
    }

    // Random Bird spawn (Higher up)
    if (Math.random() < 0.005) {
      this.birds.push({
        x: GAME_CONSTANTS.CANVAS_WIDTH + 50,
        y: 40 + Math.random() * 150,
        speed: 3 + Math.random() * 1.5,
        color: '#FFB6C1', // Light pink birds
        wingOffset: Math.random() * 10
      });
    }

    // Update Hearts
    this.updateHearts();

    // Win Condition
    if (this.score >= GAME_CONSTANTS.WIN_SCORE) {
      this.victory = true;
      // Initial massive burst
      this.spawnFireworkBurst(GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 3, 200);
      this.spawnFireworkBurst(GAME_CONSTANTS.CANVAS_WIDTH / 4, GAME_CONSTANTS.CANVAS_HEIGHT / 3, 100);
      this.spawnFireworkBurst(3 * GAME_CONSTANTS.CANVAS_WIDTH / 4, GAME_CONSTANTS.CANVAS_HEIGHT / 3, 100);
    }
  }

  updateBackgroundElements() {
    // Clouds
    this.clouds.forEach(c => {
      c.x -= c.speed;
      if (c.x + c.width < -100) {
        c.x = GAME_CONSTANTS.CANVAS_WIDTH + 50;
        c.y = 20 + Math.random() * 120;
      }
    });

    // Scenery (moves slower than foreground speed for parallax effect)
    const scenerySpeed = this.speed * 0.5;
    for (let i = this.scenery.length - 1; i >= 0; i--) {
      const item = this.scenery[i];
      if (!this.victory) item.x -= scenerySpeed;
      if (item.x + item.width < -150) {
        this.scenery.splice(i, 1);
      }
    }

    // Butterflies
    for (let i = this.butterflies.length - 1; i >= 0; i--) {
      const b = this.butterflies[i];
      b.x -= b.speed;
      b.y = b.baseY + Math.sin(this.frameCount * 0.15 + b.offset) * 20;
      if (b.x < -20) this.butterflies.splice(i, 1);
    }

    // Birds
    for (let i = this.birds.length - 1; i >= 0; i--) {
      const b = this.birds[i];
      b.x -= b.speed;
      b.y += Math.sin(this.frameCount * 0.05 + b.wingOffset) * 0.5; // Slight glide wave
      if (b.x < -30) this.birds.splice(i, 1);
    }
  }

  spawnSceneryItem(x: number) {
    const rand = Math.random();

    if (rand < 0.4) {
      // Orchid Tree
      this.scenery.push({
        type: 'tree',
        x: x,
        y: this.groundY,
        width: 50,
        height: 100 + Math.random() * 40,
        color: '#556B2F', // Dark Olive Green foliage base
        details: { orchids: true }
      });
    } else if (rand < 0.7) {
      // Vine Tree
      this.scenery.push({
        type: 'vine_tree',
        x: x,
        y: this.groundY,
        width: 60,
        height: 110 + Math.random() * 50,
        color: '#2E8B57', // Sea Green
      });
    } else if (rand < 0.9) {
      // Village House
      this.scenery.push({
        type: 'village_house',
        x: x,
        y: this.groundY,
        width: 70 + Math.random() * 20,
        height: 60 + Math.random() * 20,
        color: '#FFB6C1', // Light pink walls
      });
    } else {
      // Castle (Rare)
      this.scenery.push({
        type: 'castle',
        x: x,
        y: this.groundY,
        width: 100,
        height: 140,
        color: '#806080' // Purple/Grey
      });
    }
  }

  applyPhysics(cat: CatObject) {
    cat.y += cat.velocity_y;
    cat.velocity_y += GAME_CONSTANTS.GRAVITY;

    // Ground collision
    if (cat.y > this.groundY - cat.height) {
      cat.y = this.groundY - cat.height;
      cat.velocity_y = 0;
      cat.isJumping = false;
    }
  }

  spawnPattern() {
    const pattern = HEART_PATTERNS[Math.floor(Math.random() * HEART_PATTERNS.length)];

    pattern.hearts.forEach(h => {
      this.hearts.push({
        x: GAME_CONSTANTS.CANVAS_WIDTH + (h.x || 0),
        y: (this.groundY - 30) + h.y,
        width: 20,
        height: 20,
        collected: false,
        color: Math.random() > 0.5 ? '#FF1493' : '#FFD700',
        baseY: (this.groundY - 30) + h.y,
        bobOffset: Math.random() * Math.PI * 2
      });
    });

    const gap = GAP_BETWEEN_PATTERNS[Math.floor(Math.random() * GAP_BETWEEN_PATTERNS.length)];
    const speedFactor = Math.floor(this.score / 50) * 0.1;
    const finalGap = gap * (1 - Math.min(speedFactor, 0.5));

    this.nextSpawnDistance = this.distance + finalGap;
  }

  updateHearts() {
    for (let i = this.hearts.length - 1; i >= 0; i--) {
      const heart = this.hearts[i];
      heart.x -= this.speed;

      // Bobbing animation
      heart.y = heart.baseY + Math.sin(this.frameCount * 0.1 + heart.bobOffset) * 5;

      // Collision Detection
      if (!heart.collected) {
        if (this.checkCollision(this.bart, heart) || this.checkCollision(this.jules, heart)) {
          heart.collected = true;
          this.score += 10;
        }
      }

      // Remove off-screen
      if (heart.x < -50) {
        this.hearts.splice(i, 1);
      }
    }
  }

  checkCollision(cat: CatObject, heart: HeartObject) {
    const hitboxPadding = 5;
    return (
      cat.x + hitboxPadding < heart.x + heart.width &&
      cat.x + cat.width - hitboxPadding > heart.x &&
      cat.y + hitboxPadding < heart.y + heart.height &&
      cat.y + cat.height - hitboxPadding > heart.y
    );
  }

  spawnFireworkBurst(x: number, y: number, count: number) {
    const colors = ['#FF1493', '#FFD700', '#FF0000', '#00FFFF', '#FF00FF', '#FFFFFF', '#32CD32'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: 1.5 + Math.random(),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2
      });
    }
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      p.vy += 0.1; // Gravity for particles
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  // --- RENDERING ---

  draw() {
    // Clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Sky & Celestial Bodies
    this.drawSkyAndSun();

    // Draw Background Scenery (Clouds, Trees, Houses)
    this.drawSceneryElements();

    // Draw Birds (Behind ground, above distant scenery)
    this.drawBirds();

    // Draw Ground
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.fillRect(0, this.groundY, this.canvas.width, GAME_CONSTANTS.CANVAS_HEIGHT - this.groundY);

    // Draw Pixel Stripes on Ground
    this.ctx.fillStyle = '#FFF0F5';
    const stripeWidth = 40;
    const offset = -(this.distance % (stripeWidth * 2));
    for (let x = offset; x < this.canvas.width; x += stripeWidth * 2) {
      this.ctx.fillRect(Math.floor(x), this.groundY + 10, stripeWidth, 20);
    }

    // Draw Hearts
    this.hearts.forEach(heart => {
      if (heart.collected) return;
      this.drawHeart(heart);
    });

    // Draw Butterflies
    this.drawButterflies();

    // Draw Cats
    this.drawDetailedCat(this.jules);
    this.drawDetailedCat(this.bart);

    // Draw Particles with Pixel Glow
    this.particles.forEach(p => {
      this.ctx.globalAlpha = Math.max(0, p.life);

      // Glow (larger, translucent square behind)
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.life * 0.4);
      const glowSize = p.size * 3;
      this.ctx.fillRect(Math.floor(p.x - p.size), Math.floor(p.y - p.size), glowSize, glowSize);

      // Core (solid center)
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);

      this.ctx.globalAlpha = 1.0;
    });
  }

  drawSkyAndSun() {
    let skyColor1 = '#87CEEB'; // Day blue
    let skyColor2 = '#E0F7FA'; // Light cyan

    if (this.score >= 100) {
      skyColor1 = '#191970'; // Midnight Blue
      skyColor2 = '#483D8B'; // Dark Slate Blue
    }

    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, skyColor1);
    gradient.addColorStop(1, skyColor2);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Sun or Moon (Pixelated)
    const px = 4; // Pixel scale for sun/moon
    const cx = GAME_CONSTANTS.CANVAS_WIDTH - 100;
    const cy = 80;
    const radius = 32;

    this.ctx.fillStyle = (this.score >= 100) ? '#F4F6F0' : '#FFD700';

    // Draw pixel circle
    for (let y = -radius; y <= radius; y += px) {
      for (let x = -radius; x <= radius; x += px) {
        if (x * x + y * y <= radius * radius) {
          this.ctx.fillRect(cx + x, cy + y, px, px);
        }
      }
    }

    // Sun Rays (Day only)
    if (this.score < 100) {
      this.ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
      const rayLen = 16;
      // Cardinal directions
      this.ctx.fillRect(cx - radius - rayLen, cy - 4, rayLen, 8);
      this.ctx.fillRect(cx + radius, cy - 4, rayLen, 8);
      this.ctx.fillRect(cx - 4, cy - radius - rayLen, 8, rayLen);
      this.ctx.fillRect(cx - 4, cy + radius, 8, rayLen);
    }
  }

  drawSceneryElements() {
    const px = 4; // Background pixel scale

    // 1. Clouds
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.clouds.forEach(c => {
      const x = Math.floor(c.x);
      const y = Math.floor(c.y);
      const w = Math.floor(c.width);

      // Pixel Cloud Shape
      // Bottom Layer
      this.ctx.fillRect(x, y + px * 4, w, px * 4);
      // Middle Layer
      this.ctx.fillRect(x + px * 2, y + px * 2, w - px * 4, px * 2);
      // Top bumps
      this.ctx.fillRect(x + px * 4, y, px * 4, px * 2);
      this.ctx.fillRect(x + w / 2, y - px * 2, px * 6, px * 4);
    });

    // 2. Scenery
    this.scenery.forEach(item => {
      const x = Math.floor(item.x);
      const y = Math.floor(item.y);
      const w = Math.floor(item.width);
      const h = Math.floor(item.height);

      if (item.type === 'tree') {
        // --- ORCHID TREE ---
        // Trunk
        this.ctx.fillStyle = '#8B4513'; // SaddleBrown
        this.ctx.fillRect(x + w / 2 - px, y - h / 4, px * 2, h / 4);

        // Foliage (Deep green + Purple tint)
        this.ctx.fillStyle = item.color;
        // Layers
        this.ctx.fillRect(x, y - h / 2, w, h / 4);
        this.ctx.fillRect(x + px * 2, y - h * 0.75, w - px * 4, h / 4);
        this.ctx.fillRect(x + px * 4, y - h, w - px * 8, h / 4);

        // Orchids (Vibrant Pink/Purple Pixels)
        this.ctx.fillStyle = '#FF1493'; // Deep Pink
        // Random-ish placements using modulo on coords to keep it deterministic per frame
        if ((x % 7) < 4) this.ctx.fillRect(x + px * 2, y - h / 2 - px, px, px);
        if ((x % 5) < 3) this.ctx.fillRect(x + w - px * 3, y - h * 0.6, px, px);
        if ((x % 3) < 2) this.ctx.fillRect(x + w / 2, y - h + px * 2, px, px);

        // Secondary flower color
        this.ctx.fillStyle = '#DA70D6'; // Orchid
        if ((x % 4) === 0) this.ctx.fillRect(x + px * 4, y - h / 2 + px, px, px);

      } else if (item.type === 'vine_tree') {
        // --- VINE TREE ---
        // Trunk
        this.ctx.fillStyle = '#556B2F'; // Dark Olive Green
        this.ctx.fillRect(x + w / 2 - px * 1.5, y - h / 3, px * 3, h / 3);

        // Canopy (Wide and flat)
        this.ctx.fillStyle = '#2E8B57'; // Sea Green
        this.ctx.fillRect(x - px * 2, y - h, w + px * 4, h * 0.7);

        // Hanging Vines
        this.ctx.fillStyle = '#8FBC8F'; // Dark Sea Green (lighter than canopy)
        // Vine 1
        this.ctx.fillRect(x, y - h * 0.3, px, h * 0.2);
        // Vine 2
        this.ctx.fillRect(x + w / 2, y - h * 0.3, px, h * 0.15);
        // Vine 3
        this.ctx.fillRect(x + w - px, y - h * 0.3, px, h * 0.25);

      } else if (item.type === 'village_house') {
        // --- VILLAGE HOUSE ---
        const houseColor = item.color || '#FFB6C1';

        // Walls
        this.ctx.fillStyle = houseColor;
        this.ctx.fillRect(x, y - h / 2, w, h / 2);

        // Roof (Triangle-ish steps)
        this.ctx.fillStyle = '#CD5C5C'; // Indian Red
        this.ctx.fillRect(x - px, y - h / 2, w + px * 2, px * 2); // Eaves
        this.ctx.fillRect(x + px, y - h / 2 - px * 2, w - px * 2, px * 2); // Mid
        this.ctx.fillRect(x + px * 3, y - h / 2 - px * 4, w - px * 6, px * 2); // Top

        // Door
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x + w / 2 - px * 2, y - px * 6, px * 4, px * 6);

        // Window (Lit up)
        this.ctx.fillStyle = '#FFFFE0'; // Light Yellow
        this.ctx.fillRect(x + px * 2, y - h / 2 + px * 4, px * 3, px * 3);
        this.ctx.fillRect(x + w - px * 5, y - h / 2 + px * 4, px * 3, px * 3);

      } else if (item.type === 'castle') {
        // --- CASTLE ---
        // Castle Base
        this.ctx.fillStyle = item.color;
        this.ctx.fillRect(x, y - h / 2, w, h / 2);

        // Towers
        this.ctx.fillRect(x - px * 2, y - h * 0.8, px * 4, h * 0.8);
        this.ctx.fillRect(x + w - px * 2, y - h * 0.8, px * 4, h * 0.8);

        // Battlements
        this.ctx.fillStyle = item.color;
        for (let bx = x; bx < x + w; bx += px * 2) {
          this.ctx.fillRect(bx, y - h / 2 - px, px, px);
        }

        // Roofs (Purple/Red)
        this.ctx.fillStyle = '#800080'; // Purple
        this.ctx.fillRect(x - px, y - h * 0.8 - px * 2, px * 2, px * 2);
        this.ctx.fillRect(x + w - px, y - h * 0.8 - px * 2, px * 2, px * 2);

        // Windows
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(x + w / 2 - px, y - h / 3, px * 2, px * 3);
      }
    });
  }

  drawBirds() {
    this.birds.forEach(b => {
      const x = Math.floor(b.x);
      const y = Math.floor(b.y);
      const px = 2; // Bird pixel size

      this.ctx.fillStyle = b.color;

      // Bird Body (Simple horizontal dash)
      this.ctx.fillRect(x, y, px * 3, px);

      // Wings (Flapping based on offset + time)
      const flap = Math.sin(this.frameCount * 0.2 + b.wingOffset);
      if (flap > 0) {
        // Wing Up
        this.ctx.fillRect(x + px, y - px, px, px);
      } else {
        // Wing Down
        this.ctx.fillRect(x + px, y + px, px, px);
      }
    });
  }

  drawButterflies() {
    this.butterflies.forEach(b => {
      const px = 2; // Small pixel size
      const x = Math.floor(b.x);
      const y = Math.floor(b.y);

      this.ctx.fillStyle = b.color;
      // Body
      this.ctx.fillRect(x, y, px, px * 3);

      // Wings (Flapping animation via width)
      const wingW = Math.floor(Math.abs(Math.sin(this.frameCount * 0.3)) * 4 + 2);
      this.ctx.fillStyle = '#FFF';
      // Left wing
      this.ctx.fillRect(x - wingW, y, wingW, px * 2);
      // Right wing
      this.ctx.fillRect(x + px, y, wingW, px * 2);
    });
  }

  // High detail pixel art rendering (2x resolution)
  drawDetailedCat(cat: CatObject) {
    const ctx = this.ctx;
    const pixelSize = 2; // Finer detail
    const startX = Math.floor(cat.x);
    const startY = Math.floor(cat.y);

    const isBart = !cat.patches;

    // Palette
    const C_ORANGE = '#FF8C00';
    const C_BLACK = '#1A1A1A';
    const C_WHITE = '#FFFFFF';
    const C_PINK = '#FF69B4'; // Ears/Nose
    // Updated: Bart has Blue eyes (#00BFFF), Jules has Amber (#FFBF00)
    const C_EYE = isBart ? '#00BFFF' : '#FFBF00';

    // Animation frames (0, 1, 2, 3) for smoother run
    const runCycle = Math.floor(this.frameCount / 5) % 4;

    // Helper to draw a pixel
    const p = (x: number, y: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(startX + x * pixelSize, startY + y * pixelSize, pixelSize, pixelSize);
    };

    const fillRect = (x: number, y: number, w: number, h: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(startX + x * pixelSize, startY + y * pixelSize, w * pixelSize, h * pixelSize);
    };

    // --- BODY & HEAD CONSTRUCTION ---
    // Grid coordinate system: 22 units wide, 18 units tall

    // Body (Main block)
    const bodyColor = isBart ? C_ORANGE : C_WHITE;
    fillRect(2, 6, 14, 8, bodyColor);

    if (isBart) {
      // Bart's Stripes/Details
      fillRect(4, 6, 1, 3, '#D2691E'); // Darker orange stripe
      fillRect(8, 6, 1, 3, '#D2691E');
      fillRect(12, 6, 1, 3, '#D2691E');
      // Belly
      fillRect(4, 11, 10, 3, C_WHITE);
    } else {
      // Jules Calico Patches (Black & Orange on White)
      fillRect(3, 7, 3, 3, C_BLACK);
      fillRect(10, 6, 4, 3, C_ORANGE);
      fillRect(5, 10, 3, 3, C_ORANGE);
      fillRect(12, 11, 3, 3, C_BLACK);
    }

    // Head (Offset right and up)
    const headX = 13;
    const headY = 2;
    const headColor = isBart ? C_ORANGE : C_WHITE;

    // Head Base
    fillRect(headX, headY, 8, 7, headColor);

    if (!isBart) {
      // Jules Face Patch
      fillRect(headX, headY, 3, 4, C_BLACK); // Left ear/eye area
      fillRect(headX + 5, headY, 3, 3, C_ORANGE); // Right ear area
    }

    // Ears
    p(headX + 1, headY - 1, isBart ? C_ORANGE : C_BLACK);
    p(headX, headY, isBart ? C_ORANGE : C_BLACK);

    p(headX + 6, headY - 1, isBart ? C_ORANGE : C_ORANGE);
    p(headX + 7, headY, isBart ? C_ORANGE : C_ORANGE);

    // Eyes
    if (this.victory) {
      // ^ ^ Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(startX + (headX + 2) * pixelSize, startY + (headY + 3) * pixelSize, 1 * pixelSize, 1 * pixelSize);
      ctx.fillRect(startX + (headX + 3) * pixelSize, startY + (headY + 2) * pixelSize, 1 * pixelSize, 1 * pixelSize);

      ctx.fillRect(startX + (headX + 6) * pixelSize, startY + (headY + 3) * pixelSize, 1 * pixelSize, 1 * pixelSize);
      ctx.fillRect(startX + (headX + 5) * pixelSize, startY + (headY + 2) * pixelSize, 1 * pixelSize, 1 * pixelSize);
    } else {
      fillRect(headX + 2, headY + 3, 1, 1, C_EYE);
      fillRect(headX + 5, headY + 3, 1, 1, C_EYE);
    }

    // Nose
    p(headX + 4, headY + 5, C_PINK);

    // Tail (Animated)
    const tailColor = isBart ? C_ORANGE : C_BLACK;
    const tailFrame = Math.floor(this.frameCount / 10) % 2;
    if (tailFrame === 0) {
      fillRect(0, 5, 2, 2, tailColor);
      p(0, 4, tailColor);
    } else {
      fillRect(0, 6, 2, 2, tailColor);
      p(1, 5, tailColor);
    }

    // Legs (Running Animation)
    const legColor = '#0D0D0D';
    if (cat.isJumping) {
      // Jumping pose (legs tucked/extended)
      fillRect(4, 14, 2, 3, legColor); // Back
      fillRect(14, 12, 3, 2, legColor); // Front forward
    } else {
      // Running cycle
      if (runCycle === 0) {
        fillRect(3, 14, 2, 3, legColor); // Back
        fillRect(13, 14, 2, 3, legColor); // Front
      } else if (runCycle === 1) {
        fillRect(2, 13, 2, 3, legColor);
        fillRect(12, 13, 2, 3, legColor);
      } else if (runCycle === 2) {
        fillRect(4, 14, 2, 3, legColor);
        fillRect(14, 14, 2, 3, legColor);
      } else {
        fillRect(5, 13, 2, 3, legColor);
        fillRect(15, 13, 2, 3, legColor);
      }
    }

    // --- NAME TAG ---
    ctx.fillStyle = '#FFF';
    ctx.font = '8px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.shadowColor = "black";
    ctx.shadowBlur = 2;
    ctx.fillText(cat.name, cat.x + (cat.width / 2), cat.y - 12);
    ctx.shadowBlur = 0; // Reset

    // --- SPEECH BUBBLE (Jules only) ---
    if (cat.message) {
      const bubbleX = cat.x + cat.width + 5;
      const bubbleY = cat.y - 35;
      const padding = 6;

      ctx.font = '10px "Press Start 2P"';
      const metrics = ctx.measureText(cat.message);
      const textWidth = metrics.width;
      const textHeight = 12;

      // Draw bubble background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.strokeStyle = '#FF1493';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(bubbleX, bubbleY, textWidth + padding * 2, textHeight + padding * 2, 4);
      ctx.fill();
      ctx.stroke();

      // Tail
      ctx.beginPath();
      ctx.moveTo(bubbleX, bubbleY + 15);
      ctx.lineTo(bubbleX - 6, bubbleY + 20);
      ctx.lineTo(bubbleX + 5, bubbleY + 22);
      ctx.fill();
      ctx.stroke();

      // Clean up overlap
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(bubbleX + 2, bubbleY + 15, 6, 8);

      // Text
      ctx.fillStyle = '#FF1493';
      ctx.textAlign = 'left';
      ctx.fillText(cat.message, bubbleX + padding, bubbleY + textHeight + padding - 4);
    }
  }

  drawHeart(heart: HeartObject) {
    this.ctx.fillStyle = heart.color;
    const x = Math.floor(heart.x);
    const y = Math.floor(heart.y);
    const px = 1; // Base unit

    // Pixel heart shape (5x5 grid approx)
    this.ctx.fillRect(x + 5, y, 5, 5);
    this.ctx.fillRect(x + 15, y, 5, 5);
    this.ctx.fillRect(x, y + 5, 25, 5);
    this.ctx.fillRect(x + 5, y + 10, 15, 5);
    this.ctx.fillRect(x + 10, y + 15, 5, 5);
  }
}