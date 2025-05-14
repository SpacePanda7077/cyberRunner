import { Scene } from "phaser";
import {
  walletAddress,
  Initialize_Wallet,
  connectWallet,
  createLeaderBoard,
  getPlayerNfts,
  myNFTs,
  Mint
} from "./helperFunctions/walletManager";

export class MenuScene extends Scene {
  bgList: string[];
  width: number;
  height: number;
  bgArray: Phaser.GameObjects.TileSprite[];
  bgSpeedArray: number[];
  menuCont: Phaser.GameObjects.Container;
  deathCont: Phaser.GameObjects.Container;
  playBtn: Phaser.GameObjects.Sprite;
  theme:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  connectBtn: Phaser.GameObjects.Text;
  leaderBoardBtn: Phaser.GameObjects.Sprite;
  lootsBtn: Phaser.GameObjects.Sprite;
  marketBtn: Phaser.GameObjects.Sprite;
  character: Phaser.GameObjects.Image;
  rightBtn: Phaser.GameObjects.Sprite;
  lefttBtn: Phaser.GameObjects.Sprite;
  walletkit: any;
  connectCont: Phaser.GameObjects.Container;
  marketCont: Phaser.GameObjects.Container;
  sortedLeaderBoard: any;
  leaderBoardCont: Phaser.GameObjects.Container;
  backBtn: Phaser.GameObjects.Text;
  containArray: { name: Phaser.GameObjects.Container; active: boolean }[];
  nfts: any;
  dontHaveNFT: boolean;
  mintYourFirstNFTBtn: Phaser.GameObjects.Text;
  hasNft: boolean;
  nftArray: any[]
  constructor() {
    super("Menu");
  }

  preload() {
    this.nftArray = []
    this.getPlayersNfts()
    this.initializeWallet()
    myNFTs.forEach((nft: any) => {
      this.load.image(nft.imageName, nft.image);
      this.load.image(nft.spriteName, nft.spriteImage);
    });
    
  }

  async create() {
    this.hasNft = false
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
    this.connectCont = this.add.container(
      this.cameras.main.worldView.x + this.cameras.main.width / 2,
      this.cameras.main.worldView.y + this.cameras.main.height / 2
    );
    
    this.leaderBoardCont = this.add.container(
      this.cameras.main.worldView.x + this.cameras.main.width / 2,
      this.cameras.main.worldView.y + this.cameras.main.height / 2
    );

    this.marketCont = this.add.container(
      this.cameras.main.worldView.x + this.cameras.main.width / 2,
      this.cameras.main.worldView.y + this.cameras.main.height / 2
    );
    //this.character = this.add.image(0, -180, "yellow_shirt_guy").setScale(3);

    // buttons .........................................//

    this.backBtn = this.add
      .text(0, 300, "Back")
      .setScale(3)
      .setOrigin(0.5, 0.5)
      .setInteractive();

    this.mintYourFirstNFTBtn = this.add
      .text(this.cameras.main.worldView.x + this.cameras.main.width / 2,this.cameras.main.worldView.y + this.cameras.main.height / 2, "click to mint your first nft")
      .setScale(2)
      .setOrigin(0.5, 0.5)
      .setInteractive()
    .setVisible(false).setActive(false)
    this.connectBtn = this.add
      .text(150, -500, "connect wallet")
      .setScale(2)
      .setOrigin(0.5, 0.5)
      .setInteractive();

    this.playBtn = this.add
      .sprite(0, 0, "buttons", 1)
      .setScale(2)
      .setInteractive();
    this.leaderBoardBtn = this.add
      .sprite(0, 80, "buttons", 0)
      .setScale(2)
      .setInteractive();
    this.marketBtn = this.add
      .sprite(0, 160, "buttons", 5)
      .setScale(2)
      .setInteractive();

    this.menuCont.add([this.playBtn, this.leaderBoardBtn, this.marketBtn]);
    this.connectCont.add([this.connectBtn]);
    this.leaderBoardCont.add([this.backBtn]);
    this.clickButtons();
    this.theme = this.sound.add("gameSound");
    this.theme.play();

    this.containArray = [
      { name: this.menuCont, active: true },
      { name: this.leaderBoardCont, active: false },
      { name: this.marketCont, active: false }
    ];
    // connectWallet(this.walletkit);
    this.sortedLeaderBoard = await createLeaderBoard();
    this.createLeaderBoard(this.sortedLeaderBoard);
  }

