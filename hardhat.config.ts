import "@nomiclabs/hardhat-waffle"
import '@nomiclabs/hardhat-ethers'
import "@nomiclabs/hardhat-etherscan"
import "solidity-coverage";
import { task } from 'hardhat/config'
import { HardhatUserConfig } from 'hardhat/types'

import * as dotenv from 'dotenv'
dotenv.config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, bre) => {
  const accounts = await bre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: process.env.SNOWTRACE_API_KEY
  },
  networks: {
    localhost: {
      url: "http://localhost:9650/ext/bc/C/rpc",
      chainId: 43112,
    },
    hardhat: {
      chainId: 31337,
      loggingEnabled: false,
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic: "test test test test test test test test test test test junk",
        accountsBalance: "10000000000000000000000",
      },
    },
    testnet: {
      url: "https://bsc-testnet.publicnode.com",
      chainId: 97,
      // gasPrice: 225000000000,
      accounts: [process.env.PRIVATEKEY as string]
    },
    mainnet: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      gasPrice: 225000000000,
      accounts: [process.env.PRIVATEKEY as string]
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.5.16"
      },
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  },
};

export default config
