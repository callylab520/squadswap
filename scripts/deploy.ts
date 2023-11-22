import hre, { ethers, network, run } from 'hardhat'
import { config } from './utils';
import * as dotenv from 'dotenv';
import fs from "fs";

dotenv.config()

async function main() {

  const [deployer] = await ethers.getSigners();
  const networkName = network.name;

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const deployedContracts = require(`../deployments/${networkName}.json`)
  console.log('-----------deployedContracts--------', deployedContracts)

  const router = await hre.ethers.getContractFactory("SquadswapRouter02");
  const routerInstance = await router.deploy(deployedContracts.factory, config[networkName].WETH);

  await routerInstance.deployed();

  console.log("Squad Router deployed to:", routerInstance.address);

  try {
    await run("verify:verify", {
      address: routerInstance.address,
      constructorArguments: [deployedContracts.factory, config[networkName].WETH],
    });
  } catch (e) {
    console.error(e)
  }

  const contracts = {
    factory: routerInstance.address,
  };

  fs.writeFileSync(
    `./deployments/${networkName}.json`,
    JSON.stringify(contracts, null, 2)
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
