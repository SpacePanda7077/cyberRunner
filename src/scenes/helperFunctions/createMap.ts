import { Player } from "../classes/player";

var obsSpawnChance = 0.7;
export const area: { roofTop: boolean; ground: boolean; surfing: boolean } = {
  roofTop: true,
  ground: false,
  surfing: false,
};

const objectArry = ["ladder", "airConditioner", "billBoard"];
const obstacleArray = [
  { name: "mystery_box", probs: 0.05, isSensor: true },
  { name: "bomb_box", probs: 0.5, isSensor: true },
  { name: "obstacle", probs: 0.4, isSensor: false },
];
export const objects: Phaser.GameObjects.Sprite[] = [];

export function CreateMap(
  scene: Phaser.Scene,
  x: number,
  floorArry: Phaser.Physics.Matter.Sprite[]
) {
  for (var i = 0; i < 2; i++) {
    const y = Phaser.Math.Between(600, 700);
    const space = Phaser.Math.Between(50, 80);
    const floor = scene.matter.add
      .sprite(x, y, "roofTop2", 0, {
        isStatic: true,
      })
      .setOrigin(0.5, 0.52)
      .setDepth(5);
    x += floor.width + space;
    floorArry.push(floor);
    console.log(x);
  }
}
export function addPlatform(
  scene: Phaser.Scene,
  player: Phaser.Physics.Matter.Sprite,
  x: number,
  floorArry: Phaser.Physics.Matter.Sprite[]
) {
  console.log(x);
  let y: any;
  var space: number | any;

  if (area.roofTop) {
    y = Phaser.Math.Between(600, 700);
    space = Phaser.Math.Between(0, 180);
  } else if (area.ground) {
    y = 300;
    space = 0;
  }
  if (!area.surfing) {
    const roofTops = ["roofTop1", "roofTop2"];
    const roofIndex = Math.floor(Math.random() * roofTops.length);
    const floor = scene.matter.add
      .sprite(x, y, roofTops[roofIndex], 0, {
        isStatic: true,
      })
      .setOrigin(0.5, 0.52)
      .setDepth(5);

    floorArry.push(floor);

    const obsX = Phaser.Math.Between(
      floor.x - floor.displayWidth / 4,
      floor.x + floor.displayWidth / 4
    );
    const colobsX = Phaser.Math.Between(
      floor.x,
      floor.x + floor.displayWidth / 4
    );
    const spriteIndex = Math.floor(Math.random() * objectArry.length);
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
    const noncollidables = scene.add.sprite(
      obsX,
      floor.y - floor.displayHeight / 2 - 20,
      objectArry[spriteIndex]
    );

    if (area.roofTop && obsSpawnProb > obsSpawnChance) {
      const collidables = scene.matter.add
        .sprite(
          colobsX,
          floor.y - floor.displayHeight / 2 - 10,
          obstacleArray[obsSpriteIndex].name,
          0,
          {
            isSensor: obstacleArray[obsSpriteIndex].isSensor,
            isStatic: true,
            label: obstacleArray[obsSpriteIndex].name,
          }
        )
        .setDepth(8)
        .setOrigin(0.6, 0.5);

      objects.push(collidables);
    }
    // collidables.setBody({ width: collidables.width / 2 - 20 });

    objects.push(noncollidables);

    x += floor.displayWidth + space;
    if (obsSpawnChance > 0.15) {
      obsSpawnChance -= 0.05;
    }
  }
}

export function changeArea(
  scene: Phaser.Scene,
  player: Player,
  camFollow: Phaser.Physics.Matter.Sprite,
  x: number,
  floorArry: Phaser.Physics.Matter.Sprite[]
) {
  const formerArea = area;
  const rand = Math.floor(Math.random() * 2);
  if (area.roofTop) {
    if (rand === 0) {
      area.roofTop = true;
    } else {
      area.roofTop = false;
    }
  } else if (area.ground) {
    if (rand === 1) {
      area.surfing = true;
    } else {
      area.surfing = false;
    }
  } else {
    area.surfing = false;
  }

  if (rand === 0) {
    if (formerArea.roofTop) {
      return;
    } else {
      area.roofTop = true;
      x = player.player.x - 200;
      for (var i = 0; i < 3; i++) {
        var y = 400;
        const floor = scene.matter.add
          .sprite(x, y, "roofTop", 0, {
            isStatic: true,
          })
          .setOrigin(0.5, 0.93)
          .setDepth(5);

        floorArry.push(floor);
        var space = Phaser.Math.Between(0, 180);
        x += floor.displayWidth;
      }
      player.wasOnAir = false;
    }
  } else if (rand === 1) {
    area.surfing = true;
  } else {
    area.ground = true;
  }
  // console.log(area);

  if (area.surfing) {
    scene.add.rectangle(
      player.player.x + 200,
      player.player.y,
      32,
      64,
      0xfff000
    );

    if (!player.wasOnAir) {
      scene.matter.world.setGravity(0, 1);
      player.player.setVelocityY(-15);
      player.player.play("doublejump");
      player.player.on(
        "animationcomplete",
        (anim: { key: string }, frame: any) => {
          if (anim.key === "doublejump") {
            player.player.play("surf");
          }
        }
      );
      setTimeout(() => {
        player.wasOnAir = true;
      }, 1000);
    } else {
      player.player.play("surf");
    }
  } else {
    scene.matter.world.setGravity(0, 2);
    player.gravity = false;
    player.wasOnAir = false;
  }
}
