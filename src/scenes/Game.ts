import { Scene } from "phaser";
import { Player } from "./classes/player";
import { getPlayerScore } from "./helperFunctions/walletManager";
import { Icons } from "./classes/icon";

export class Game extends Scene {
  player: Player;
  bull: Phaser.Physics.Matter.Sprite;
  bullet: Phaser.GameObjects.Rectangle[];
  isOnFloor: boolean;
  isOnWall: boolean;
  width: number;
  height: number;
  firstBg: Phaser.GameObjects.TileSprite;
  bgList: string[];
  bgArray: Phaser.GameObjects.TileSprite[];
  bgSpeedArray: number[];

  camSpeed: number;
  camFollow: Phaser.Physics.Matter.Sprite;
  enemies: Phaser.Physics.Matter.Sprite[];
  lastEnemySpwnTime: number;
  delay: number;
  spawnEnemy: boolean;
  electric_bar_spawn: boolean;
  times: number;
  shootBtn: Phaser.Input.Keyboard.Key | undefined;
  droneSpawnDelay: number;
  electricSpawnDelay: number;
  lastElectricSpwnTime: number;
  numberOfElectric: number;
  addElectric: boolean;
  floorSpawnX: number;
  floorArry: Phaser.Physics.Matter.Sprite[];
  obstacleArray: { name: string; weight: number; isSensor: boolean }[];
  area: { roofTop: boolean; ground: boolean; surfing: boolean };
  objects: Phaser.GameObjects.Sprite[];
  objectArry: string[];
  obsSpawnChance: number;
  lastChangeArea: number;
  diastanceToChangeArea: number;
  theme:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  icons: { name: string; weight: number; isSensor: boolean }[];
  iconsArray: Icons[];
  droneAmt: number;
  electricAmt: number;
  diastanceToAddElectric: number;
  air_obstacles: { name: string; weight: number; isSensor: boolean }[];
  groundEnemies: { name: string; weight: number; isSensor: boolean }[];
  addGroundEnemies: boolean;
  enemyLastShoot: number;
  groundEnemySpawnProbs: number;
  lastScore: any;
  convLastScore: number;

  constructor() {
    super("Game");
  }

  async preload() {
    this.lastScore = await getPlayerScore();
    this.convLastScore = Math.floor(this.lastScore);
    console.log(this.convLastScore);
  }

