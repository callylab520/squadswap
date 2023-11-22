import hre, { ethers, run, network } from "hardhat";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  const networkName = network.name;

  console.log("Deploying contracts with the account:", deployer.address);

  // We get the contract to deploy
  const factory = await hre.ethers.getContractFactory("SquadswapFactory");
  const factoryInstance = await factory.deploy(deployer.address);

  await factoryInstance.deployed();

  console.log("Squad Factory deployed to:", factoryInstance.address);
  try {
    await run("verify:verify", {
      address: factoryInstance.address,
      constructorArguments: [deployer.address],
    });
  } catch (e) {
    console.error(e)
  }

  const contracts = {
    factory: factoryInstance.address,
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
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
