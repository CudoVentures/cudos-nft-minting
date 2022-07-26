# Introduction

This project is a GUI of the NFT features of the CUDOS network. Its goal is to provide a smplified way of minting of an NFT or a collection.

# Installation

## Prerequirements

1. CudosBuilders repo
1. Endpoint of an IPFS node
1. Endpoints of a running CudosNode
1. Captcha keys
1. An existing NFT collection's id
1. Mnemnic of a wallet with funds

## Build

The build step consists of three steps:

### I. Clone the repos

Clone [CudosBuilders](https://github.com/CudoVentures/cudos-builders.git) repo in ./CudosBuilders directory

Clone [CudosNftMintingUI](https://github.com/CudoVentures/cudos-nft-minting-ui.git) repo in ./CudosNftMintingUI directory

Both repos must be in the same folder.

### II. Prepare the .env

Prepare the following .env depending on the desired environment.

<em>For **development environment** clone the <code>/CudosBuilders/docker/nft-minting-ui/nft-minting-ui.dev.env.example</code> to <code>./CudosBuilders/docker/nft-minting-ui/nft-minting-ui.dev.env</code></em>

<em>For **testnet-private environment** clone the <code>/CudosBuilders/docker/nft-minting-ui/nft-minting-ui.dev.env.example</code> to <code>./CudosBuilders/docker/nft-minting-ui/nft-minting-ui.testnet.private.env</code></em>

<em>For **testnet-public environment** clone the <code>/CudosBuilders/docker/nft-minting-ui/nft-minting-ui.dev.env.example</code> to <code>./CudosBuilders/docker/nft-minting-ui/nft-minting-ui.testnet.public.env</code></em>

<em>For **mainnet environment** clone the <code>/CudosBuilders/docker/nft-minting-ui/nft-minting-ui.dev.env.example</code> to <code>./CudosBuilders/docker/nft-minting-ui/nft-minting-ui.mainnet.env</code></em>

Fill the following params:

1. **NODE_ENV:** Describes the environment. It could be "production" or "dev". <em>Example: NODE_ENV="production"</em>
1. **BACKEND_PORT:** On that port the node process will listen at. <em>Example: BACKEND_PORT="4001"</em>
1. **FRONTEND_PORT:** On that port the service will be accessiable from the web. <em>Example: FRONTEND_PORT="4001"</em>
1. **URL:** The base url of the service. <em>Example: URL="https://nft.cudos.org"</em>
1. **SESSION_UNIQUE_KEY:** Random string for stroing session data. <em>Example: SESSION_UNIQUE_KEY="hg0248y082yg20h"</em>
1. **CAPTCHA_FRONTEND_KEY:** Captcha's frontend key obtained from Google's captcha control panel.
1. **CAPTCHA_SECRET_KEY:** Captcha's backend key obtained from Google's captcha control panel.
1. **CHAIN_NAME:** Name to be displayed in the Keprl wallet. <em>Example: CHAIN_NAME="CudosTestnet-Local"</em>
1. **CHAIN_ID:** Id of the chain. <em>Example: CHAIN_ID="cudos-debug-network"</em>
1. **RPC:** RPC endpoint of the chain. <em>Example: RPC="http://localhost:26657"</em>
1. **API:** API endpoint of the chain. <em>Example: RPC="http://localhost:1317"</em>
1. **GAS_PRICE:** Gas price of the chain. <em>Example: GAS_PRICE="5000000000000"</em>
1. **EXPLORER:** Base URL of the explorer. <em>Example: EXPLORER="http://explorer.testnetprivate"</em>
1. **STAKING:** Base URL of the staking page. <em>Example: STAKING="http://localhost:3000/validators"</em>
1. **GRAPHQL:** Base URL of the BDJuno. <em>Example: GRAPHQL="http://....."</em>
1. **NFT_DENOM_ID:** Denom's id of the default collection where the NFT will be minted at. <em>Example: NFT_DENOM_ID="cudosone"</em>
1. **SIGNER_MNEMONIC:** Mnemonic of the wallet that will pay the transaction fees when minting NFTs to the default collection <em>Example: SIGNER_MNEMONIC="word1...word24"</em>
1. **INFURA_HOST:** IPFS endpoint <em>Example: INFURA_HOST="https://ipfs.infura.io:5001"</em>
1. **INFURA_ID:** Id required when using Infura's IPFS node. It can be obtained from Infura's control panel. <em>Example: INFURA_ID="425u80425802458"</em>
1. **INFURA_SECRET:** Secret key required when using Infura's IPFS node. It can be obtained from Infura's control panel. <em>Example: INFURA_SECRET="425u80425802458"</em>

### IIII. Start the docker

Navigate to <code>./CudosBuilders/docker/nft-minting-ui</code> and execute the following shell script based on desired environment:

**Development:**
    
For development you must prepare the the <code>users-nft-minting-ui.dev.override.yml</code> as described [here](https://github.com/CudoVentures/cudos-builders/tree/cudos-master/docker#users-override)

    sudo docker-compose --env-file ./nft-minting-ui.dev.arg -f ./nft-minting-ui.dev.yml -f ./users-nft-minting-ui.dev.override.yml -p cudos-nft-minting-ui-dev up --build -d

**Testnet-private:**
    
    sudo docker-compose --env-file ./nft-minting-ui.testnet.private.arg -f ./nft-minting-ui.release.yml -p cudos-nft-minting-ui-testnet-private up --build -d

**Testnet-public:**
    
    sudo docker-compose --env-file ./nft-minting-ui.testnet.public.arg -f ./nft-minting-ui.release.yml -p cudos-nft-minting-ui-testnet-public up --build -d

**Mainnet:**
    
    sudo docker-compose --env-file ./nft-minting-ui.mainnet.arg -f ./nft-minting-ui.release.yml -p cudos-nft-minting-ui-mainnet up --build -d
