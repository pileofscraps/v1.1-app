import './App.css';
import { useState, useEffect } from "react";
import axios from "axios";
import collectionInfo from "./collectionInfo.js"

const contractAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
const apiKey = "demo";

function App() {
  const [contractName, setContractName] = useState({});
  const [contractSupply, setContractSupply] = useState({});
  const [contractSample, setContractSample] = useState({});
  const [priceVolume, setPriceVolume] = useState({});
  const [isPriceVolLoading, setPriceVolLoading] = useState(true);
  const [isContractLoading, setContractLoading] = useState(true);
  const [isSampleLoading, setSampleLoading] = useState(true);

  const getContractInfo = async () => {
    const nftMetadataURL = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}/getContractMetadata/?contractAddress=${contractAddress}`;
    const response = await axios.get(nftMetadataURL);

    setContractName(response.data.name);
    setContractSupply(response.data.contractMetadata.totalSupply);
    setContractLoading(false);
  };

  const getContractSample = async () => {

    const nftMetadataURL = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}/getNFTsForCollection/?contractAddress=${contractAddress}&withMetadata=true`;
    const response = await axios.get(nftMetadataURL);

    setContractLoading(
      [response.data.nfts[0].media[0].gateway,
      response.data.nfts[1].media[0].gateway,
      response.data.nfts[2].media[0].gateway,
      response.data.nfts[3].media[0].gateway,
      response.data.nfts[4].media[0].gateway,
    ])
    setContractLoading(false);
  };

  const getPriceVolume = async () => {

    const response = await collectionInfo(contractAddress);

    setPriceVolume(response[1])
    setPriceVolLoading(false);
  };

  useEffect(() => {
    getContractInfo();
  }, []);

  useEffect(() => {
    getContractSample();
  }, []);

  useEffect(() => {
    getPriceVolume();
  }, []);

  if ((isContractLoading == false) && (isSampleLoading == false) && (isPriceVolLoading == false)) {

    return (
        <div class="bg-white centered m-10 rounded-lg shadow-3xl md:flex max-w-2xl ">
          <div class="p-6">

          <h1 class="font-bold md:text-4xl text-black marginBottom:2">
          <div class="avatar align-middle">
            <div class="w-16 rounded-full">
              <img src={contractSample[0]} />
            </div>
          </div>
           &nbsp; {contractName} </h1>
            <p class="text-black">

              <div class="stats bg-primary-content shadow m-1 shadow-3xl w-full">

              <div class="stat place-items-center">
                <div class="stat-value text-black"> {(contractSupply/1000).toFixed(1)} K </div>
                <div class="stat-title text-black">NFTs</div>
              </div>

              <div class="stat place-items-center">
              <div class="avatar">
                <div class="w-12 rounded-full">
                  <img src="https://www.vhv.rs/dpng/d/420-4206472_fork-cryptocurrency-ethereum-bitcoin-classic-png-download-ethereum.png" />
                </div>
              </div>
                <div class="stat-figure text-secondary">
                <div class="stat-value text-black"> ---- </div>
                <div class="stat-title text-black">Last Sold Price</div>
                </div>
              </div>

              <div class="stat place-items-center">
                <div class="avatar">
                  <div class="w-12 rounded-full">
                    <img src="https://www.vhv.rs/dpng/d/420-4206472_fork-cryptocurrency-ethereum-bitcoin-classic-png-download-ethereum.png" />
                  </div>
                </div>
                <div class="stat-figure text-secondary ">
                  <div class="stat-value text-black"> {priceVolume} </div>
                  <div class="stat-title text-black">Volume Traded</div>
                </div>
              </div>
            </div>

            <div class="flex justify-evenly .... mt-2">
              <div class="avatar">
                <div class="object-contain rounded-xl m-2 place-items-center">
                <img src={contractSample[1]} />
                </div>
              </div>
              <div class="avatar">
                <div class="object-contain rounded-xl m-2 place-items-center">
                <img src={contractSample[2]} />
                </div>
              </div>
              <div class="avatar">
                <div class="object-contain rounded-xl m-2 place-items-center">
                <img src={contractSample[3]} />
                </div>
              </div>
              <div class="avatar">
                <div class="object-contain rounded-xl m-2 place-items-center">
                <img src={contractSample[4]} />
                </div>
              </div>
            </div>

            </p>
          </div>

        </div>
      )
    }

    else if ((isContractLoading == false) && (isSampleLoading == false) && (isPriceVolLoading == true)) {

    return (
          <div class="bg-white centered m-10 rounded-lg shadow-3xl md:flex max-w-2xl ">
            <div class="p-6">

            <h1 class="font-bold md:text-4xl mb-2 text-black marginBottom:2">
            <div class="avatar">
              <div class="w-16 rounded-full">
                <img src="https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image-768x576.png" />
              </div>
            </div>
             &nbsp;  {contractName} </h1>
              <p class="text-black">

                <div class="stats bg-primary-content shadow m-1 shadow-3xl w-full">

                <div class="stat place-items-center">
                  <div class="stat-value text-black"> {(contractSupply/1000).toFixed(1)} K </div>
                  <div class="stat-title text-black">NFTs</div>
                </div>

                <div class="stat place-items-center">
                <div class="avatar">
                  <div class="w-12 rounded-full">
                    <img src="https://www.vhv.rs/dpng/d/420-4206472_fork-cryptocurrency-ethereum-bitcoin-classic-png-download-ethereum.png" />
                  </div>
                </div>
                  <div class="stat-figure text-secondary">
                  <div class="stat-value text-black"> ----- </div>
                  <div class="stat-title text-black">Last Sold Price</div>
                  </div>
                </div>

                <div class="stat place-items-center">
                  <div class="avatar">
                    <div class="w-12 rounded-full">
                      <img src="https://www.vhv.rs/dpng/d/420-4206472_fork-cryptocurrency-ethereum-bitcoin-classic-png-download-ethereum.png" />
                    </div>
                  </div>
                  <div class="stat-figure text-secondary ">
                    <div class="stat-value text-black"> ----- </div>
                    <div class="stat-title text-black">Volume Traded</div>
                  </div>
                </div>
              </div>


              </p>
            </div>

          </div>
        )

      }

    else {
      return (
          <div class="bg-white centered m-10 rounded-lg shadow-3xl md:flex max-w-2xl ">
            <div class="p-6">

            <h1 class="font-bold md:text-4xl mb-2 text-black marginBottom:2">
            <div class="avatar">
              <div class="w-16 rounded-full">
                <img src="https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image-768x576.png" />
              </div>
            </div>
             &nbsp; ----------- </h1>
              <p class="text-black">

                <div class="stats bg-primary-content shadow m-1 shadow-3xl w-full">

                <div class="stat place-items-center">
                  <div class="stat-value text-black"> --- K </div>
                  <div class="stat-title text-black">NFTs</div>
                </div>

                <div class="stat place-items-center">
                <div class="avatar">
                  <div class="w-12 rounded-full">
                    <img src="https://www.vhv.rs/dpng/d/420-4206472_fork-cryptocurrency-ethereum-bitcoin-classic-png-download-ethereum.png" />
                  </div>
                </div>
                  <div class="stat-figure text-secondary">
                  <div class="stat-value text-black"> ----- </div>
                  <div class="stat-title text-black">Last Sold Price</div>
                  </div>
                </div>

                <div class="stat place-items-center">
                  <div class="avatar">
                    <div class="w-12 rounded-full">
                      <img src="https://www.vhv.rs/dpng/d/420-4206472_fork-cryptocurrency-ethereum-bitcoin-classic-png-download-ethereum.png" />
                    </div>
                  </div>
                  <div class="stat-figure text-secondary ">
                    <div class="stat-value text-black"> ----- </div>
                    <div class="stat-title text-black">Volume Traded</div>
                  </div>
                </div>
              </div>


              </p>
            </div>

          </div>
        )
      }
  }



export default App;
