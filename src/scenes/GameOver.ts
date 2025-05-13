import { Scene } from "phaser";
import { setHighscrore } from "./helperFunctions/walletManager";

export class GameOver extends Scene {
  bgList: string[];
  width: number;
  height: number;
  bgArray: Phaser.GameObjects.TileSprite[];
  bgSpeedArray: number[];
  menuCont: Phaser.GameObjects.Container;
  deathCont: Phaser.GameObjects.Container;
  playBtn: Phaser.GameObjects.Text;
  gameOverBtn: Phaser.GameObjects.Text;
  restartBtn: Phaser.GameObjects.Sprite;
  menuBtn: Phaser.GameObjects.Sprite;
  distance: number;
  highScore: Phaser.GameObjects.Text;
  lastScore: any;
  constructor() {
    super("GameOver");
  }
  init(data: any) {
    this.distance = data.distance;
    this.lastScore = data.lastScore;
  }

  preload() {}

  create() {
    this.width = Number(this.game.config.width);
    this.height = Number(this.game.config.height);
    this.bgSpeedArray = [0.01, 0, 0.1, 0.2, 0.3, 0.5];
    this.bgList = [
      "firstBg",
      "secondBg",
      "thirdBg",
      "fourthBg",
      "fifthBg",
      "sixthBg",
      "seventh",
    ];
    this.bgArray = [];
    this.createParalaxBg();
    const sp = this.add
      .sprite(this.width / 2, this.height / 2, "angryFace")
      .setVisible(false);
    this.cameras.main.startFollow(sp);
    this.menuCont = this.add.container(
      this.cameras.main.worldView.x + this.cameras.main.width / 2,
      this.cameras.main.worldView.y + this.cameras.main.height / 2
    );
    this.highScore = this.add
      .text(0, -60, this.distance.toString())
      .setScale(3)
      .setOrigin(0.5, 0.5);
    this.restartBtn = this.add
      .sprite(0, 0, "buttons", 2)
      .setScale(2)
      .setInteractive();
    this.menuBtn = this.add
      .sprite(0, 80, "buttons", 3)
      .setScale(2)
      .setInteractive();

    this.menuCont.add([this.restartBtn, this.menuBtn, this.highScore]);
    this.clickButtons();
    if (this.distance > this.lastScore) {
      setHighscrore(this.distance);
    }
  }

  update(time: number, delta: number): void {
    this.bgArray.forEach((bg, index) => {
      this.bgArray[index].tilePositionX += this.bgSpeedArray[index];
    });
  }
  createParalaxBg() {
    for (var i = 0; i < this.bgList.length - 1; i++) {
      const bg = this.add
        .tileSprite(0, 0, this.width, this.height, this.bgList[i])
        .setScrollFactor(0)
        .setOrigin(0, 0);

      this.bgArray.push(bg);
    }
  }
  clickButtons() {
    this.restartBtn.on("pointerdown", () => {
      this.scene.start("Game");
    });
    this.menuBtn.on("pointerdown", () => {
      this.scene.start("Menu");
    });
  }
}
