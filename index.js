const Web3 = require('web3')
const { encrypt, decrypt } = require('./lib/encryption')
const signMsg = require('./lib/sign')


const decode = str => JSON.parse(str)
const encode = data => typeof data == 'string' ? data : JSON.stringify(data)

function getSymmetricKey(web3, account, salt) {
  return signMsg(web3, account, salt)
}

async function sigEncrypt(web3, account, msg, salt) {
  let key = await getSymmetricKey(web3, account, salt)
  key = key.signature
  const data = encode(msg)
  const cipher = encrypt(data, key)
  return cipher
}

async function sigDecrypt(web3, account, cipher, salt) {
  let key = await getSymmetricKey(web3, account, salt)
  key = key.signature
  const data = decrypt(cipher, key)
  let result
  try {
    result = decode(data)
  } catch(e) {
    result = data
  }
  return result
}

const constructWeb3 = providerUrl => new Web3(new Web3.providers.HttpProvider(providerUrl))

class EthSigEncryption {
  constructor(web3, account, salt) {
    if (typeof web3 == 'string') this.web3 = constructWeb3(web3)
    else this.web3 = web3
    this.account = account
    this.salt = salt
  }

  async encrypt(message, options) {
    const { web3, account, salt } = options ? options : this
    return sigEncrypt(web3, account, message, salt)
  }

  async decrypt(cipher, options) {
    const { web3, account, salt } = options ? options : this
    return sigDecrypt(web3, account, cipher, salt)
  }
}

module.exports = {
  EthSigEncryption,
  sigEncrypt,
  sigDecrypt,
  getSymmetricKey,
  signMsg,
  encrypt,
  decrypt,
  constructWeb3
}
