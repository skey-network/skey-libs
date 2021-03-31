# skey-lib

## Usage

```js
// Add this to package.json dependencies
// ... "skey-lib": "git+https://github.com/adrian-rom64/skey-lib.git"
// and run npm install or yarn

import { getInstance } from 'skey-lib'

const lib = getInstance({
  nodeUrl: 'https://nodes-testnet.wavesnodes.com',
  chainId: 'T',
})

const device = await lib.fetchDevice('3P5dg6PtSAQmdH1qCGKJWu7bkzRG27mny5i'))

console.log(device.name)
```

## Development and testing
```bash
npm install
# or
yarn

npm test
```

## Documentation

- ### **createAccount**  
  returns new random seed, address, public key and private key
- ### **extractValuesFromKey**  
  extracts device address and validTo timestamp from key description
- ### **fetchKeyOwner**  
  fetches the address that is currently in posesion of token  
  **IMPORTANT** use current height - 1 
- ### **fetchHeight**  
  fetches current blockchain height
- ### **fetchDataWithRegex**  
  fetches data entries from address using regex filter
- ### **fetchDevices**  
  fetches device addresses from date entries of dapp
- ### **request**  
  requests any data from blockchain  
  https://nodes.wavesnodes.com/api-docs
- ### **fetchKeyWhitelist**  
  fetches key data entries from any address
- ### **waitForNBlocks**  
  waits until n amount of blocks passes and resolves the promise
- ### **delay**  
  wait until n amount of milliseconds pass and resolves the promise
- ### **broadcast**  
  broadcasts tx and waits 
- ### **transferKey**  
  transfer selected token to different address
- ### **WVS**  
  10 ** 8
- ### **FEE_MULTIPLIER**
  10 ** 5  
- ### **fetchDevice**
  fetches device data of address  
- ### **interactWithDevice**  
  invoke deviceAction function on device
- ### **interactWithDeviceAs**  
  invoke deviceActionAs function on device
- ### **onBlockchainUpdate**
  listener function that fires callback when new block is mined
- ### **generateKey**
  generate new key for device
- ### **insertData**
  send data transaction to address
- ### **setScript**
  set base64 script on address
- ### **fetchKey**
  fetch key details by assetId
  