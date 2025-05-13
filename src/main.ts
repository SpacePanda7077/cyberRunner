import { Game as MainGame } from "./scenes/Game";
import { Boot as BootGame } from "./scenes/Boot";
import { Ui as UiScene } from "./scenes/Ui";
import { GameOver } from "./scenes/GameOver";
import { MenuScene } from "./scenes/Meun";
import { AUTO, Game, Scale, Types } from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 720,
  height: 1080,
  parent: "game-container",
  backgroundColor: "#028af8",
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  scene: [BootGame, MenuScene, MainGame, UiScene, GameOver],

  physics: {
    default: "matter",
    matter: {
      gravity: { x: 0, y: 2 },
      debug: false,
    },
  },
  pixelArt: true,
};

export default new Game(config);