  update(time: number, delta: number): void {
    this.bgArray.forEach((bg, index) => {
      this.bgArray[index].tilePositionX += this.bgSpeedArray[index];
    });
    this.checkForNft()
    if (walletAddress === undefined) {
      this.menuCont.setActive(false).setVisible(false);
    } else {
      this.menuCont.setActive(true).setVisible(true);
      const wallet: any = walletAddress;
      const walladdr = `${wallet.slice(0, 5)}.... ${wallet.slice(-5)}`;
      this.connectBtn.setText(walladdr);
    }
    this.handleContainers();
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
    this.playBtn.on("pointerdown", () => {
      this.theme.stop();
      this.scene.start("Game");
    });
    this.connectBtn.on("pointerdown", async () => {
      if (walletAddress === undefined) {
        const wallet: any = await connectWallet();
        console.log(wallet);
        const walladdr = this.shortedAddresses(wallet);
        this.connectBtn.setText(walladdr);
      }
      console.log("connecting");
    });

    this.leaderBoardBtn.on("pointerdown", () => {
      //this.createLeaderBoard(this.sortedLeaderBoard);
      this.changeContainer(this.leaderBoardCont);
    });
    this.backBtn.on("pointerdown", () => {
      this.changeContainer(this.menuCont);
    });

this.marketBtn.on("pointerdown", () => {
      alert("it will take you to an nft market place like opensea when available")
    });

    

    this.mintYourFirstNFTBtn.on("pointerdown",()=>{
      const tokenURI = "https://plum-total-louse-876.mypinata.cloud/ipfs/bafkreidq7jn2p33u6hkfk2jgnozbnpate7h4zi2rfpbprq46heljdo6ncu"
      const id = 1
      this.mint(tokenURI, id)
      
    })
  }
  shortedAddresses(wallet: any) {
    const walladdr = `${wallet.slice(0, 5)}.... ${wallet.slice(-5)}`;
    return walladdr;
  }

  createLeaderBoard(leaderBoard: any) {
    var y: any = -300;
    for (var i = 0; i < 10; i++) {
      if (leaderBoard[i] === undefined) {
        return;
      } else {
        const text = this.add
          .text(0, y, this.shortedAddresses(leaderBoard[i].player))
          .setScale(3)
          .setOrigin(0.5, 0.5);

        this.leaderBoardCont.add([text]);
        y += 60;
        console.log(text);
      }
    }
  }

  handleContainers() {
    this.containArray.forEach((container) => {
      if (!container.active) {
        container.name.setActive(false).setVisible(false);
      } else {
        container.name.setActive(true).setVisible(true);
      }
    })
    if(!this.hasNft){
      this.containArray.forEach((container:any) =>{
        container.active = false
        this.mintYourFirstNFTBtn.setActive(true).setVisible(true)
      })
    }else{
      this.containArray.forEach(container =>{
        if(container.name === this.menuCont){
          container.active = true
        }
      } )
      this.mintYourFirstNFTBtn.setActive(false).setVisible(false)
    }
  }

  changeContainer(containerName: Phaser.GameObjects.Container) {
    this.containArray.forEach((container) => {
      if (container.name === containerName) {
        container.active = true;
      } else {
        container.active = false;
      }
    });
  }

  checkForNft(){
    if(this.nftArray.length <= 0){
      this.hasNft = false
    }else{
      this.hasNft = true
    }
  }
  async connectWallet(){
    await connectWallet()
  }
  async initializeWallet(){
    await Initialize_Wallet()
  }
  async getPlayersNfts(){
    await getPlayerNfts(this.nftArray)
    console.log(this.nftArray)
  }

  async mint(tokenURI: string, id:number){
    console.log("minting")
    const mint = await Mint(tokenURI, id)
  }
  loadNftsImages(){
    
  }

  
}
