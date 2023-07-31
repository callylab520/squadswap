import hre, { ethers } from 'hardhat'
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  // We get the contract to deploy
  const factory = await hre.ethers.getContractFactory("SquadswapFactory");
  const factoryInstance = await factory.deploy(deployer.address);

  await factoryInstance.deployed();

  console.log("Squad Factory deployed to:", factoryInstance.address);

  const router = await hre.ethers.getContractFactory("SquadswapRouter02");
  const routerInstance = await router.deploy(factoryInstance.address, process.env.WAVAX_ADDRESS);
  //const routerInstance = await router.deploy(factoryInstance.address, process.env.WAVAX_ADDRESS);

  await routerInstance.deployed();

  console.log("Squad Router deployed to:", routerInstance.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
