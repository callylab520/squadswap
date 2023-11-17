// test/Rematic.proxy.js
// Load dependencies

import { expect } from "chai";
import { BigNumber, Wallet, utils, constants } from "ethers";
import hre, { ethers } from "hardhat";
// import { time } from "@nomicfoundation/hardhat-network-helpers";
import PairABI from "../artifacts/contracts/factory/SquadswapPair.sol/SquadswapPair.json"

let SquadContract: any;
let SquadFactory;

let CakeContract: any;
let CakeFactory;

let WBNB: any;
let WBNBFactory;

let ISEStakeContract: any;
let ISEStakeFactory;

let DexFactory: any;
let DexFactoryFactory;

let Router: any;
let RouterFactory;

let wallet: Wallet;
let feeTo: Wallet;
let referrer2: Wallet;
let cakeWallet: Wallet;
let squadWallet: Wallet;
let user3: Wallet;
let user1: Wallet;
let user2: Wallet;
let user4: Wallet;
let devWallet: Wallet;

let key1: string;
let key2: string;

// Start test block
describe("Squad Token", function () {
  before(async function () {
    [
      wallet,
      feeTo,
      referrer2,
      cakeWallet,
      squadWallet,
      user3,
      user1,
      user2,
      user4,
      devWallet,
    ] = await (ethers as any).getSigners();
    SquadFactory = await ethers.getContractFactory("ERC20");
    SquadContract = await SquadFactory.deploy("100000000000000000000000000");
    
    CakeFactory = await ethers.getContractFactory("ERC20");
    CakeContract = await CakeFactory.deploy("100000000000000000000000000");

    WBNBFactory = await ethers.getContractFactory("WETH9");
    WBNB = await WBNBFactory.deploy();

    DexFactoryFactory = await ethers.getContractFactory("SquadswapFactory");
    DexFactory = await DexFactoryFactory.deploy(wallet.address);

    console.log("Fatory address---------", DexFactory.address)
    console.log("init code address---------", await DexFactory.INIT_CODE_PAIR_HASH())

    RouterFactory = await ethers.getContractFactory("SquadswapRouter02");
    Router = await RouterFactory.deploy(DexFactory.address, WBNB.address);

    await SquadContract.transfer(user1.address, "100000000000000000000000")
    await SquadContract.transfer(user2.address, "100000000000000000000000")
    await SquadContract.transfer(user3.address, "100000000000000000000000")
    await SquadContract.transfer(user4.address, "100000000000000000000000")

    await CakeContract.transfer(user1.address, "100000000000000000000000")
    await CakeContract.transfer(user2.address, "100000000000000000000000")
    await CakeContract.transfer(user3.address, "100000000000000000000000")
    await CakeContract.transfer(user4.address, "100000000000000000000000")

    await DexFactory.setFeeTo(feeTo.address);

    await SquadContract.connect(user1).approve(Router.address, constants.MaxUint256)
    await SquadContract.connect(user2).approve(Router.address, constants.MaxUint256)
    await SquadContract.connect(user3).approve(Router.address, constants.MaxUint256)
    await SquadContract.connect(user4).approve(Router.address, constants.MaxUint256)

    await CakeContract.connect(user1).approve(Router.address, constants.MaxUint256)
    await CakeContract.connect(user2).approve(Router.address, constants.MaxUint256)
    await CakeContract.connect(user3).approve(Router.address, constants.MaxUint256)
    await CakeContract.connect(user4).approve(Router.address, constants.MaxUint256)
  });

  // Test case

  it("Staking", async function () {
    await Router.connect(user1).addLiquidity(
        SquadContract.address,
        CakeContract.address,
        "1000000000000000000000",
        "1000000000000000000000",
        "0",
        "0",
        user1.address,
        "9999999999"
    )

    await Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "0",
        [SquadContract.address, CakeContract.address],
        user1.address,
        "9999999999"
    )

    await Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "0",
        [SquadContract.address, CakeContract.address],
        user1.address,
        "9999999999"
    )

    await Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "0",
        [SquadContract.address, CakeContract.address],
        user1.address,
        "9999999999"
    )

    await Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "0",
        [CakeContract.address, SquadContract.address],
        user1.address,
        "9999999999"
    )

    await Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "0",
        [CakeContract.address, SquadContract.address],
        user1.address,
        "9999999999"
    )

    await Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "0",
        [CakeContract.address, SquadContract.address],
        user1.address,
        "9999999999"
    )

    await Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "0",
        [CakeContract.address, SquadContract.address],
        user1.address,
        "9999999999"
    )

    await Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "0",
        [SquadContract.address, CakeContract.address],
        user1.address,
        "9999999999"
    )

    await Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "0",
        [SquadContract.address, CakeContract.address],
        user1.address,
        "9999999999"
    )

    await Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "0",
        [SquadContract.address, CakeContract.address],
        user1.address,
        "9999999999"
    )

    await Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "0",
        [CakeContract.address, SquadContract.address],
        user1.address,
        "9999999999"
    )

    await Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "0",
        [CakeContract.address, SquadContract.address],
        user1.address,
        "9999999999"
    )

    await Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "0",
        [CakeContract.address, SquadContract.address],
        user1.address,
        "9999999999"
    )

    await Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "0",
        [CakeContract.address, SquadContract.address],
        user1.address,
        "9999999999"
    )

    const Pair = new ethers.Contract("0x6f63269401ac5d74e6814f36fd77d0051c511cfd", PairABI.abi, user1)

    await Pair.approve(Router.address, "9999999999999999999999999999")

    await Router.connect(user1).removeLiquidity(
        SquadContract.address,
        CakeContract.address,
        "999999999999999999000",
        "0",
        "0",
        user1.address,
        "9999999999"
    )

    // await Router.connect(user2).addLiquidity(
    //     SquadContract.address,
    //     CakeContract.address,
    //     "2000000000000000000000",
    //     "1500000000000000000000",
    //     "0",
    //     "0",
    //     user1.address,
    //     "9999999999"
    // )
  });
});
