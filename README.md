# eth-sig-encrypt
Provides methods for symmetric encryption/decryption using Ethereum signatures.

Usually when we use a web3 provider on a browser, such as MetaMask, Fortmatic, Bitski, etc., we do not have access to the private keys of accounts. Since we may want some secure mechanism for a user to store data on a server and retrieve it later, we need a workaround. 

The method employed in this library is to take some arbitrary salt which the client can be assumed to always have access to, create a signature of that salt using the web3 provider, then use that signature as a symmetric key to encrypt some data. So long as the signature is never revealed, this should be a secure encryption method when we do not have access to private keys.

## Installation

### Node

```bash
npm install eth-sig-encrypt
```

## Usage

```js
const { 
  EthSigEncryption, sigEncrypt, sigDecrypt, constructWeb3 
} = require('eth-sig-encrypt')

/*
constructWeb3 takes an http provider url and returns a web3 instance
but you can provide your own Web3 object to EthSigEncryption
*/

const web3 = constructWeb3('https://mainnet.infura.io/v3');
const account = web3.eth.accounts.create();
const message = 'hello crypto boys'
const salt = 'special-salt'

async function testCryptoFunctions() {
    const cipher = await sigEncrypt(web3, account, message, salt)
    console.log(`cipher from encrypt function: ${cipher}`)
    const decipher = await sigDecrypt(web3, account, cipher, salt)
    console.log(`deciphered message: ${decipher}`)
    console.log(`deciphered message ${decipher == message ? 'matches' : 'does not match'} original`)
}   
testCryptoFunctions()
`
> cipher from encrypt function: f7b5efbe6d7ac17d89032ba428acfc89f10cf5fc10305732ee1b741f1f73b4a2
> deciphered message: hello crypto boys
> deciphered message matches original
`

async function testCryptoObject() {
    const sigCrypto = new EthSigEncryption(web3, account, salt)
    const cipher = await sigCrypto.encrypt(message)
    console.log(`cipher from encrypt function: ${cipher}`)
    const decipher = await sigCrypto.decrypt(cipher)
    console.log(`deciphered message: ${decipher}`)
    console.log(`deciphered message ${decipher == message ? 'matches' : 'does not match'} original`)
}
testCryptoObject()
`
> cipher from encrypt function: f7b5efbe6d7ac17d89032ba428acfc89f10cf5fc10305732ee1b741f1f73b4a2
> deciphered message: hello crypto boys
> deciphered message matches original
`
```

# sigEncrypt(web3, account, message, salt)

**Params**

- web3 `object` - Instance of a Web3 object
- account `object` - Instance of an Ethereum account, such as from web3.eth.accounts
- message `string` - The message to encrypt
- salt `string` - The salt input which is signed by the web3 account

**Returns**: `Promise<string>` Cipher text after encryption

# sigDecrypt(web3, account, cipher, salt)

**Params**

- web3 `object` - Instance of a Web3 object
- account `object` - Instance of an Ethereum account, such as from web3.eth.accounts
- cipher `string` - The ciphertext to decrypt
- salt `string` - The salt input which is signed by the web3 account

**Returns**: `Promise<string>` Decrypted message

# EthSigEncryption.encrypt(message, options)
Calls sigEncrypt() using the EthSigEncryption instance properties or the overridden options
**Params**

- message `string` - The message to encrypt
- options `object` - Optional properties 
    - salt `string` - The salt input which is signed by the web3 account
    - web3 `object` - Instance of a Web3 object
    - account `object` - Instance of an Ethereum account, such as from web3.eth.accounts

**Returns**: `Promise<string>` Cipher text after encryption

# EthSigEncryption.decrypt(cipher, options)
Calls sigDecrypt() using the EthSigEncryption instance properties or the overridden options
**Params**

- cipher `string` - The ciphertext to decrypt
- options `object` - Optional properties 
    - salt `string` - The salt input which is signed by the web3 account
    - web3 `object` - Instance of a Web3 object
    - account `object` - Instance of an Ethereum account, such as from web3.eth.accounts

**Returns**: `Promise<string>` Cipher text after encryption

