const { developmentChains, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config")
const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log  } = deployments
    const { deployer } = await getNamedAccounts()
    // const chainId = network.config.chainId

    if(developmentChains.includes(network.name)){
        log("Local network detacting deploying mocks..")

        try{

            await deploy("MockV3Aggregator", {
                contract : "MockV3Aggregator",
                from : deployer,
                log : true,
                args : [ DECIMALS, INITIAL_ANSWER ],
            })

        }catch(e){
            log("Exception is ")
            log(e)
        }
    


        log("Mocks Deployed !")
        log("------------------------------------------")


    }
}

// This is for which one you want deplot
// yarn hardhat deploy --tags mocks

module.exports.tags = [ "all", "mocks"]