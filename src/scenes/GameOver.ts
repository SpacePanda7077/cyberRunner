import { Scene } from "phaser";
import { setHighscrore } from "./helperFunctions/walletManager";

/**
 * GameOver Scene - Handles the game over state and high score submission
 * Displays final score and provides options to restart or return to menu
 */
export class GameOver extends Scene {
  // Scene properties
  bgList: string[];                    // List of background layer images
  width: number;                       // Scene width
  height: number;                      // Scene height
  bgArray: Phaser.GameObjects.TileSprite[]; // Background layers
  bgSpeedArray: number[];             // Speed for each background layer
  menuCont: Phaser.GameObjects.Container;   // Menu container
  deathCont: Phaser.GameObjects.Container;  // Death screen container
  playBtn: Phaser.GameObjects.Text;         // Play again button
  gameOverBtn: Phaser.GameObjects.Text;     // Game over text
  restartBtn: Phaser.GameObjects.Sprite;    // Restart button
  menuBtn: Phaser.GameObjects.Sprite;       // Return to menu button
  distance: number;                         // Final score/distance
  highScore: Phaser.GameObjects.Text;       // High score display
  lastScore: any;                          // Previous high score

  constructor() {
    super("GameOver");
  }

  /**
   * Initialize scene with final score data
   */
  init(data: any) {
    this.distance = data.distance;
    this.lastScore = data.lastScore;
  }

  preload() {}

  /**
   * Create game over screen elements
   */
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
    this.highscoreText = this.add.text(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.cameras.main.worldView.y + this.cameras.main.height / 2, "New highScore, comfirm TX to save").setScale(2).setOrigin(0.5, 0.5).setVisible(false).setActive(false)
    this.menuCont.add([this.restartBtn, this.menuBtn, this.highScore]);
    this.clickButtons();
    if (this.distance > this.lastScore)
    {
      this.highscoreText.setVisible(true).setActive(true)
      this.menuCont.setVisible(false).setActive(false);
      this.setHighscrore(this.distance);
    }
  }

  /**
   * Update loop for background animations
   */
  update(time: number, delta: number): void {
    this.bgArray.forEach((bg, index) => {
      this.bgArray[index].tilePositionX += this.bgSpeedArray[index];
    });
  }

  /**
   * Creates parallax background effect
   */
  createParalaxBg() {
    for (var i = 0; i < this.bgList.length - 1; i++) {
      const bg = this.add
        .tileSprite(0, 0, this.width, this.height, this.bgList[i])
        .setScrollFactor(0)
        .setOrigin(0, 0);

      this.bgArray.push(bg);
    }
  }

  /**
   * Sets up button click handlers
   */
  clickButtons() {
    this.restartBtn.on("pointerdown", () => {
      this.scene.start("Game");
    });
    this.menuBtn.on("pointerdown", () => {
      this.scene.start("Menu");
    });
  }

  /**
   * Submits new high score to blockchain
   */
  async setHighScore(highScore: number){
    await setHighscrore(highScore).then((res) => {
      console.log(res);
      if(this.menuCont.active === false){
        this.menuCont.setVisible(true).setActive(true);
        this.highscoreText.setVisible(false).setActive(false)
      }
    })
  }
}