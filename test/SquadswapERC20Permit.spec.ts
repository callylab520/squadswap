// test/Rematic.proxy.js
// Load dependencies

import { expect } from "chai";
import { BigNumber, Wallet, utils, constants, Contract } from "ethers";
import { MockProvider, createFixtureLoader } from 'ethereum-waffle'
import hre, { ethers } from "hardhat";
// import { time } from "@nomicfoundation/hardhat-network-helpers";
import { ecsign } from 'ethereumjs-util'

let SafeMathTestContract: any;
let SafeMathTest;

let wallet: Wallet;
let user1: Wallet;

// Start test block
describe("SquadswapERC20", function () {
  before(async function () {
    const provider = new MockProvider()
    const res = provider.getWallets()
    wallet = res[0]
    user1 = res[0]
    SafeMathTest = await ethers.getContractFactory("SquadswapERC20Test");
    SafeMathTestContract = await SafeMathTest.deploy();

    await SafeMathTestContract.mint(user1.address, "10000000000000000000000")
  });

  // Test case

  it("permit test", async function () {
    const amount = BigNumber.from("2000000000000000000")

    const nonce = await SafeMathTestContract.nonces(wallet.address)
    const digest = await getApprovalDigest(
      SafeMathTestContract,
        { owner: wallet.address, spender: user1.address, value: amount.sub("1000") },
        nonce,
        constants.MaxUint256
    )
    
    const { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), Buffer.from(wallet.privateKey.slice(2), 'hex'))

    await SafeMathTestContract.permit(wallet.address, user1.address, amount.sub("1000"), constants.MaxUint256, v, r, s)
  });

  it("permit in failed", async function () {
    const amount = BigNumber.from("2000000000000000000")

    const nonce = await SafeMathTestContract.nonces(wallet.address)
    const digest = await getApprovalDigest(
        SafeMathTestContract,
        { owner: wallet.address, spender: user1.address, value: amount.sub("1000") },
        nonce,
        BigNumber.from('1')
    )
    
    const { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), Buffer.from(wallet.privateKey.slice(2), 'hex'))

    await expect(SafeMathTestContract.permit(wallet.address, user1.address, amount.sub("1000"), constants.MaxUint256, v, r, s)).to.revertedWith('Squadswap: INVALID_SIGNATURE')
  });

  it("permit in failed", async function () {
    const amount = BigNumber.from("2000000000000000000")

    const nonce = await SafeMathTestContract.nonces(wallet.address)
    const digest = await getApprovalDigest(
        SafeMathTestContract,
        { owner: wallet.address, spender: user1.address, value: amount.sub("1000") },
        nonce,
        BigNumber.from('1')
    )
    
    const { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), Buffer.from(wallet.privateKey.slice(2), 'hex'))

    await expect(SafeMathTestContract.permit(wallet.address, user1.address, amount.sub("1000"), '1', v, r, s)).to.revertedWith('Squadswap: EXPIRED')
  });

});

export async function getApprovalDigest(
  token: Contract,
  approve: {
    owner: string
    spender: string
    value: BigNumber
  },
  nonce: BigNumber,
  deadline: BigNumber
): Promise<string> {
  const name = await token.name()
  const DOMAIN_SEPARATOR = getDomainSeparator(name, token.address)
  return utils.keccak256(
      utils.solidityPack(
      ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
      [
        '0x19',
        '0x01',
        DOMAIN_SEPARATOR,
        utils.keccak256(
          utils.defaultAbiCoder.encode(
            ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
            [PERMIT_TYPEHASH, approve.owner, approve.spender, approve.value, nonce, deadline]
          )
        )
      ]
    )
  )
}

function getDomainSeparator(name: string, tokenAddress: string) {
  return utils.keccak256(
      utils.defaultAbiCoder.encode(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
      [
        utils.keccak256(utils.toUtf8Bytes('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')),
        utils.keccak256(utils.toUtf8Bytes(name)),
        utils.keccak256(utils.toUtf8Bytes('1')),
        31337,
        tokenAddress
      ]
    )
  )
}

const PERMIT_TYPEHASH = utils.keccak256(
  utils.toUtf8Bytes('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)')
)