  create() {
    this.width = Number(this.game.config.width);
    this.height = Number(this.game.config.height);
    this.scene.launch("Ui_Scene");
    this.theme = this.sound.add("gameSound");
    this.theme.play({ loop: true });
    this.lastEnemySpwnTime = 0;
    this.enemies = [];
    this.bgList = [
      "firstBg",
      "secondBg",
      "thirdBg",
      "fourthBg",
      "fifthBg",
      "sixthBg",
      "seventh",
    ];
    this.bgSpeedArray = [0.01, 0, 0.1, 0.2, 0.3, 0.5];
    this.bgArray = [];
    this.spawnEnemy = false;
    this.electric_bar_spawn = false;
    this.lastEnemySpwnTime = 0;
    this.lastElectricSpwnTime = 0;
    this.droneSpawnDelay = 2000;
    this.electricSpawnDelay = 3000;
    this.diastanceToAddElectric = 300;
    this.addElectric = false;
    this.numberOfElectric = 0;
    this.floorSpawnX = 500;
    this.floorArry = [];
    this.obsSpawnChance = 0.7;
    this.air_obstacles = [
      { name: "air_drone", weight: 70, isSensor: true },
      { name: "air_mystery_box", weight: 30, isSensor: true },
    ];

    this.objectArry = ["ladder", "airConditioner", "billBoard"];
    this.obstacleArray = [
      { name: "mystery_box", weight: 6, isSensor: true },
      { name: "bomb_box", weight: 44, isSensor: true },
      { name: "obstacle", weight: 50, isSensor: false },
    ];
    this.groundEnemies = [
      { name: "mec_robot", weight: 20, isSensor: true },
      { name: "ground_drone", weight: 20, isSensor: true },
    ];
    this.addGroundEnemies = false;
    this.area = {
      roofTop: true,
      ground: false,
      surfing: false,
    };
    this.objects = [];
    this.iconsArray = [];
    this.icons = [
      { name: "ammo", weight: 79, isSensor: true },
      { name: "healthPack", weight: 20, isSensor: true },
      { name: "gift_box", weight: 1, isSensor: true },
    ];
    this.lastChangeArea = 0;
    this.diastanceToChangeArea = 50;
    this.droneAmt = 1;
    this.electricAmt = 1;
    this.enemyLastShoot = 0;
    this.groundEnemySpawnProbs = 0.7;

    this.createParalaxBg();
    this.createMap();

    this.checkCollision();
    //console.log(floorArry);
    //this.matter.world.setBounds();
    this.player = new Player(this, 500, 100, "player");
    this.camFollow = this.matter.add
      .sprite(
        this.player.player.x + 100,
        this.player.player.y,
        "angryFace",
        0,
        { isSensor: true, ignoreGravity: true }
      )
      .setVisible(false);
    this.cameras.main
      .startFollow(this.camFollow)
      .setZoom(2)
      .setFollowOffset(-30, 0);

    this.input.on("pointerdown", (pointer: any) => {
      //console.log(pointer);

      if (pointer.button === 0) {
        if (
          this.player.isOnFloor &&
          this.player.jumpAmount > 0 &&
          !this.area.surfing
        ) {
          this.player.jump = true;
          this.player.player.setVelocityY(-10);
          this.player.player.play("jump");
          this.player.isOnFloor = false;
          this.player.jumpAmount--;
          this.sound.play("jumpSound");
          console.log(this.player.health);
        } else if (
          this.player.jumpAmount > 0 &&
          this.player.jumpAmount < 2 &&
          !this.area.surfing
        ) {
          this.player.jump = true;
          this.player.player.setVelocityY(-10);
          this.player.player.play("doublejump");
          this.player.isOnFloor = false;
          this.player.jumpAmount--;
        }
        if (this.area.surfing) {
          if (this.player.wasOnAir) {
            this.player.player.setVelocityY(-7);
          }
        }
      }
    });
    this.shootBtn = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  // Update loop ...............................................///

  update(time: number, delta: number): void {
    const d = Phaser.Math.Distance.Between(
      300,
      100,
      this.player.player.x,
      this.player.player.y
    );
    const distance = Math.floor(d / 60);
    if (
      this.player.health <= 0 ||
      this.player.player.x < this.cameras.main.worldView.x ||
      this.player.player.y >
        this.cameras.main.worldView.y + this.cameras.main.height / 2
    ) {
      this.player.isAlive = false;
      this.player.destroyPlayer();
      this.theme.stop();
      this.scene.start("GameOver", { distance, lastScore: this.convLastScore });
    }
    if (this.player.isAlive) {
      // spawn flying emies .......................//
      if (distance > this.lastChangeArea + this.diastanceToChangeArea) {
        this.changeArea();
        console.log(this.area);
        this.lastChangeArea = distance;
      }
      if (distance > this.lastElectricSpwnTime + this.diastanceToAddElectric) {
        if (this.electricAmt < 3) {
          this.electricAmt++;
        }
        this.lastElectricSpwnTime = distance;
      }
      if (distance > 100) {
        this.addElectric = true;
      }

      if (distance > 100) {
        this.addGroundEnemies = true;
      }
      if (
        this.area.surfing &&
        this.player.wasOnAir &&
        time > this.lastEnemySpwnTime + this.droneSpawnDelay
      ) {
        this.addEnemy(time);
        this.lastEnemySpwnTime = time;
        if (this.droneSpawnDelay > 1000) {
          this.droneSpawnDelay - +50;
        } else {
          this.droneSpawnDelay = 1000;
        }
        //console.log(time, this.lastEnemySpwnTime);
      }
      if (
        this.addElectric &&
        this.area.surfing &&
        this.player.wasOnAir &&
        time > this.lastElectricSpwnTime + this.electricSpawnDelay
      ) {
        this.addElectricBar(time);
        this.lastElectricSpwnTime = time;
        this.electricSpawnDelay--;
        //console.log(time, this.lastEnemySpwnTime);
      }
      this.iconsArray.forEach((icon) => {
        if (icon) {
          icon.moveIcon(delta);
        }
      });
      if (this.area.surfing) {
        this.player.particle.frequency = 50;
        const zoom = Phaser.Math.Linear(this.cameras.main.zoom, 1.5, 0.3);
        this.cameras.main.setZoom(zoom);
      } else {
        this.player.particle.frequency = 500;
        const zoom = Phaser.Math.Linear(this.cameras.main.zoom, 2, 0.3);
        this.cameras.main.setZoom(zoom);
      }
      // setting up the camera follow object ..............//
      this.camFollow.setVelocityX(this.player.speed);

      this.bgArray.forEach((bg, index) => {
        this.bgArray[index].tilePositionX =
          this.cameras.main.scrollX * this.bgSpeedArray[index];
      });
      // shooting enemy .........................................//
      if (this.shootBtn?.isDown) {
        this.player.spawnBullet(this, time);
      }
      // moving bullets ...........................................//

      this.player.bulletArray.forEach((bullet) => {
        if (bullet) {
          bullet.setVelocityX(15);
          // if (bullet.x > this.cameras.main.scrollX) {
          //   bullet.destroy();
          //   const index = this.player.bulletArray.findIndex((b) => b === bullet);
          //   delete this.player.bulletArray[index];
          // }
        }
      });
      const velocity: any = this.player.player.body?.velocity;
      this.player.player.setVelocityX(this.player.speed);
      if (this.player.isOnFloor) {
        this.player.jumpAmount = 2;
        this.player.jump = false;
        this.player.falling = false;
      }
      if (this.player.isOnFloor && !this.player.jump && !this.area.surfing) {
        const animation = this.player.player.anims.currentAnim?.key;
        if (animation === "falling") {
          this.player.roll = true;
        }
        if (this.player.roll) {
          this.player.player.play("roll", true);
          this.player.player.on(
            "animationcomplete",
            (anim: { key: string }, frame: any) => {
              if (anim.key === "roll") {
                this.player.roll = false;
                this.player.player.play("run", true);
              }
            }
          );
        } else {
          this.player.player.play("run", true);
        }
      }
      if (velocity.y > 8 && !this.area.surfing) {
        this.player.player.play("falling", true);
      }
      // //this.addFloor();
      this.floorArry.forEach((floor) => {
        if (floor.x + floor.width / 2 < this.cameras.main.scrollX) {
          this.addPlatform();
          floor.destroy();
          const index = this.floorArry.findIndex((f) => f === floor);
          delete this.floorArry[index];
        }
      });
      // // delejting objects //
      this.objects.forEach((obj) => {
        if (obj) {
          if (obj.x < this.cameras.main.worldView.x) {
            obj.destroy();
            const index = this.objects.findIndex((o) => o === obj);
            delete this.objects[index];
          }
          if (obj.getData("label") === "mec_robot") {
            const objDistance = Phaser.Math.Distance.Between(
              obj.x,
              obj.y,
              this.player.player.x,
              this.player.player.y
            );
            if (objDistance < 200) {
              this.shoot(time, obj.x, obj.y);
            }
          }
          if (obj.getData("label") === "ground_drone") {
            const objDistance = Phaser.Math.Distance.Between(
              obj.x,
              obj.y,
              this.player.player.x,
              this.player.player.y
            );
            if (objDistance < 200) {
              const x = obj.x - 4;
              obj.setPosition(x, obj.y);
            }
          }
        }
      });

      if (this.player.speed >= 6) {
        return;
      } else {
        this.player.speed += 0.001;
      }

      //
    }
  }
  checkCollision() {
    this.matter.world.on(
      "collisionstart",
      (event: any, bodyA: any, bodyB: any) => {
        //console.log(bodyA.label, bodyB.label);
        if (
          event.pairs[0].collision.normal.y > 0 ||
          event.pairs[0].collision.normal.y <= -0
        ) {
          this.player.isOnFloor = true;
          // console.log(this.player.isOnFloor);
        }
        if (
          (bodyA.label === "player" && bodyB.label === "bomb_box") ||
          (bodyA.label === "player" && bodyB.label === "air_drone") ||
          (bodyA.label === "player" && bodyB.label === "electric_bar") ||
          (bodyA.label === "player" && bodyB.label === "enemyBullet")
        ) {
          this.player.health--;
          this.scene
            .get("Ui_Scene")
            .events.emit("updateHealth", this.player.health);
          this.cameras.main.shake(100, 0.01);
        }
        if (bodyA.label === "player" && bodyB.label === "ground_drone") {
          this.player.speed = 4;
          this.cameras.main.shake(100, 0.005);
        }
        if (
          (bodyA.label === "player" && bodyB.label === "mystery_box") ||
          (bodyA.label === "player" && bodyB.label === "air_mystery_box")
        ) {
          console.log(bodyB.label);
          const graphics = this.add.graphics();
          graphics.fillStyle(0xffffff, 1);
          graphics.fillRect(0, 0, 20, 20);
          graphics.generateTexture("dust", 10, 10);
          graphics.destroy();

          const particle = this.add.particles(
            bodyB.position.x,
            bodyB.position.y,
            "dust",
            {
              frequency: 10,
              duration: 1000,
              lifespan: 1000,
              scale: { min: 0.2, max: 1 },
              alpha: { start: 1, end: 0 },
              speed: { min: -100, max: 100 },
              blendMode: "ADD",
            }
          );

          const random = this.weightedRandom(this.icons);
          this.objects.forEach((obj) => {
            if (obj.x === bodyB.position.x) {
              const icon = new Icons(
                this,
                obj.x,
                obj.y,
                random,
                this.player.speed
              );
              this.iconsArray.push(icon);
              obj.destroy();
              const index = this.objects.indexOf(obj);
              delete this.objects[index];
            }
          });
        }
        if (bodyA.label === "player" && bodyB.label === "ammo") {
          this.player.bullet = 5;
          this.iconsArray.forEach((icon) => {
            if ((icon.icon.x = bodyB.position.x)) {
              icon.icon.destroy();
              const index = this.iconsArray.indexOf(icon);
              delete this.iconsArray[index];
            }
          });
        }
        if (bodyA.label === "player" && bodyB.label === "healthPack") {
          if (this.player.health < 3) {
            this.player.health++;
            this.scene
              .get("Ui_Scene")
              .events.emit("updateHealth", this.player.health);
            this.iconsArray.forEach((icon) => {
              if ((icon.icon.x = bodyB.position.x)) {
                icon.icon.destroy();
                const index = this.iconsArray.indexOf(icon);
                delete this.iconsArray[index];
              }
            });
          }
        }
        if (bodyA.label === "air_drone" && bodyB.label === "bullet") {
          this.objects.forEach((enemy) => {
            if ((enemy.x = bodyB.position.x)) {
              enemy.destroy();
              const index = this.objects.indexOf(enemy);
              delete this.objects[index];
            }
          });
        }
      }
    );
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
  addEnemy(time: number) {
    for (var i = 0; i < this.droneAmt; i++) {
      const y = Phaser.Math.Between(
        this.player.player.y,
        this.player.player.y - 50
      );
      const random = this.weightedRandom(this.air_obstacles);
      const enemy = this.matter.add
        .sprite(this.player.player.x + 400, y, random?.name, 0, {
          isSensor: random?.isSensor,
          ignoreGravity: true,
          label: random?.name,
          shape: { type: "rectangle", width: 28, height: 28 },
        })
        .setScale(1.3);
      this.objects.push(enemy);
    }
  }
  addElectricBar(time: number) {
    for (var i = 0; i < this.electricAmt; i++) {
      const y = Phaser.Math.Between(
        this.cameras.main.worldView.y,
        this.cameras.main.worldView.y + this.cameras.main.height / 2
      );
      const rotation = Math.random() * Math.PI;

      const electricBar = this.matter.add.sprite(
        this.player.player.x + 400,
        y,
        "electric_bar",
        0,
        { isStatic: true, isSensor: true, label: "electric_bar" }
      );
      electricBar.rotation = rotation;
      electricBar.play("shock");
      this.objects.push(electricBar);
    }
  }
  createMap() {
    for (var i = 0; i < 2; i++) {
      const y = Phaser.Math.Between(600, 700);
      const space = Phaser.Math.Between(50, 80);
      const floor = this.matter.add
        .sprite(this.floorSpawnX, y, "roofTop1", 0, {
          isStatic: true,
        })
        .setOrigin(0.5, 0.52)
        .setDepth(5);
      this.floorSpawnX += floor.width + space;
      this.floorArry.push(floor);
    }
  }
  addPlatform() {
    let y: any;
    var space: number | any;
    if (this.area.roofTop) {
      y = Phaser.Math.Between(600, 700);
      space = Phaser.Math.Between(0, 180);
    } else if (this.area.ground) {
      y = 300;
      space = 0;
    }
    if (!this.area.surfing) {
      const roofTops = ["roofTop1", "roofTop2"];
      const roofIndex = Math.floor(Math.random() * roofTops.length);
      const floor = this.matter.add
        .sprite(this.floorSpawnX, y, roofTops[roofIndex], 0, {
          isStatic: true,
        })
        .setOrigin(0.5, 0.52)
        .setDepth(5);

      this.floorArry.push(floor);

      const obsX = Phaser.Math.Between(
        floor.x - floor.displayWidth / 4,
        floor.x + floor.displayWidth / 4
      );
      const colobsX = Phaser.Math.Between(
        floor.x,
        floor.x + floor.displayWidth / 4
      );
      const spriteIndex = Math.floor(Math.random() * this.objectArry.length);
      const obsprob = Math.random();
      const obsSpawnProb = Math.random();
      var obsSpriteIndex;
      if (obsprob < 0.6) {
        obsSpriteIndex = 2;
      } else if (obsprob < 0.8) {
        obsSpriteIndex = 1;
      } else {
        obsSpriteIndex = 0;
      }
      const noncollidables = this.add.sprite(
        obsX,
        floor.y - floor.displayHeight / 2 - 20,
        this.objectArry[spriteIndex]
      );

      if (this.area.roofTop && obsSpawnProb > this.obsSpawnChance) {
        const random = this.weightedRandom(this.obstacleArray);
        const enemyrandom = this.weightedRandom(this.groundEnemies);
        const groundEnemyProb = Math.random();
        const collidables = this.matter.add
          .sprite(
            colobsX,
            floor.y - floor.displayHeight / 2 - 10,
            random?.name,
            0,
            {
              isSensor: random?.isSensor,
              isStatic: true,
              label: random?.name,
            }
          )
          .setDepth(8)
          .setScale(1.3)
          .setOrigin(0.6, 0.5);
        if (
          this.addGroundEnemies &&
          groundEnemyProb > this.groundEnemySpawnProbs
        ) {
          const grondEnemy = this.matter.add.sprite(
            colobsX - 150,
            floor.y - floor.displayHeight / 2 - 30,
            enemyrandom?.name,
            0,
            {
              isSensor: enemyrandom?.isSensor,
              isStatic: true,
              label: enemyrandom?.name,
            }
          );
          grondEnemy.setData("label", enemyrandom?.name);
          this.objects.push(grondEnemy);
        }

        this.objects.push(collidables);
        if (this.groundEnemySpawnProbs < 0.4) {
          this.groundEnemySpawnProbs -= 0.003;
        }
      }
      // collidables.setBody({ width: collidables.width / 2 - 20 });

      this.objects.push(noncollidables);

      this.floorSpawnX += floor.displayWidth + space;
      if (this.obsSpawnChance > 0.15) {
        this.obsSpawnChance -= 0.1;
      }
    }
  }
  changeArea() {
    const formerArea = this.area;
    const rand = Math.floor(Math.random() * 2);
    if (this.area.roofTop) {
      if (rand === 0) {
        this.area.roofTop = true;
      } else {
        this.area.roofTop = false;
      }
    } else if (this.area.surfing) {
      if (rand === 1) {
        this.area.surfing = true;
      } else {
        this.area.surfing = false;
      }
    }
    if (rand === 0) {
      if (formerArea.roofTop) {
        return;
      } else {
        this.area.roofTop = true;
        this.floorSpawnX = this.player.player.x;
        for (var i = 0; i < 3; i++) {
          var y = 700;
          const floor = this.matter.add
            .sprite(this.floorSpawnX, y, "roofTop1", 0, {
              isStatic: true,
            })
            .setOrigin(0.5, 0.52)
            .setDepth(5);

          this.floorArry.push(floor);
          this.floorSpawnX += floor.displayWidth;
        }
        this.player.wasOnAir = false;
      }
    } else if (rand === 1) {
      this.area.surfing = true;
    } else {
      this.area.ground = true;
    }
    // console.log(this.area);

    if (this.area.surfing) {
      this.add.rectangle(
        this.player.player.x + 200,
        this.player.player.y,
        32,
        64,
        0xfff000
      );

      if (!this.player.wasOnAir) {
        this.matter.world.setGravity(0, 1);
        this.player.player.setVelocityY(-15);
        this.player.player.play("doublejump");
        this.player.player.on(
          "animationupdate",
          (anim: { key: string }, frame: any) => {
            if (anim.key === "doublejump") {
              if (frame.index === 3) {
                this.player.player.play("surf");
              }
            }
          }
        );
        setTimeout(() => {
          this.player.wasOnAir = true;
        }, 1000);
      } else {
        this.player.player.play("surf");
        this.player.wasOnAir = true;
      }
    } else {
      this.matter.world.setGravity(0, 2);
      this.player.gravity = false;
      this.player.wasOnAir = false;
    }
  }
  weightedRandom(items: any[]) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (let item of items) {
      if (random < item.weight)
        return { name: item.name, isSensor: item.isSensor };
      random -= item.weight;
    }
  }
  shoot(time: number, x: number, y: number) {
    const delay = 1000;
    if (time > this.enemyLastShoot + delay) {
      const bullet = this.matter.add
        .sprite(x, y, "angryFace", 0, {
          ignoreGravity: true,
          isSensor: true,
          label: "enemyBullet",
        })
        .setScale(0.3);
      bullet.setData("label", "enemyBullet");
      this.objects.push(bullet);
      this.enemyLastShoot = time;
    }
    this.objects.forEach((obj) => {
      if (obj.getData("label") === "enemyBullet") {
        const x = obj.x - 6;
        obj.setPosition(x, obj.y);
      }
    });
  }
}
