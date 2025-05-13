export class Icons {
  icon: Phaser.Physics.Matter.Sprite;
  angle: number;
  startY: number;
  speed: number;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    random: any,
    speed: number
  ) {
    this.icon = scene.matter.add
      .sprite(x + 20, y, random?.name, 0, {
        label: random?.name,
        isSensor: random?.isSensor,
        ignoreGravity: true,
      })
      .setScale(0.5);
    this.angle = 0;
    this.startY = y;
    this.speed = speed;
  }
  moveIcon(delta: number) {
    this.angle += delta;
    const y = this.startY + Math.sin(this.angle * 0.005) * 100;
    this.icon.setPosition(this.icon.x, y);
    this.icon.setVelocityX(this.speed);
    this.speed -= 0.001;
  }
}
