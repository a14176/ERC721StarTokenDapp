# ERC721 Star Token
This DApp allows interaction with the newly created ERC721 Star Token Contract that has been deployed on to the public rinkeby testnet.

* Truffle v5.4.33 (core: 5.4.33)
* Ganache v7.0.1
* Solidity v0.5.16 (solc-js)
* Node v16.13.1
* Web3.js v1.5.3
* OpenZeppelin version: 2.3.0
* Token Name: Star Token
* Token Symbol: STA
* Token Address: 0x62F912C4E5C40A678701B927Bf7E9b8d1500C4EF


### Deploy contract to rinkeby
```bash
truffle migrate --reset --network rinkeby
```

### Deploying 'StarNotary' to the rinkeby network
- transaction hash:  0xbc26e0826fe94db23338125aa753b1884b8d3d5510936693de97a1a20eff6a72
- Blocks: 1            Seconds: 12
- contract address:    0x62F912C4E5C40A678701B927Bf7E9b8d1500C4EF
- block number:        10161497
- block timestamp:     1644767745
- account:             0xeB50058CfFDF8f25830884fac1F890E479BbfFa4
- balance:             0.27650377
- gas used:            2277323 (0x22bfcb)
- gas price:           10 gwei
- value sent:          0 ETH
- total cost:          0.02277323 ETH
- Saving migration to chain.
- Saving artifacts
- Total cost:          0.02277323 ETH

---
### Installation & Dependencies
For this project, you will need to have:
1. **Node and NPM** installed - NPM is distributed with [Node.js](https://www.npmjs.com/get-npm)
```bash
# Check Node version
node -v
# Check NPM version
npm -v
```


2. **Truffle v5.X.X** - A development framework for Ethereum. 
```bash
# Unsinstall any previous version
npm uninstall -g truffle
# Install
npm install -g truffle
# OR Specify a particular version
npm install -g truffle@5.0.2
# Verify the version
truffle version
```


2. **Metamask: ** - If you need to update Metamask just delete your Metamask extension and install it again.


3. [Ganache](https://www.trufflesuite.com/ganache) - Make sure that your Ganache and Truffle configuration file have the same port.


4. **Other mandatory packages**:
```bash
cd app
# install packages
npm install --save  openzeppelin-solidity@2.3
npm install --save  truffle-hdwallet-provider@1.0.17
npm install webpack-dev-server -g
npm install web3
```


### Run the application
1. Clean the frontend 
```bash
cd app
# Remove the node_modules  
# remove packages
rm -rf node_modules
# clean cache
npm cache clean
rm package-lock.json
# initialize npm (you can accept defaults)
npm init
# install all modules listed as dependencies in package.json
npm install
```


2. Start Truffle by running
```bash
# For starting the development console
truffle develop
# truffle console

# For compiling the contract, inside the development console, run:
compile

# For migrating the contract to the locally running Ethereum network, inside the development console
migrate --reset

# For running unit tests the contract, inside the development console, run:
test
```

3. Frontend - Once you are ready to start your frontend, run the following from the app folder:
```bash
cd app
npm run dev
```

---

### Important
When you will add a new Rinkeyby Test Network in your Metamask client, you will have to provide:

| Network Name | New RPC URL | Chain ID |
|---|---|---|
|Private Network 1|`http://127.0.0.1:9545/`|1337 |

The chain ID above can be fetched by:
```bash
cd app
node index.js
```

## Troubleshoot
#### Error 1 
```
'webpack-dev-server' is not recognized as an internal or external command
```
**Solution:**
- Delete the node_modules folder, the one within the /app folder
- Execute `npm install` command from the /app folder

After a long install, everything will work just fine!


#### Error 2
```
ParserError: Source file requires different compiler version. 
Error: Truffle is currently using solc 0.5.16, but one or more of your contracts specify "pragma solidity >=0.X.X <0.X.X".
```
**Solution:** In such a case, ensure the following in `truffle-config.js`:
```js
// Configure your compilers  
compilers: {    
  solc: {      
    version: "0.5.16", // <- Use this        
    // docker: true,
    // ...
```