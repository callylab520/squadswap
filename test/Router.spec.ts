import hre, { ethers } from "hardhat";

// import Wallet from 'ethereumjs-wallet'
// import { expect } from "chai";
// import { expectRevert, constants } from '@openzeppelin/test-helpers'

import * as dotenv from 'dotenv'
dotenv.config()



describe("Optimizer", function () {
    let forwarder: any
    let Factory: any
    let accounts: any[]
    let router: any;
    let routerContract: any;

    let tokenFactoryList: any[] = []
    let tokenList: any[] = []
    let WETH_Fatory: any;
    let WETH: any
    beforeEach(async function () {
        console.log(0)
        accounts = await ethers.getSigners();
        WETH_Fatory = await ethers.getContractFactory('WETH9')
        WETH = await WETH_Fatory.deploy()
        WETH.connect(accounts[9]).deposit({value: ethers.utils.parseUnits('9999')})
        WETH.connect(accounts[8]).deposit({value: ethers.utils.parseUnits('9999')})

        Factory = await ethers.getContractFactory('SquadswapFactory')
        forwarder = await Factory.deploy(accounts[0].address)

        console.log("INIT_CODE_PAIR_HASH",await forwarder.INIT_CODE_PAIR_HASH())
        router = await ethers.getContractFactory('SquadswapRouter02')
        routerContract = await router.deploy(forwarder.address, WETH.address, accounts[1].address, 30)
        tokenFactoryList[0] = await ethers.getContractFactory('ERC20')
        tokenList[0] = await tokenFactoryList[0].deploy(ethers.utils.parseUnits('100000000'))
        tokenFactoryList[1] = await ethers.getContractFactory('ERC20')
        tokenList[1] = await tokenFactoryList[1].deploy(ethers.utils.parseUnits('100000000'))

        tokenFactoryList[2] = await ethers.getContractFactory('ERC20')
        tokenList[2] = await tokenFactoryList[2].deploy(ethers.utils.parseUnits('100000000'))

        await tokenList[0].approve(routerContract.address, ethers.utils.parseUnits('2000000'))
        await tokenList[1].approve(routerContract.address, ethers.utils.parseUnits('2000000'))
        await tokenList[2].approve(routerContract.address, ethers.utils.parseUnits('2000000'))

        await routerContract.addLiquidity(
            tokenList[0].address, 
            tokenList[1].address,
            ethers.utils.parseUnits('1000000'),
            ethers.utils.parseUnits('1000000'),
            '0',
            '0',
            accounts[3].address,
            '9999999999'
        )
        await routerContract.addLiquidityETH(
            tokenList[0].address,
            ethers.utils.parseUnits('1000000'),
            '0',
            '0',
            accounts[4].address,
            '9999999999',
            {value: ethers.utils.parseUnits('1000')}
        )

        await routerContract.addLiquidityETH(
            tokenList[2].address,
            ethers.utils.parseUnits('1000000'),
            '0',
            '0',
            accounts[5].address,
            '9999999999',
            {value: ethers.utils.parseUnits('1000')}
        )
        console.log('----------deployed successfully-------')
        await tokenList[0].connect(accounts[5]).approve(routerContract.address, ethers.utils.parseUnits('1000000000'))
        await tokenList[1].connect(accounts[5]).approve(routerContract.address, ethers.utils.parseUnits('1000000000'))
        await tokenList[2].connect(accounts[5]).approve(routerContract.address, ethers.utils.parseUnits('1000000000'))

        await tokenList[0].approve(routerContract.address, ethers.utils.parseUnits('1000000000'))
        await tokenList[1].approve(routerContract.address, ethers.utils.parseUnits('1000000000'))
        await tokenList[2].approve(routerContract.address, ethers.utils.parseUnits('1000000000'))
        
        await tokenList[0].connect(accounts[2]).approve(routerContract.address, ethers.utils.parseUnits('1000000000'))
        await tokenList[1].connect(accounts[2]).approve(routerContract.address, ethers.utils.parseUnits('1000000000'))
        await tokenList[2].connect(accounts[2]).approve(routerContract.address, ethers.utils.parseUnits('1000000000'))

        await tokenList[0].connect(accounts[3]).approve(routerContract.address, ethers.utils.parseUnits('1000000000'))
        await tokenList[1].connect(accounts[3]).approve(routerContract.address, ethers.utils.parseUnits('1000000000'))
        await tokenList[2].connect(accounts[3]).approve(routerContract.address, ethers.utils.parseUnits('1000000000'))

        await tokenList[0].connect(accounts[4]).approve(routerContract.address, ethers.utils.parseUnits('1000000000'))
        await tokenList[1].connect(accounts[4]).approve(routerContract.address, ethers.utils.parseUnits('1000000000'))
        await tokenList[2].connect(accounts[4]).approve(routerContract.address, ethers.utils.parseUnits('1000000000'))
      });
    
    //   it('swapExactTokensForTokens', async () => {
    //     const wallet = accounts[1].address
    //     console.log("-----before---",(await tokenList[0].balanceOf(wallet)).toString())
    //     await routerContract.swapExactTokensForTokens(
    //         ethers.utils.parseUnits('10000'),
    //         ethers.utils.parseUnits('0'),
    //         [tokenList[0].address, tokenList[1].address],
    //         accounts[0].address,
    //         "9999999999"
    //     )
    //     console.log("-----after---",(await tokenList[0].balanceOf(wallet)).toString())
    //   });

    //   it('swapTokensForExactTokens', async () => {
    //     const wallet = accounts[1].address
    //     console.log("-----before---",(await tokenList[0].balanceOf(wallet)).toString())
    //     console.log("-----before---",(await tokenList[1].balanceOf(wallet)).toString())
    //     await routerContract.swapTokensForExactTokens(
    //         ethers.utils.parseUnits('10000'),
    //         ethers.utils.parseUnits('999999999'),
    //         [tokenList[0].address, tokenList[1].address],
    //         accounts[0].address,
    //         "9999999999"
    //     )
    //     console.log("-----after---",(await tokenList[0].balanceOf(wallet)).toString())
    //     console.log("-----after---",(await tokenList[1].balanceOf(wallet)).toString())
    //   });

    //   it('swapExactETHForTokens', async () => {
    //     const wallet = accounts[1].address
    //     const provider = ethers.provider;
    //     console.log("-----before---",(await provider.getBalance(wallet)).toString())
        
    //     await routerContract.swapExactETHForTokens(
    //         ethers.utils.parseUnits('0'),
    //         [WETH.address, tokenList[0].address],
    //         accounts[0].address,
    //         "9999999999",
    //         {value: ethers.utils.parseUnits('10')}
    //     )
    //     console.log("-----before---",(await provider.getBalance(wallet)).toString())
    //   });

    //   it('swapTokensForExactETH', async () => {
    //     const wallet = accounts[1].address
    //     const provider = ethers.provider;
    //     console.log("-----before---",(await tokenList[0].balanceOf(wallet)).toString())

    //     await routerContract.swapTokensForExactETH(
    //         ethers.utils.parseUnits('100'),
    //         "999999999999999999999999999999",
    //         [tokenList[0].address, WETH.address],
    //         accounts[0].address,
    //         "9999999999"
    //     )
    //     console.log("-----before---",(await tokenList[0].balanceOf(wallet)).toString())
    //   });

    //   it('swapExactTokensForETH', async () => {
    //     const wallet = accounts[1].address
    //     const provider = ethers.provider;
    //     console.log("-----before---",(await tokenList[0].balanceOf(wallet)).toString())

    //     await routerContract.swapExactTokensForETH(
    //         ethers.utils.parseUnits('1000'),
    //         "0",
    //         [tokenList[0].address, WETH.address],
    //         accounts[0].address,
    //         "9999999999"
    //     )
    //     console.log("-----before---",(await tokenList[0].balanceOf(wallet)).toString())
    //   });

      it('swapETHForExactTokens', async () => {
        const wallet = accounts[1].address
        const provider = ethers.provider;
        console.log("-----before---",(await provider.getBalance(wallet)).toString())
        
        await routerContract.swapETHForExactTokens(
            ethers.utils.parseUnits('10000'),
            [WETH.address, tokenList[0].address],
            accounts[0].address,
            "9999999999",
            {value: ethers.utils.parseUnits('100')}
        )
        console.log("-----before---",(await provider.getBalance(wallet)).toString())
      });

      it('swapExactTokensForTokensSupportingFeeOnTransferTokens', async () => {
        const wallet = accounts[1].address
        const provider = ethers.provider;
        console.log("-----before---",(await tokenList[1].balanceOf(wallet)).toString())
        
        await routerContract.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            ethers.utils.parseUnits('10000'),
            '0',
            [tokenList[1].address, tokenList[0].address, WETH.address, tokenList[2].address],
            accounts[0].address,
            "9999999999",
        )
        console.log("-----before---",(await tokenList[1].balanceOf(wallet)).toString())
      });

      it('swapExactETHForTokensSupportingFeeOnTransferTokens', async () => {
        const wallet = accounts[1].address
        const provider = ethers.provider;
        console.log("-----before---",(await tokenList[1].balanceOf(wallet)).toString())
        
        await routerContract.swapExactETHForTokensSupportingFeeOnTransferTokens(
            ethers.utils.parseUnits('1000'),
            [WETH.address, tokenList[0].address, tokenList[1].address],
            accounts[0].address,
            "9999999999",
            {value: ethers.utils.parseUnits('100')}
        )
        console.log("-----before---",(await provider.getBalance(wallet)).toString())
      });

      it('swapExactTokensForETHSupportingFeeOnTransferTokens', async () => {
        const wallet = accounts[1].address
        const provider = ethers.provider;
        console.log("-----before---",(await tokenList[0].balanceOf(wallet)).toString())
        
        await routerContract.swapExactTokensForETHSupportingFeeOnTransferTokens(
            ethers.utils.parseUnits('10000'),
            ethers.utils.parseUnits('1'),
            [tokenList[0].address, WETH.address],
            accounts[0].address,
            "9999999999"
        )
        console.log("-----before---",(await tokenList[0].balanceOf(wallet)).toString())
      });
});