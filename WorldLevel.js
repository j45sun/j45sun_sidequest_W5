class WorldLevel {
  constructor(levelJson) {
    this.name = levelJson.name ?? "Level";

    this.theme = Object.assign(
      { bg: "#F0F0F0", platform: "#C8C8C8", blob: "#1478FF" },
      levelJson.theme ?? {},
    );

    // Physics knobs
    this.gravity = levelJson.gravity ?? 0.65;
    this.jumpV = levelJson.jumpV ?? -11.0;

    // Camera knob (data-driven view state)
    this.camLerp = levelJson.camera?.lerp ?? 0.12;

    // World size + death line
    this.w = levelJson.world?.w ?? 2400;
    this.h = levelJson.world?.h ?? 360;
    // Alien at end of map
    this.alien = {
      x: this.w - 100, // near the right edge
      y: 350, // height above the ground
      r: 20, // size of alien
      color: color(0, 255, 0), // green
    };
    this.deathY = levelJson.world?.deathY ?? this.h + 200;

    // Start
    this.start = Object.assign({ x: 80, y: 220, r: 26 }, levelJson.start ?? {});

    // moon craters
    this.craters = [];

    // Platforms
    this.platforms = (levelJson.platforms ?? []).map(
      (p) => new Platform(p.x, p.y, p.w, p.h),
    );

    for (let i = 0; i < 40; i++) {
      this.craters.push({
        x: random(this.w),
        y: random(465, 480),
        r: random(20, 50),
      });
    }

    //stars
    this.stars = [];

    for (let i = 0; i < 120; i++) {
      this.stars.push({
        x: random(this.w),
        y: random(0, 400), // only in sky area
        size: random(1, 3),
        phase: random(TAU), // for twinkle timing
      });
    }
  }

  drawWorld() {
    noFill();
    for (let y = 0; y < height; y++) {
      // <-- use viewport height
      const inter = map(y, 0, height, 0, 1);
      const c1 = color("#415a77"); // top
      const c2 = color("#0d1b2a"); // bottom
      stroke(lerpColor(c1, c2, inter));
      line(0, y, width, y); // <-- width of canvas
    }

    // draw stars
    noStroke();

    for (const s of this.stars) {
      // twinkle effect
      const glow = 180 + 75 * sin(frameCount * 0.05 + s.phase);

      fill(glow);
      ellipse(s.x, s.y, s.size);
    }
    push();
    rectMode(CORNER); // critical: undo any global rectMode(CENTER) [web:230]
    noStroke();
    fill(this.theme.platform);

    for (const p of this.platforms) rect(p.x, p.y, p.w, p.h); // x,y = top-left [web:234]

    // moon craters
    for (const p of this.platforms) rect(p.x, p.y, p.w, p.h);

    fill(160, 165, 170);
    noStroke();
    for (const c of this.craters) {
      ellipse(c.x, c.y, c.r);
    }

    // alein at end of map
    fill(this.alien.color);
    noStroke();
    ellipse(this.alien.x, this.alien.y, this.alien.r * 2);

    // eyes
    fill(0);
    ellipse(this.alien.x - 5, this.alien.y - 5, 5);
    ellipse(this.alien.x + 5, this.alien.y - 5, 5);

    // antenna
    strokeWeight(2);
    line(
      this.alien.x - 10,
      this.alien.y - this.alien.r / 2,
      this.alien.x - 15,
      this.alien.y - this.alien.r - 10,
    );
    line(
      this.alien.x + 10,
      this.alien.y - this.alien.r / 2,
      this.alien.x + 15,
      this.alien.y - this.alien.r - 10,
    );
    noStroke();
    fill(255, 0, 0);
    ellipse(this.alien.x - 15, this.alien.y - this.alien.r - 10, 5);
    ellipse(this.alien.x + 15, this.alien.y - this.alien.r - 10, 5);
    pop();
  }
}
