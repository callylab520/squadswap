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
let feeTo: Wallet;

// Start test block
describe("Squad Token", function () {
  before(async function () {
    [
      wallet,
      feeTo,
    ] = await (ethers as any).getSigners();
    SafeMathTest = await ethers.getContractFactory("SafeMathTest2");
    SafeMathTestContract = await SafeMathTest.deploy();
  });

  // Test case

  it("Add test", async function () {
    await expect(SafeMathTestContract.add(constants.MaxUint256, "10")).to.revertedWith('ds-math-add-overflow')
    expect(await SafeMathTestContract.add("10", "10")).to.eq("20")

    await expect(SafeMathTestContract.sub(0, "10")).to.revertedWith('ds-math-sub-underflow')
    expect(await SafeMathTestContract.sub("20", "10")).to.eq("10")

    await expect(SafeMathTestContract.mul(constants.MaxUint256, "10")).to.revertedWith('ds-math-mul-overflow')
    expect(await SafeMathTestContract.mul("20", "10")).to.eq("200")
  });
});
