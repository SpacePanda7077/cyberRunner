import { Scene } from "phaser";
import { getPlayerNfts } from "./helperFunctions/walletManager";

export class Boot extends Scene {
  nfts: any;
  constructor() {
    super("Boot");
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
    this.load.image(
      "yellow_guy_nft",
      "https://plum-total-louse-876.mypinata.cloud/ipfs/bafkreifz5oph2lvdynxulhemdtwmtoccu3zjse5ayd22375ijkabwdt7mm"
    );
    this.load.image("background", "assets/bg.png");
    this.load.image("angryFace", "assets/angryFace.png");
    this.load.image("roofTop1", "assets/roofs/roofTop1.png");
    this.load.image("roofTop2", "assets/roofs/roofTop2.png");
    this.load.image("firstBg", "assets/noon/0.png");
    this.load.image("secondBg", "assets/noon/1.png");
    this.load.image("thirdBg", "assets/noon/2.png");
    this.load.image("fourthBg", "assets/noon/3.png");
    this.load.image("fifthBg", "assets/noon/4.png");
    this.load.image("sixthBg", "assets/noon/5.png");
    this.load.image("seventhBg", "assets/noon/6.png");
    this.load.image("billBoard", "assets/objects/billBoard.png");
    this.load.image("ladder", "assets/objects/ladder.png");
    this.load.image("stillBar", "assets/objects/stillBar.png");
    this.load.image("airConditioner", "assets/objects/air-conditioner.png");
    this.load.image("mystery_box", "assets/collectables/mystery_box.png");
    this.load.image("ammo", "assets/icons/ammo.png");
    this.load.image("healthPack", "assets/icons/healthPack.png");
    this.load.image("gift_box", "assets/icons/gift_box.png");
    this.load.spritesheet(
      "air_mystery_box",
      "assets/collectables/air_mystery_box.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet("air_drone", "assets/obstacles/air_drone.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image("bomb_box", "assets/obstacles/bomb_box.png");
    this.load.image("obstacle", "assets/obstacles/roof_vent.png");
    this.load.spritesheet("electric_bar", "assets/obstacles/electric_bar.png", {
      frameWidth: 128,
      frameHeight: 32,
    });
    this.load.spritesheet("mec_robot", "assets/obstacles/mec_robot.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("buttons", "assets/ui/buttons.png", {
      frameWidth: 128,
      frameHeight: 48,
    });
    this.load.image("arrowBtn", "assets/ui/arrowBtn.png");
    this.load.image("ground_drone", "assets/obstacles/ground_drone.png");
    this.load.tilemapTiledJSON("forest", "/assets/forest.json");
    this.load.spritesheet(
      "player",
      "assets/players/yellow_shirt_guy/yellow_shirt_guy.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
    this.load.audio("gameSound", "assets/sounds/gameSound.mp3");
    this.load.audio("jumpSound", "assets/sounds/jumpSound.wav");

    this.add
      .text(
        this.cameras.main.worldView.x + this.cameras.main.width / 2,
        this.cameras.main.worldView.y + this.cameras.main.height / 2,
        "TAP ONCE TO JUMP"
      )
      .setScale(3)
      .setOrigin(0.5, 0.5);

    this.add
      .text(
        this.cameras.main.worldView.x + this.cameras.main.width / 2,
        this.cameras.main.worldView.y + this.cameras.main.height / 2 + 80,
        "TAP TWICE TO DOUBLE JUMP"
      )
      .setScale(3)
      .setOrigin(0.5, 0.5);
    this.add
      .text(
        this.cameras.main.worldView.x + this.cameras.main.width / 2,
        this.cameras.main.worldView.y + this.cameras.main.height / 2 + 160,
        "ONCE YOU SEE YELLOW RECTANGLE "
      )
      .setScale(2)
      .setOrigin(0.5, 0.5);
    this.add
      .text(
        this.cameras.main.worldView.x + this.cameras.main.width / 2,
        this.cameras.main.worldView.y + this.cameras.main.height / 2 + 190,
        " KEEP TAPPING YOU SCREEN TO GO UP "
      )
      .setScale(2)
      .setOrigin(0.5, 0.5);
  }

  create() {
    this.anims.create({
      key: "shock",
      frames: this.anims.generateFrameNumbers("electric_bar", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    const animations = [
      { key: "recover", start: 0, end: 5, repeat: 0 },
      { key: "run", start: 6, end: 14, repeat: -1 },
      { key: "jump", start: 15, end: 17, repeat: 0 },
      { key: "surf", start: 16, end: 16, repeat: 0 },
      { key: "doublejump", start: 19, end: 21, repeat: -1 },
      { key: "falling", start: 22, end: 22, repeat: -1 },
      { key: "roll", start: 23, end: 24, repeat: 0 },
    ];
    this.createAnimations(this, "player", animations);
    setTimeout(() => {
      this.scene.start("Menu");
    }, 4000);
  }

  createAnimations(
    scene: Phaser.Scene,
    texture: string,
    animationArray: {
      key: string;
      start: number;
      end: number;
      repeat: number;
    }[]
  ) {
    animationArray.forEach((anim) => {
      if (!scene.anims.exists(anim.key)) {
        scene.anims.create({
          key: anim.key,
          frames: scene.anims.generateFrameNumbers(texture, {
            start: anim.start,
            end: anim.end,
          }),
          frameRate: 10,
          repeat: anim.repeat,
        });
      }
    });
  }
}
