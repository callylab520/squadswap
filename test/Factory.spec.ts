// test/Rematic.proxy.js
// Load dependencies

import { expect } from "chai";
import { BigNumber, Wallet, utils, constants } from "ethers";
import hre, { ethers } from "hardhat";
// import { time } from "@nomicfoundation/hardhat-network-helpers";
import PairABI from "../artifacts/contracts/factory/SquadswapPair.sol/SquadswapPair.json";

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

    console.log("Fatory address---------", DexFactory.address);
    console.log(
      "init code address---------",
      await DexFactory.INIT_CODE_PAIR_HASH()
    );

    await DexFactory.setFeeToSetter(user1.address)
    await expect(DexFactory.setFeeTo(user2.address)).to.revertedWith('Squadswap: FORBIDDEN')
    await expect(DexFactory.setFeeToSetter(user2.address)).to.revertedWith('Squadswap: FORBIDDEN')

    RouterFactory = await ethers.getContractFactory("SquadswapRouter02");
    Router = await RouterFactory.deploy(DexFactory.address, WBNB.address);

    await SquadContract.transfer(user1.address, "100000000000000000000000");
    await SquadContract.transfer(user2.address, "10000000000000000000000000");
    await SquadContract.transfer(user3.address, "100000000000000000000000");
    await SquadContract.transfer(user4.address, "100000000000000000000000");

    await CakeContract.transfer(user1.address, "100000000000000000000000");
    await CakeContract.transfer(user2.address, "10000000000000000000000000");
    await CakeContract.transfer(user3.address, "100000000000000000000000");
    await CakeContract.transfer(user4.address, "100000000000000000000000");

    await SquadContract.connect(user1).approve(
      Router.address,
      constants.MaxUint256
    );
    await SquadContract.connect(user2).approve(
      Router.address,
      constants.MaxUint256
    );
    await SquadContract.connect(user3).approve(
      Router.address,
      constants.MaxUint256
    );
    await SquadContract.connect(user4).approve(
      Router.address,
      constants.MaxUint256
    );

    await CakeContract.connect(user1).approve(
      Router.address,
      constants.MaxUint256
    );
    await CakeContract.connect(user2).approve(
      Router.address,
      constants.MaxUint256
    );
    await CakeContract.connect(user3).approve(
      Router.address,
      constants.MaxUint256
    );
    await CakeContract.connect(user4).approve(
      Router.address,
      constants.MaxUint256
    );
  });

  // Test case

  it("Add Liquidity", async function () {
    await Router.connect(user1).addLiquidity(
      SquadContract.address,
      CakeContract.address,
      "1000000000000000000000",
      "1000000000000000000000",
      "0",
      "0",
      user1.address,
      "9999999999"
    );

    await Router.connect(user1).addLiquidity(
      SquadContract.address,
      CakeContract.address,
      "2000000000000000",
      "1000000000000000000000",
      "0",
      "0",
      user1.address,
      "9999999999"
    );

    await expect(Router.connect(user1).addLiquidity(
      SquadContract.address,
      CakeContract.address,
      "1000000000000000000000",
      "1000000000000000000000",
      "0",
      "0",
      user1.address,
      "0"
    )).to.revertedWith('SquadswapRouter02: EXPIRED');

    await Router.connect(user1).addLiquidityETH(
      SquadContract.address,
      "1000000000000000000000",
      "0",
      "0",
      user1.address,
      "9999999999",
      {
        value: '10000000000000000000'
      }
    );

    await expect(Router.connect(user1).addLiquidityETH(
      SquadContract.address,
      "1000000000000000000000",
      "0",
      "0",
      user1.address,
      "0",
      {
        value: '10000000000000000000'
      }
    )).to.revertedWith('SquadswapRouter02: EXPIRED');

    await Router.connect(user1).addLiquidityETH(
      SquadContract.address,
      "1000000000000000000000",
      "0",
      "0",
      user1.address,
      "9999999999",
      {
        value: '500000000000000000000'
      }
    );

  });

  it("more than 2 paths", async() => {
    await Router.connect(user2).swapETHForExactTokens(
      "10000000000000000000",
      [WBNB.address, SquadContract.address, CakeContract.address],
      user1.address,
      "9999999999",
      {value: '1000000000000000000'}
    );

    await Router.connect(user2).swapExactETHForTokensSupportingFeeOnTransferTokens(
      "0",
      [WBNB.address, SquadContract.address, CakeContract.address],
      user1.address,
      "9999999999",
      {value: '1000000000000000000'}
    );
  })

  it("Pool length", async() => {
    expect(await DexFactory.allPairsLength()).to.eq(2)
  })
});
