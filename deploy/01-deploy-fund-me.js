// One Method of working deploy function
// function deployFunc(hre) {
//     console.log("Hi")
// }

const { getNamedAccounts, deployments, network } = require("hardhat")

// module.exports.default = deployFunc

const { networkConfig, developmentChains } = require("../helper-hardhat-config")

const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // const ethUsdPriceFeedAddress = newtworkConfig[chainId]["ethUsdPriceFeed"]

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // Put Price Feed Address
        log: true,
        waitConfirmation: network.config.blockConfirmations || 1
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }

    log("--------------------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
