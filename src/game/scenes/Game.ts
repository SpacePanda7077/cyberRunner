import { Scene } from "phaser";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }
  preload() {
    this.load.image("angryFace", "assets/angryFace.png");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);
    this.add.sprite(100, 100, "angryFace");

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("GameOver");
    });
  }
}
