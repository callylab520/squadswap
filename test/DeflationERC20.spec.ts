// test/Rematic.proxy.js
// Load dependencies

import { expect } from "chai";
import { BigNumber, Wallet, utils, constants, Contract, } from "ethers";
import hre, { ethers } from "hardhat";
import { solidity, MockProvider, createFixtureLoader } from 'ethereum-waffle'
// import { time } from "@nomicfoundation/hardhat-network-helpers";
import PairABI from "../artifacts/contracts/factory/SquadswapPair.sol/SquadswapPair.json"
import { ecsign } from 'ethereumjs-util'

let ContractInstance: any;
let ContractFactory;

// let wallet: Wallet;
let feeTo: Wallet;
let referrer2: Wallet;
let cakeWallet: Wallet;
let squadWallet: Wallet;
let user3: Wallet;
let user2: Wallet;
let wallet: Wallet;
let user4: Wallet;
let devWallet: Wallet;


// Start test block
describe("DeflationERC20", function () {
  const provider = new MockProvider()
  const [wallet, user1] = provider.getWallets()
  before(async function () {
    
      
    ContractFactory = await ethers.getContractFactory("DeflatingERC20");
    ContractInstance = await ContractFactory.deploy("100000000000000000000000000");
  });

  // Test case

  it("Approve", async function () {
    await ContractInstance.approve(user1.address, ethers.utils.parseEther('100'))
  });

  it("transfer", async function () {
    await ContractInstance.transfer(user1.address, ethers.utils.parseEther('100'))
  });

  it("transferFrom", async function () {
    await ContractInstance.connect(user1).transferFrom(wallet.address, user1.address, ethers.utils.parseEther('100'), {gasLimit: '100000'})
    await expect(ContractInstance.transferFrom(wallet.address, user1.address, ethers.utils.parseEther('1000'), {gasLimit: '100000'})).to.revertedWith('ds-math-sub-underflow')
    
  });

  it("transferFrom with MAXUINT256", async function () {
    await ContractInstance.transfer(user1.address, ethers.utils.parseEther('99999800'))
    await ContractInstance.connect(user1).approve(wallet.address, ethers.constants.MaxUint256, {gasLimit: '1000000'})
    console.log('-----------', await ContractInstance.allowance(user1.address, wallet.address))
    // await ContractInstance.transferFrom(user1.address, wallet.address, ethers.utils.parseEther('100'), {gasLimit: '100000'})
  });

  it("permit", async function () {
    const amount = BigNumber.from("2000000000000000000")

    const nonce = await ContractInstance.nonces(wallet.address)
    const digest = await getApprovalDigest(
        ContractInstance,
        { owner: wallet.address, spender: user1.address, value: amount.sub("1000") },
        nonce,
        constants.MaxUint256
    )
    
    const { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), Buffer.from(wallet.privateKey.slice(2), 'hex'))

    await ContractInstance.permit(wallet.address, user1.address, amount.sub("1000"), constants.MaxUint256, v, r, s)
  });

  it("permit in failed", async function () {
    const amount = BigNumber.from("2000000000000000000")

    const nonce = await ContractInstance.nonces(wallet.address)
    const digest = await getApprovalDigest(
        ContractInstance,
        { owner: wallet.address, spender: user1.address, value: amount.sub("1000") },
        nonce,
        BigNumber.from('1')
    )
    
    const { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), Buffer.from(wallet.privateKey.slice(2), 'hex'))

    await expect(ContractInstance.permit(wallet.address, user1.address, amount.sub("1000"), constants.MaxUint256, v, r, s)).to.revertedWith('INVALID_SIGNATURE')
  });

  it("permit in failed", async function () {
    const amount = BigNumber.from("2000000000000000000")

    const nonce = await ContractInstance.nonces(wallet.address)
    const digest = await getApprovalDigest(
        ContractInstance,
        { owner: wallet.address, spender: user1.address, value: amount.sub("1000") },
        nonce,
        BigNumber.from('1')
    )
    
    const { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), Buffer.from(wallet.privateKey.slice(2), 'hex'))

    await expect(ContractInstance.permit(wallet.address, user1.address, amount.sub("1000"), '1', v, r, s)).to.revertedWith('EXPIRED')
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
