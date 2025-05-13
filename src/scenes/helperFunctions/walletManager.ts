import cyberRunner_abi from "./CyberRunner.json";
import cyberNft_abi from "./CyberNft.json";
import { MetaMaskSDK } from "@metamask/sdk";
import { ethers } from "ethers";
const cyberRunner_address = "0x776AeDD14e6776e1536f547590Ab4928b4725544";
const cyberNft_address = "0xF50873f8d93B74d15444B9db054C9ae2D7F5D5FD";
const cyberAbi: any = cyberRunner_abi;
const cyberNftabi: any = cyberNft_abi;
export var myNFTs: any = [];

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "Example Pure JS Dapp",
    url: window.location.href,
  },
  infuraAPIKey: "d8ed817e46b84ba9ad4f6c5ecfdb1a76",
  // Other options.
});

export var walletAddress: string | undefined | unknown;
export var LeaderBoard: any;
export async function Initialize_Wallet() {
  const metamaskprovider: any = MMSDK.getProvider();
  const provider = new ethers.BrowserProvider(metamaskprovider);
  console.log(provider);
  const account: any = await metamaskprovider?.request({
    method: "eth_accounts",
  });
  if (account !== undefined) {
    walletAddress = account[0];
  }
  console.log(account);
}

export async function connectWallet() {
  try {
    const wallet = await MMSDK.connect();
    const metamaskprovider: any = MMSDK.getProvider();
    const provider = new ethers.BrowserProvider(metamaskprovider);
    const network = (await provider.getNetwork()).name;
    if (network !== "sepolia") {
      try {
        await metamaskprovider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });
        console.log("swicthed to sapolia");
      } catch (err) {
        console.log(err);
      }
    }
    walletAddress = wallet[0];
    console.log(wallet);
    return wallet[0];
  } catch (err) {
    console.log(err);
  }
}
export async function getPlayers() {
  const metamaskprovider: any = MMSDK.getProvider();
  const provider = new ethers.BrowserProvider(metamaskprovider);
  const network = await provider.getNetwork();
  console.log(network);
  console.log(provider);

  const account = await metamaskprovider?.request({
    method: "eth_requestAccounts",
  });

  const contract = new ethers.Contract(
    cyberRunner_address,
    cyberAbi.abi,
    provider
  );
  const player = await contract.getPlayers();
  const getHighScores = await contract.getHighScore();
  return { player, getHighScores };
}

export async function getPlayerScore() {
  const metamaskprovider: any = MMSDK.getProvider();
  const provider = new ethers.BrowserProvider(metamaskprovider);
  const network = await provider.getNetwork();
  const account = await metamaskprovider?.request({
    method: "eth_requestAccounts",
  });
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(
    cyberRunner_address,
    cyberAbi.abi,
    signer
  );
  const score = await contract.getPlayerScore();
  const conv_score = ethers.formatEther(score);
  console.log(conv_score);
  return conv_score;
}

export async function setHighscrore(highScore: number) {
  const metamaskprovider: any = MMSDK.getProvider();
  const provider = new ethers.BrowserProvider(metamaskprovider);
  const network = await provider.getNetwork();
  const signer = await provider.getSigner();
  const account = await metamaskprovider?.request({
    method: "eth_requestAccounts",
  });
  const highScore_18_dec_place = ethers.parseEther(highScore.toString());
  const contract = new ethers.Contract(
    cyberRunner_address,
    cyberAbi.abi,
    signer
  );
  const player = await contract.storeHighScore(highScore_18_dec_place);
  console.log(player);
}
export async function createLeaderBoard() {
  try {
    const players = await getPlayers();

    const leaderBoard = players.player.map(
      (player: any, i: string | number) => ({
        player,
        score: Number(players.getHighScores[i]),
      })
    );

    const sortedLeaderBoard = leaderBoard.sort(
      (a: { score: number }, b: { score: number }) => b.score - a.score
    );
    console.log(sortedLeaderBoard);
    return sortedLeaderBoard;
  } catch (err) {
    console.log(err);
  }
}
export async function getPlayerNfts(scene: Phaser.Scene) {
  const metamaskprovider: any = MMSDK.getProvider();
  const provider = new ethers.BrowserProvider(metamaskprovider);
  const network = await provider.getNetwork();
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(
    cyberNft_address,
    cyberNftabi.abi,
    signer
  );
  const nfts = await contract.getPlayersTokenIDs();
  await getNftImages(nfts, contract, scene);

  return nfts;
}
async function getNftImages(nft: any, contract: any, scene: Phaser.Scene) {
  nft.forEach(async (nft: any) => {
    const nftURI = await contract.tokenURI(nft);
    const result = await fetch(nftURI).then(async (res) => {
      const data = await res.json();
      const nftImage = data.image;
      const nftSprite = data.characterSprite;
      const spriteName = data.characterName;
      myNFTs.push({
        imageName: `${spriteName}_nft`,
        image: nftImage,
        spriteName,
        spriteImage: nftSprite,
      });
      console.log(nftImage, nftSprite, spriteName);
    });
  });
  console.log(myNFTs);
}
