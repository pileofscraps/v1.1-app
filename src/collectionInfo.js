//var createAlchemyWeb3 = require("@alch/alchemy-web3");
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
//import Web3 from 'web3';
import axios from "axios";

export default async function collectionInfo(contractAddress) {
  //const [nftData, setnftData] = useState();

  // Exchange Info
  const openSeaWyvernExchangev2 = "0x7f268357A8c2552623316e2562D90e642bB538E5";
  const looksRareExchange = "0x59728544B08AB483533076417FbBB2fD0B17CE3a";
  const wETHaddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  // Batch size = number of extra queries needed per NFT transfer
  const logBatch = 750;
  const offset = 9000;
  const batchSize = 5;
  var logBatches = [];
  var swapAgInfo = {};
  var swapData = {};

  // Using HTTPS
  const web3 = createAlchemyWeb3(
    "https://eth-mainnet.alchemyapi.io/v2/9bQ2tKDlFxvEjLPgDkbqxflxEAuUOfEu",
  );

  //const web3 = new Web3("https://eth-mainnet.alchemyapi.io/v2/9bQ2tKDlFxvEjLPgDkbqxflxEAuUOfEu");

  const axiosURL = "https://eth-mainnet.alchemyapi.io/v2/9bQ2tKDlFxvEjLPgDkbqxflxEAuUOfEu";

  const blockNumBody = {
    "jsonrpc":"2.0",
    "method":"eth_blockNumber",
    "params":[],
    "id":0
  }

  var block = await axios.post(axiosURL, blockNumBody)
  var block = parseInt(block.data.result,16)
  const blockOffset = block-offset;

  let transfersBody = JSON.stringify({
    "jsonrpc": "2.0",
    "id": 0,
    "method": "alchemy_getAssetTransfers",
    "params": [
      {
        "fromBlock": "0x"+blockOffset.toString(16),
        "contractAddresses": [contractAddress],
        "excludeZeroValue": true,
        "category": ["erc721"]
      }
    ]
  });

  const rawContractTxs = await axios.post(axiosURL, transfersBody)

  var rawTxs = new Set();
  for (const tx of rawContractTxs.data.result.transfers) {
      // If NFT is ERC721
      if (tx.erc1155Metadata == null)  {
        rawTxs.add(tx.hash);
      }
      else{
        // Ignoring ERC1155 NFTs
      }
  }

  for (var i=logBatch; i<=9000; i+=logBatch) {

    // Backcalculating blocks
    const blockOffsetTo = (block-i+logBatch);
    const blockOffsetFrom = (block-i);

    let openSeaBody = JSON.stringify({
      "jsonrpc":"2.0",
      "id": 1,
      "method":"eth_getLogs",
      "params": [{
        "fromBlock": "0x"+blockOffsetFrom.toString(16),
        "toBlock": "0x"+blockOffsetTo.toString(16),
        "address": openSeaWyvernExchangev2,
        "topics": ["0xc4109843e0b7d514e4c093114b863f8e7d8d9a458c372cd51bfe526b588006c9"]
       }]
    });

    let looksRareBody = JSON.stringify({
      "jsonrpc":"2.0",
      "id": 1,
      "method":"eth_getLogs",
      "params": [{
        "fromBlock": "0x"+blockOffsetFrom.toString(16),
        "toBlock": "0x"+blockOffsetTo.toString(16),
        "address": looksRareExchange,
        "topics": ["0x95fb6205e23ff6bda16a2d1dba56b9ad7c783f67c96fa149785052f47696f2be"]
      }]
    });

    logBatches.push(openSeaBody)
    logBatches.push(looksRareBody)

  }

  console.log(Date().toLocaleString())

  for (var i=0; i<logBatches.length; i+=batchSize) {

    //console.log('-- Sending Batch --')
    const queryParams = logBatches.slice(i,i+batchSize);

    // Wrapping batch queries in promises for smarter searching of NFT sales
    const logQueries = (queryParams) => axios.post(axiosURL,queryParams);
    const promises = queryParams.map(logQueries);
    let logData = await Promise.all(promises);

    //console.log("LOG DATA LENGTH: ",logData.length);

    for (const l of logData) {
      var log = l.data.result
      for (var e=0; e<log.length; e+=1) {
        if (rawTxs.has(log[e].transactionHash)) {

          if (log[e].address.toLowerCase() == openSeaWyvernExchangev2.toLowerCase()) {

            var openSeaTopics = web3.eth.abi.decodeLog([
              {type: 'address', maker: 'src', indexed: true},
              {type: 'address', taker: 'dest', indexed: true}
            ], log[e].data,
            [log[e].topics[1], log[e].topics[2]]);

            swapAgInfo[log[e].transactionHash] ??= {
              "price": 0,
              "blockNum": log[e].blockNumber,
              "relativeblockNum": log[e].blockNumber-blockOffset,
              "marketplace": "Opensea"
            };

            var raw_price = "0x" + (log[e].data.slice(-17))
            swapAgInfo[log[e].transactionHash]["price"] = swapAgInfo[log[e].transactionHash]["price"] + (parseInt(raw_price)/1000000000000000000)
          }

          if (log[e].address.toLowerCase() == looksRareExchange.toLowerCase()) {

            var looksRareTopics = web3.eth.abi.decodeLog([
              {type: 'address', maker: 'src', indexed: true},
              {type: 'address', taker: 'dest', indexed: true}
            ], log[e].data,
            [log[e].topics[1], log[e].topics[2]]);

            swapAgInfo[log[e].transactionHash] ??= {
              "price": 0,
              "blockNum": log[e].blockNumber,
              "relativeblockNum": log[e].blockNumber-blockOffset,
              "marketplace": "LooksRare"
            };

            var raw_price = "0x" + (log[e].data.slice(-17))
            swapAgInfo[log[e].transactionHash]["price"] = swapAgInfo[log[e].transactionHash]["price"] + (parseInt(raw_price)/1000000000000000000)

            console.log(swapAgInfo[log[e].transactionHash])
          }

        }
      }
    }

  }
  console.log(Date().toLocaleString())

  for (let bucket = 0; bucket < 24; bucket++) {
    swapData[bucket] ??= {
      "name": "Hr. " + String(bucket+1),
      "sales": 0,
      "volume": 0,
      "avgprice": 0,
    };
  }

  for (const [key, value] of Object.entries(swapAgInfo)) {
    var blockNum = Math.floor(value.relativeblockNum/375);

    swapData[blockNum]["sales"] = (swapData[blockNum]["sales"] + 1);
    swapData[blockNum]["volume"] = (swapData[blockNum]["volume"] + Math.round(value.price));
    swapData[blockNum]["avgprice"] = Math.round(swapData[blockNum]["volume"]/swapData[blockNum]["sales"]);
  }

  var total = 0;
  for (const [key, value] of Object.entries(swapData)) {
    total = total + swapData[key]["volume"];
  }

  return [swapData, total];
}

const swapInfo = await (collectionInfo("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"))
console.log(swapInfo)
