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

    await DexFactory.setFeeTo(feeTo.address);

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

  it("swap tokens", async () => {
    let pairAddress = await DexFactory.getPair(SquadContract.address, CakeContract.address)
    let Pair = new ethers.Contract(
      pairAddress,
      PairABI.abi,
      user1
    );
    let [reverse0, reverse1] = await Pair.getReserves();
    await expect(Router.getAmountOut("0", reverse0, reverse1)).to.revertedWith('SquadswapLibrary: INSUFFICIENT_INPUT_AMOUNT')
    await expect(Router.getAmountOut(constants.MaxUint256, reverse0, reverse1)).to.reverted
    await expect(Router.getAmountOut("10000000000000000000", 0, 0)).to.revertedWith('SquadswapLibrary: INSUFFICIENT_LIQUIDITY')
    const amountOut = await Router.getAmountOut("10000000000000000000", reverse0, reverse1)
    await expect(Router.getAmountsOut("10000000000000000000",[SquadContract.address])).to.revertedWith('SquadswapLibrary: INVALID_PATH')
    const amountOuts = await Router.getAmountsOut("10000000000000000000", [SquadContract.address, CakeContract.address])
    expect(amountOut).to.eq(amountOuts[1])
    let bal = await CakeContract.balanceOf(user1.address)
    await Router.connect(user2).swapExactTokensForTokens(
      "10000000000000000000",
      "0",
      [SquadContract.address, CakeContract.address],
      user1.address,
      "9999999999"
    );

    let bal2 = await CakeContract.balanceOf(user1.address)
    expect(bal2).to.eq(bal.add(amountOut))

    await expect(
      Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "1000000000000000000000000",
        [SquadContract.address, CakeContract.address],
        user1.address,
        "9999999999"
      )
    ).to.revertedWith("SquadswapRouter02: INSUFFICIENT_OUTPUT_AMOUNT");

    await expect(
      Router.connect(user2).swapExactTokensForTokens(
        "10000000000000000000",
        "1000000000000000000000000",
        [SquadContract.address, CakeContract.address],
        user1.address,
        "0"
      )
    ).to.revertedWith("SquadswapRouter02: EXPIRED");

    await expect(
      Router.connect(user2).swapTokensForExactTokens(
        "10000000000000000000",
        "0",
        [SquadContract.address, CakeContract.address],
        user1.address,
        "9999999999"
      )
    ).to.revertedWith("SquadswapRouter02: EXCESSIVE_INPUT_AMOUNT");

    await expect(
      Router.connect(user2).swapTokensForExactTokens(
        "10000000000000000000",
        "0",
        [SquadContract.address, CakeContract.address],
        user1.address,
        "0"
      )
    ).to.revertedWith("SquadswapRouter02: EXPIRED");

    pairAddress = await DexFactory.getPair(SquadContract.address, CakeContract.address)
    Pair = new ethers.Contract(
      pairAddress,
      PairABI.abi,
      user1
    );
    [reverse0, reverse1] = await Pair.getReserves();
    await expect(Router.getAmountIn("0", reverse0, reverse1)).to.revertedWith('SquadswapLibrary: INSUFFICIENT_OUTPUT_AMOUNT')
    await expect(Router.getAmountIn("10000000000000000000", 0, 0)).to.revertedWith('SquadswapLibrary: INSUFFICIENT_LIQUIDITY')
    await expect(Router.getAmountsIn("10000000000000000000",[SquadContract.address])).to.revertedWith('SquadswapLibrary: INVALID_PATH')
    const amountIn = await Router.getAmountIn("10000000000000000000", reverse0, reverse1)
    const amountIns = await Router.getAmountsIn("10000000000000000000", [CakeContract.address, SquadContract.address])
    // expect(amountIns[0]).to.eq(amountIn)
    bal = await SquadContract.balanceOf(user2.address)

    await Router.connect(user2).swapTokensForExactTokens(
      "10000000000000000000",
      "1000000000000000000000",
      [SquadContract.address, CakeContract.address],
      user1.address,
      "9999999999"
    );
    bal2 = await SquadContract.balanceOf(user2.address)
    // expect(bal).to.eq(bal2.add(amountIn))
  })

  it("Swap with ETH", async() => {
    await Router.connect(user2).swapExactETHForTokens(
      "0",
      [WBNB.address, SquadContract.address],
      user1.address,
      "9999999999",
      {value: '1000000000000000000'}
    );

    await expect(Router.connect(user2).swapExactETHForTokens(
      "0",
      [SquadContract.address, WBNB.address],
      user1.address,
      "9999999999",
      {value: '1000000000000000000'}
    )).to.revertedWith('SquadswapRouter02: INVALID_PATH');

    await expect(Router.connect(user2).swapExactETHForTokens(
      "0",
      [SquadContract.address, WBNB.address],
      user1.address,
      "0",
      {value: '1000000000000000000'}
    )).to.revertedWith('SquadswapRouter02: EXPIRED');

    await expect(Router.connect(user2).swapExactETHForTokens(
      "1000000000000000000000000",
      [WBNB.address, SquadContract.address],
      user1.address,
      "9999999999",
      {value: '1000000000000000000'}
    )).to.revertedWith('SquadswapRouter02: INSUFFICIENT_OUTPUT_AMOUNT');

    /////////////////////////////////////////////////

    await Router.connect(user2).swapTokensForExactETH(
      "1000000000000000000",
      "10000000000000000000000",
      [SquadContract.address, WBNB.address],
      user1.address,
      "9999999999",
    );

    await expect(Router.connect(user2).swapTokensForExactETH(
      "1000000000000000000",
      "10000000000000000000000",
      [WBNB.address, SquadContract.address],
      user1.address,
      "9999999999",
    )).to.revertedWith('SquadswapRouter02: INVALID_PATH');

    await expect(Router.connect(user2).swapTokensForExactETH(
      "1000000000000000000",
      "0",
      [SquadContract.address, WBNB.address],
      user1.address,
      "9999999999",
    )).to.revertedWith('SquadswapRouter02: EXCESSIVE_INPUT_AMOUNT');

    await expect(Router.connect(user2).swapTokensForExactETH(
      "1000000000000000000",
      "0",
      [SquadContract.address, WBNB.address],
      user1.address,
      "0",
    )).to.revertedWith('SquadswapRouter02: EXPIRED');

    //////////////////////////////////////////////////////////////

    await Router.connect(user2).swapExactTokensForETH(
      "1000000000000000000",
      "0",
      [SquadContract.address, WBNB.address],
      user1.address,
      "9999999999",
    );

    await expect(Router.connect(user2).swapExactTokensForETH(
      "1000000000000000000",
      "0",
      [WBNB.address, SquadContract.address],
      user1.address,
      "9999999999",
    )).to.revertedWith('SquadswapRouter02: INVALID_PATH');

    await expect(Router.connect(user2).swapExactTokensForETH(
      "1000000000000000000",
      "0",
      [WBNB.address, SquadContract.address],
      user1.address,
      "0",
    )).to.revertedWith('SquadswapRouter02: EXPIRED');

    await expect(Router.connect(user2).swapExactTokensForETH(
      "1000000000000000000",
      "100000000000000000000",
      [SquadContract.address, WBNB.address],
      user1.address,
      "9999999999",
    )).to.revertedWith('SquadswapRouter02: INSUFFICIENT_OUTPUT_AMOUNT');

    ///////////////////////////////////////////////////////////////////
    await Router.connect(user2).swapETHForExactTokens(
      "10000000000000000000",
      [WBNB.address, SquadContract.address],
      user1.address,
      "9999999999",
      {value: '100629503879092224'}
    );

    await Router.connect(user2).swapETHForExactTokens(
      "10000000000000000000",
      [WBNB.address, SquadContract.address],
      user1.address,
      "9999999999",
      {value: '1000000000000000000'}
    );

    await expect(Router.connect(user2).swapETHForExactTokens(
      "10000000000000000000",
      [SquadContract.address, WBNB.address],
      user1.address,
      "9999999999",
      {value: '1000000000000000000'}
    )).to.revertedWith('SquadswapRouter02: INVALID_PATH');

    await expect(Router.connect(user2).swapETHForExactTokens(
      "10000000000000000000",
      [SquadContract.address, WBNB.address],
      user1.address,
      "0",
      {value: '1000000000000000000'}
    )).to.revertedWith('SquadswapRouter02: EXPIRED');

    await expect(Router.connect(user2).swapETHForExactTokens(
      "10000000000000000000",
      [WBNB.address, SquadContract.address],
      user1.address,
      "9999999999",
      {value: '10000000'}
    )).to.revertedWith('SquadswapRouter02: EXCESSIVE_INPUT_AMOUNT');

    await Router.connect(user2).addLiquidity(
      CakeContract.address,
      SquadContract.address,
      "50000000000000000",
      "38029700845072876",
      "0",
      "1000",
      user2.address,
      "999999999999"
    )

    await expect(Router.connect(user2).addLiquidity(
      SquadContract.address,
      CakeContract.address,
      "50000000000000000",
      "38029700845072876",
      "1000000000000000000000",
      "1000",
      user2.address,
      "999999999999"
    )).to.revertedWith('SquadswapRouter02: INSUFFICIENT_A_AMOUNT')

    await expect(Router.connect(user2).addLiquidity(
      SquadContract.address,
      SquadContract.address,
      "50000000000000000",
      "38029700845072876",
      "1000000000000000000000",
      "1000",
      user2.address,
      "999999999999"
    )).to.revertedWith('Squadswap: IDENTICAL_ADDRESSES')
    await expect(Router.connect(user2).addLiquidity(
      SquadContract.address,
      constants.AddressZero,
      "50000000000000000",
      "38029700845072876",
      "1000000000000000000000",
      "1000",
      user2.address,
      "999999999999"
    )).to.revertedWith('Squadswap: ZERO_ADDRESS')
    
    console.log('===========start==============')
    await expect(Router.connect(user2).addLiquidity(
      SquadContract.address,
      CakeContract.address,
      "50000000000000000",
      "380297008450728760000",
      "1000000000000000000000",
      "1000000000000000000000000000",
      user2.address,
      "999999999999"
    )).to.revertedWith('SquadswapRouter02: INSUFFICIENT_B_AMOUNT')
  })

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

  it("swapExactTokensForTokensSupportingFeeOnTransferTokens testing", async() => {
    await Router.connect(user2).swapExactTokensForTokensSupportingFeeOnTransferTokens(
      "1000000000000000000000",
      "0",
      [SquadContract.address, CakeContract.address],
      user1.address,
      "9999999999",
    );
    await expect(Router.connect(user2).swapExactTokensForTokensSupportingFeeOnTransferTokens(
      "1000000000000000000000",
      "0",
      [SquadContract.address, CakeContract.address],
      user1.address,
      "0",
    )).to.revertedWith('SquadswapRouter02: EXPIRED')

    await expect(Router.connect(user2).swapExactTokensForTokensSupportingFeeOnTransferTokens(
      "1000000000000000000000",
      "1000000000000000000000000000",
      [SquadContract.address, CakeContract.address],
      user1.address,
      "9999999999",
    )).to.revertedWith('SquadswapRouter02: INSUFFICIENT_OUTPUT_AMOUNT')

    await expect(Router.connect(user2).swapExactETHForTokensSupportingFeeOnTransferTokens(
      "0",
      [SquadContract.address, WBNB.address, CakeContract.address],
      user1.address,
      "9999999999",
      {value: '1000000000000000000'}
    )).to.revertedWith('SquadswapRouter02: INVALID_PATH')

    await expect(Router.connect(user2).swapExactETHForTokensSupportingFeeOnTransferTokens(
      "0",
      [WBNB.address, SquadContract.address, CakeContract.address],
      user1.address,
      "0",
      {value: '1000000000000000000'}
    )).to.revertedWith('SquadswapRouter02: EXPIRED')
    await expect(Router.connect(user2).swapExactETHForTokensSupportingFeeOnTransferTokens(
      "10000000000000000000000",
      [WBNB.address, SquadContract.address, CakeContract.address],
      user1.address,
      "999999999999",
      {value: '1000000000000000000'}
    )).to.revertedWith('SquadswapRouter02: INSUFFICIENT_OUTPUT_AMOUNT')
  })

  it("swapExactTokensForETHSupportingFeeOnTransferTokens testing", async() => {

    await expect(Router.connect(user2).swapExactTokensForETHSupportingFeeOnTransferTokens(
      "100000000000000000000",
      "0",
      [SquadContract.address, WBNB.address, CakeContract.address],
      user1.address,
      "9999999999",
    )).to.revertedWith('SquadswapRouter02: INVALID_PATH')

    await expect(Router.connect(user2).swapExactTokensForETHSupportingFeeOnTransferTokens(
      "100000000000000000000",
      "0",
      [SquadContract.address, CakeContract.address, WBNB.address],
      user1.address,
      "0",
    )).to.revertedWith('SquadswapRouter02: EXPIRED')
    await expect(Router.connect(user2).swapExactTokensForETHSupportingFeeOnTransferTokens(
      "100000000000000000000",
      "10000000000000000000000",
      [CakeContract.address, SquadContract.address, WBNB.address],
      user1.address,
      "999999999999",
    )).to.revertedWith('SquadswapRouter02: INSUFFICIENT_OUTPUT_AMOUNT')
    await Router.connect(user2).swapExactTokensForETHSupportingFeeOnTransferTokens(
      "100000000000000000000",
      "0",
      [CakeContract.address, SquadContract.address, WBNB.address],
      user1.address,
      "999999999999",
    )
  })

  it("testing get amounts", async() => {
    const amountB = (await Router.quote("6", "3", "2"))
    expect(amountB.mul(3)).to.eq(12)
    await expect(Router.quote("0", "3", "2")).to.revertedWith('SquadswapLibrary: INSUFFICIENT_AMOUNT')
    await expect(Router.quote("3", "0", "0")).to.revertedWith('SquadswapLibrary: INSUFFICIENT_LIQUIDITY')
    
  })

  it("removeLiquidity", async() => {
    const pairAddress = await DexFactory.getPair(SquadContract.address, CakeContract.address)
    const Pair = new ethers.Contract(
      pairAddress,
      PairABI.abi,
      user1
    );
    await Pair.approve(Router.address, "9999999999999999999999999999")

    await expect(Router.connect(user1).removeLiquidity(
      SquadContract.address,
      CakeContract.address,
      "999999999999999999000",
      "0",
      "1000000000000000000000000",
      user1.address,
      "99999999990"
    )).to.revertedWith('SquadswapRouter02: INSUFFICIENT_B_AMOUNT')

    await expect(Router.connect(user1).removeLiquidity(
      SquadContract.address,
      CakeContract.address,
      "999999999999999999000",
      "1000000000000000000000000",
      "0",
      user1.address,
      "99999999990"
    )).to.revertedWith('SquadswapRouter02: INSUFFICIENT_A_AMOUNT')

    await expect(Router.connect(user1).removeLiquidity(
      SquadContract.address,
      CakeContract.address,
      "999999999999999999000",
      "0",
      "0",
      user1.address,
      "0"
    )).to.revertedWith('SquadswapRouter02: EXPIRED')

    await Router.connect(user1).removeLiquidity(
        SquadContract.address,
        CakeContract.address,
        "999999999999999999",
        "0",
        "0",
        user1.address,
        "9999999999"
    )

    await Router.connect(user1).removeLiquidity(
      CakeContract.address,
      SquadContract.address,
      "999999999999999",
      "0",
      "0",
      user1.address,
      "9999999999"
  )
    
  })

  it("removeLiquidity with ETH", async() => {
    console.log('--------------------')
    const pairAddress = await DexFactory.getPair(WBNB.address, SquadContract.address)
    console.log('-----------pairAddress--------------', pairAddress)
    const Pair = new ethers.Contract(
      pairAddress,
      PairABI.abi,
      user1
    );
    await Pair.skim(user1.address)
    await Pair.sync()
    await Pair.approve(Router.address, "9999999999999999999999999999")
    const balance = await Pair.balanceOf(user1.address)
    const [reverse0,revers1] = await Pair.getReserves()

    await expect(Router.connect(user1).removeLiquidityETH(
      SquadContract.address,
      balance,
      "0",
      "0",
      user1.address,
      "0"
    )).to.revertedWith('SquadswapRouter02: EXPIRED')

    await Router.connect(user1).removeLiquidityETH(
        SquadContract.address,
        balance,
        "0",
        "0",
        user1.address,
        "9999999999"
    )
    
  })
});
