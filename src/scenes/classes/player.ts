export class Player {
  player: Phaser.Physics.Matter.Sprite;
  bullet: number;
  jump: boolean;
  roll: boolean;
  isOnFloor: boolean;
  isOnWall: boolean;
  falling: boolean;
  wasOnAir: boolean;
  jumpAmount: number;
  speed: number;
  gravity: boolean;
  health: number;
  bulletArray: Phaser.Physics.Matter.Sprite[];
  lastShootTime: number;
  shootDelay: number;
  isAlive: boolean;
  particle: Phaser.GameObjects.Particles.ParticleEmitter;
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    this.isOnFloor = false;
    this.isOnWall = false;
    this.wasOnAir = false;
    this.jump = false;
    this.roll = false;
    this.falling = false;
    this.gravity = false;
    this.jumpAmount = 2;
    this.speed = 4;
    this.health = 3;
    this.bullet = 5;
    this.bulletArray = [];
    this.lastShootTime = 0;
    this.shootDelay = 500;
    this.isAlive = true;

    this.player = scene.matter.add
      .sprite(x, y, texture, 0, {
        label: "player",
        shape: { type: "rectangle", x: 0, y: 20, width: 32, height: 40 },
      })
      .setFriction(0)
      .setFixedRotation()
      .setDepth(10)
      .setOrigin(0.4, 0.5);
    this.player.play("run");
    this.addParticle(scene);
  }

  addParticle(scene: Phaser.Scene) {
    const graphics = scene.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(0, 0, 20, 20);
    graphics.generateTexture("dust", 10, 10);
    graphics.destroy();

    this.particle = scene.add.particles(0, 0, "dust", {
      frequency: 500,
      lifespan: 1000,
      scale: { min: 0.2, max: 1 },
      alpha: { start: 1, end: 0 },
      speed: { min: -100, max: 100 },
      blendMode: "ADD",
    });
    this.particle.startFollow(this.player, 0, 22).setDepth(9);
  }
  spawnBullet(scene: Phaser.Scene, time: number) {
    if (this.bullet > 0 && time > this.lastShootTime + this.shootDelay) {
      const bullet = scene.matter.add
        .sprite(this.player.x + 20, this.player.y, "angryFace", 0, {
          ignoreGravity: true,
          isSensor: true,
          label: "bullet",
        })
        .setScale(0.2);
      this.bulletArray.push(bullet);
      this.lastShootTime = time;
      this.bullet--;
    }
  }
  destroyPlayer() {
    this.player.setVisible(false);
  }
}
