// Animation code adapted from Eduard Iudinkov's work

const COLORS = "#FFFFFF";

// SETS THE DEPTH OF THE STARS
const Z = 150;

// OBJECT FOR GENERATING RANDOM NUMBERS
const randomNum = {
  uniform: (min, max) => Math.random() * (max - min) + min,
};

// VECTOR CLASS TO DEFINE POSITIONS AND VELOCITIES
class Vec {
  constructor(...components) {
    this.components = components;
  }

  // ADDS TWO VECTORS
  add(vec) {
    this.components = this.components.map((c, i) => c + vec.components[i]);
    return this;
  }

  // SUBTRACTS TWO VECTORS
  sub(vec) {
    this.components = this.components.map((c, i) => c - vec.components[i]);
    return this;
  }

  // DIVIDES A VECTOR BY A VECTOR
  div(vec) {
    this.components = this.components.map((c, i) => c / vec.components[i]);
    return this;
  }

  // SCALES A VECTOR BY A SCALAR VALUE
  scale(scalar) {
    this.components = this.components.map((c) => c * scalar);
    return this;
  }

  // MULTIPLIES TWO VECTORS
  multiply(vec) {
    this.components = this.components.map((c, i) => c * vec.components[i]);
    return this;
  }
}

// CENTER OF THE SCREEN
const CENTER = new Vec(window.innerWidth / 2, window.innerHeight / 2);

// NUMBERS OF STARS
const STARS = 2000;

// CANVAS CLASS FOR DRAWING STARS
class Canvas {
  constructor(id) {
    this.canvas = document.createElement("canvas");

    this.canvas.id = id;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    document.body.appendChild(this.canvas);

    // GETS THE 2d CONTEXT OF THE CANVAS
    this.ctx = this.canvas.getContext("2d");
  }

  draw() {

    const space = new Space();

    // FUNCTION FOR DRAWING THE SPACE REPEADETLY 
    const draw = () => {
      // CLEARS THE CANVAS
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // UPDATES AND DRAWS SPACE
      space.run(this.ctx);

      requestAnimationFrame(draw);
    };

    // STARS LOOP
    draw();
  }
}

// STAR CLASS FOR REPRESENTING THE STAR
class Star {
  constructor() {
    // LENGTH OF STAR
    this.length = 1;

    // POSITION OF STAR IN 3D SPACE
    this.pos = this.getPosition();

    // SCREEN POSITION OF STAR
    this.screenPos = new Vec(0, 0);

    // VELOCITY OF STAR
    this.vel = randomNum.uniform(0.05, 0.25);

    this.color = COLORS;
  }

  // GETS A RANDOM POSITION OF A STAR
  getPosition(scale = 35) {
    const angle = randomNum.uniform(0, 2 * Math.PI);
    const radius =
      randomNum.uniform(window.innerHeight / scale, window.innerHeight) * scale;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return new Vec(x, y, Z);
  }

  // UPDATES THE POSITION OF A STAR
  update() {
    this.pos.components[2] -= this.vel;
    this.pos = this.pos.components[2] < 1 ? this.getPosition() : this.pos;
    this.screenPos = new Vec(this.pos.components[0], this.pos.components[1])
      .div(new Vec(this.pos.components[2], this.pos.components[2]))
      .add(CENTER);

    this.size = (Z - this.pos.components[2]) / (this.pos.components[2] * 0.2);
  }

  // DRAWS THE STAR ONTO THE CANVAS
  draw(ctx) {
    ctx.strokeStyle = this.color;

    const endX = this.screenPos.components[0] + this.length;
    const endY = this.screenPos.components[1];

    ctx.beginPath();
    ctx.moveTo(this.screenPos.components[0], this.screenPos.components[1]);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.closePath();
  }
}

// SPACE CLASS FOR REPRESENTING THE STARS AND SPACE
class Space {
  constructor() {
    // CREATES AN ARRAY OF STARS
    this.stars = new Array(STARS).fill(null).map(() => new Star());
  }

  // UPDATES THE POSITION OF STARS
  update() {
    this.stars.forEach((star) => star.update());
  }

  // DRAWS ALL STAR IN SPACE
  draw(ctx) {
    this.stars.forEach((star) => star.draw(ctx));
  }

  // RUNS THE SPACE SIMULATION
  run(ctx) {
    this.update();
    this.stars.sort((a, b) => b.pos.components[2] - a.pos.components[2]);
    this.draw(ctx);
  }
}

// CREATES THE CANVAS AND STARTS DRAWING
const canvas = new Canvas("canvas");
canvas.draw();