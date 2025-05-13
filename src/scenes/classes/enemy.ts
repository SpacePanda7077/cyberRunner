import { Player } from "./player";
export const enemyArray: MatterJS.BodyType[] = [];
export class Enemy {
  enemy: MatterJS.BodyType;
  constructor(scene: Phaser.Scene, player: Player) {
    this.enemy = scene.matter.add.rectangle(
      player.player.x + 500,
      player.player.y,
      32,
      32,
      { isSensor: true, ignoreGravity: true }
    );
    enemyArray.push(this.enemy);
  }
  moveEnemy(scene: Phaser.Scene, player: Player) {
    const d = Phaser.Math.Distance.Between(
      this.enemy.position.x,
      this.enemy.position.y,
      player.player.x,
      player.player.y
    );
    if (d < 150) {
      scene.matter.body.setPosition(this.enemy, {
        x: player.player.x + 150,
        y: player.player.y,
      });
    }
  }
}
