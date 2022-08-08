const BigNumber = require("bignumber.js");
const { getConnection, } = require("../helper/solana");
const { PublicKey, } = require("@solana/web3.js");
const axios = require('axios');
const retry = require('async-retry');
const { parseReserve } = require("../solend/utils");

const WAD = "1".concat(Array(18 + 1).join("0"));

const reserves = [
    // SOL
    "8PbodeaosQP19SjYFx855UMqWxH2HynZLdBXmsrbac36",
    // USDC
    "BgxfHJDzm44T7XG68MYKx7YisTjZu73tVovyZSjJMpmw",
    // USDT
    "8K9WC8xoh2rtQNY7iEGXtPvfbDCi563SdWhCAhuMP2xE",
    // ETH
    "CPDiKagfozERtJ33p7HHhEfJERjvfk1VAjMXAFLrvrKP",
    // BTC
    "GYzjMCXTDue12eUGKKWAqtF5jcBYNmewr6Db6LaguEaX",
];

async function fetch() {
    const response = (
        await retry(
            async () => await axios.get('https://api.scallop.io/v1/get-total-value')
        )
    ).data;
    const connection = getConnection();

    for (const reserve of reserves) {
        const accountInfo = await connection.getAccountInfo(new PublicKey(reserve), "processed");
        const parsedReserve = parseReserve(PublicKey.default, accountInfo);
        const tokenUsdPrice = new BigNumber(parsedReserve.info.liquidity.marketPrice.toString()).div(WAD).toNumber();
        console.log(tokenUsdPrice);
    }

    return response.data;
}

module.exports = {
    timetravel: false,
    solana: {
        fetch
    },
    fetch,
};