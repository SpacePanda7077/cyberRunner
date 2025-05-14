
import { Scene } from "phaser";
import {  walletAddress, connectWallet} from "./helperFunctions/walletManager";

/**
 * Boot Scene - First scene loaded in the game
 * Handles initial asset loading and setup
 */
export class Boot extends Scene {
  nfts: any;
  constructor() {
    super("Boot");
  }

  /**
   * Preload method - Loads all initial game assets
   * Including images, spritesheets, and audio files
   */
  preload() {
    // Load NFT and background images
    this.load.image(
      "yellow_guy_nft",
      "https://plum-total-louse-876.mypinata.cloud/ipfs/bafkreifz5oph2lvdynxulhemdtwmtoccu3zjse5ayd22375ijkabwdt7mm"
    );
    this.load.image("background", "assets/bg.png");
    
    // Load game objects and UI elements
    this.load.image("angryFace", "assets/angryFace.png");
    this.load.image("roofTop1", "assets/roofs/roofTop1.png");
    this.load.image("roofTop2", "assets/roofs/roofTop2.png");
    
    // Load parallax background layers
    this.load.image("firstBg", "assets/noon/0.png");
    this.load.image("secondBg", "assets/noon/1.png");
    this.load.image("thirdBg", "assets/noon/2.png");
    this.load.image("fourthBg", "assets/noon/3.png");
    this.load.image("fifthBg", "assets/noon/4.png");
    this.load.image("sixthBg", "assets/noon/5.png");
    this.load.image("seventhBg", "assets/noon/6.png");
    
    // Load environmental objects
    this.load.image("billBoard", "assets/objects/billBoard.png");
    this.load.image("ladder", "assets/objects/ladder.png");
    this.load.image("stillBar", "assets/objects/stillBar.png");
    this.load.image("airConditioner", "assets/objects/air-conditioner.png");
    
    // Load collectables and power-ups
    this.load.image("mystery_box", "assets/collectables/mystery_box.png");
    this.load.image("ammo", "assets/icons/ammo.png");
    this.load.image("healthPack", "assets/icons/healthPack.png");
    this.load.image("gift_box", "assets/icons/gift_box.png");
    
    // Load sprite sheets for animated objects
    this.load.spritesheet(
      "air_mystery_box",
      "assets/collectables/air_mystery_box.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet("air_drone", "assets/obstacles/air_drone.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    
    // Load obstacles and enemies
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
    
    // Load UI elements
    this.load.spritesheet("buttons", "assets/ui/buttons.png", {
      frameWidth: 128,
      frameHeight: 48,
    });
    this.load.image("arrowBtn", "assets/ui/arrowBtn.png");
    this.load.image("ground_drone", "assets/obstacles/ground_drone.png");
    
    // Load map and player assets
    this.load.tilemapTiledJSON("forest", "/assets/forest.json");
    this.load.spritesheet(
      "player",
      "assets/players/yellow_shirt_guy/yellow_shirt_guy.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
    
    // Load audio assets
    this.load.audio("gameSound", "assets/sounds/gameSound.mp3");
    this.load.audio("jumpSound", "assets/sounds/jumpSound.wav");
  }

  /**
   * Create method - Sets up game animations and initial UI
   * Called after preload completes
   */
  create() {
    // Create electric shock animation
    this.anims.create({
      key: "shock",
      frames: this.anims.generateFrameNumbers("electric_bar", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Create player animations
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

    // Add instruction text
    this.add.text(
      this.cameras.main.width / 2,
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

    // Add wallet connection button
    this.add
    .text(
      this.cameras.main.worldView.x + this.cameras.main.width / 2,
      this.cameras.main.worldView.y + this.cameras.main.height / 2 + 240,
      " CONNECT WALLET "
    )
    .setScale(2)
    .setOrigin(0.5, 0.5)
    .setInteractive()
    .on("pointerdown", () => {
      this.connectWallet();
    });
    
    this.connectWallet();
  }

  /**
   * Creates animations for game sprites
   * @param scene - Current game scene
   * @param texture - Texture key for the sprite
   * @param animationArray - Array of animation configurations
   */
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

  /**
   * Handles wallet connection and game state transition
   * Connects wallet and starts menu scene after delay
   */
  async connectWallet() {
    if(walletAddress === undefined) {
      await connectWallet().then((wallet:any) => {
        console.log(wallet);
        setTimeout(() => {
          this.scene.start("Menu");
        }, 2000);
      });
    } else {
      setTimeout(() => {
        this.scene.start("Menu");
      }, 2000);
    }
  }
}
