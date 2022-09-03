require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("hardhat-deploy")

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    // solidity: "0.8.8",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }]
    },
    defaultNetwork: "hardhat",

    networks: {
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
            blockConfirmations: 6
        }
    },

    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "MATIC"
    },

    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    },

    namedAccounts: {
        deployer: {
            default: 0,
            1: 0
        }
        // user : {
        //   default : 1,
        // }
    }
}
