import { Tilemaps } from "phaser";

export class Ui extends Phaser.Scene {
  distance: Phaser.GameObjects.Text;
  d: number;
  x: number;
  y: number;
  addableDist: number;
  lastAddDist: number;
  distanceAdd: number;
  health: Phaser.GameObjects.Text;
  addEnemyTime: number;
  lastAddEnemy: number;
  gameScene: any;
  player: any;
  startPoint: { x: any; y: any };
  numberOfElectric: number;
  lastIncreaseElectric: number;
  distanceToIncreaseElectric: number;
  playBtn: Phaser.GameObjects.Text;
  menuCont: Phaser.GameObjects.Container;
  deathCont: Phaser.GameObjects.Container;
  restartBtn: Phaser.GameObjects.Text;
  leaderBoardBtn: Phaser.GameObjects.Text;
  constructor() {
    super("Ui_Scene");
  }
  create() {
    this.distance = this.add.text(100, 100, "0").setScale(3);
    this.gameScene = this.scene.get("Game");
    this.x = 300;
    this.y = 100;
    this.numberOfElectric = 0;
    var health = 3;
    this.health = this.add.text(620, 100, "3").setScale(3);
    this.player = this.gameScene.player;
    this.startPoint = { x: this.player.player.x, y: this.player.player.y };

    this.events.on("updateHealth", (data: number) => {
      this.health.setText(data.toString());
    });
  }
  update(time: number, delta: number): void {
    if (this.gameScene.player.isAlive) {
      const d = Phaser.Math.Distance.Between(
        this.startPoint.x,
        this.startPoint.y,
        this.player.player.x,
        this.player.player.y
      );
      this.distance.setText(Math.floor(d / 60).toString());
    }
  }
}
