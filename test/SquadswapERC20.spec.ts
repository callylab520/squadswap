// test/Rematic.proxy.js
// Load dependencies

import { expect } from "chai";
import { BigNumber, Wallet, utils, constants } from "ethers";
import hre, { ethers } from "hardhat";
// import { time } from "@nomicfoundation/hardhat-network-helpers";
import PairABI from "../artifacts/contracts/factory/SquadswapPair.sol/SquadswapPair.json";

let SafeMathTestContract: any;
let SafeMathTest;

let wallet: Wallet;
let user1: Wallet;

// Start test block
describe("SquadswapERC20", function () {
  before(async function () {
    [
      wallet,
      user1,
    ] = await (ethers as any).getSigners();
    SafeMathTest = await ethers.getContractFactory("SquadswapERC20Test");
    SafeMathTestContract = await SafeMathTest.deploy();

    await SafeMathTestContract.mint(user1.address, "10000000000000000000000")
  });

  // Test case

  it("Add test", async function () {
    await SafeMathTestContract.connect(user1).transfer(wallet.address, "1000000000000000000")
    expect(BigNumber.from("1000000000000000000")).to.eq(await SafeMathTestContract.balanceOf(wallet.address))
    await SafeMathTestContract.connect(user1).approve(wallet.address, constants.MaxUint256)
    await SafeMathTestContract.transferFrom(user1.address, wallet.address, "1000000000000000000")
    expect(BigNumber.from("2000000000000000000")).to.eq(await SafeMathTestContract.balanceOf(wallet.address))

  });
});
