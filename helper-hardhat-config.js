const networkConfig = {
    4 : {
        name : "rinkeby",
        ethUsdPriceFeed : "0xaEA2808407B7319A31A383B6F8B60f04BCa23cE2"
    },
    137 : {
        name : "polygon",
        ethUsdPriceFeed : "0xF9680D99D6C9589e2a93a78A04A279e509205945"
    },
}

const developmentChains = [ "hardhat", "localhost"]

const DECIMALS = 8
const INITIAL_ANSWER = 200000000000

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER
}