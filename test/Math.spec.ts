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
    SafeMathTest = await ethers.getContractFactory("MathTest");
    SafeMathTestContract = await SafeMathTest.deploy();
  });

  // Test case

  it("test", async function () {
    expect(await SafeMathTestContract.min(1, 10)).to.eq(1)
    expect(await SafeMathTestContract.min(13, 10)).to.eq(10)
    expect(await SafeMathTestContract.sqrt(1)).to.eq(1)
    expect(await SafeMathTestContract.sqrt(0)).to.eq(0)
  });
});
